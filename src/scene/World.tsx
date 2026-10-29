import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Sky as ThreeSky } from "three/addons/objects/Sky.js";
import { CLOUD_BASE, CLOUD_TOP, CRUISE_ALT, FLOOR_ALT, flight, reducedMotion } from "./flight";

/*
  The world the jet descends through: a sky dome that runs from near-space
  black at cruise down to a dusk horizon, a starfield that fades as the air
  thickens, a cloud deck to punch through, and the ground with city lights
  and a runway at the bottom. The jet never moves forward; the world slides
  past it along +z, which keeps the camera maths trivial.
*/

const GROUND_SPEED = 70; // world units per second the terrain slides past

/**
  The opening is a black screen with only the name and the jet. The world
  fades up from black over the second half of the intro, once the jet has
  crossed the name, so this is 0 at the top of the page and 1 after it.
*/
function reveal() {
  return THREE.MathUtils.smoothstep(flight.intro, 0.45, 1);
}

const BLACK = new THREE.Color(0, 0, 0);

/** 0 at cruise altitude, 1 on the deck */
function lowness(altitude: number) {
  return THREE.MathUtils.clamp(1 - (altitude - FLOOR_ALT) / (CRUISE_ALT - FLOOR_ALT), 0, 1);
}

const C = {
  fogHigh: new THREE.Color("#0b1530"),
  fogLow: new THREE.Color("#8c5a4a"),
};

/** sky, fog and lights all take their colours from the same lowness value */
export function useAtmosphere() {
  const scene = useThree((s) => s.scene);
  const fog = useMemo(() => new THREE.Fog(C.fogHigh.clone(), 300, 2600), []);
  scene.fog = fog;
  return fog;
}

/** sun azimuth: ahead and to the right, over the jet's side of the frame */
const SUN_AZIMUTH = Math.atan2(0.62, -1);
/** sun elevation in degrees: deep twilight at cruise, setting at the runway */
const SUN_ELEV_HIGH = -6;
const SUN_ELEV_LOW = 0.6;

/** where the sun is for a given lowness, as a unit vector (shared with lighting) */
export function sunDirection(low: number, out = new THREE.Vector3()) {
  const elev = THREE.MathUtils.degToRad(THREE.MathUtils.lerp(SUN_ELEV_HIGH, SUN_ELEV_LOW, low));
  return out.setFromSphericalCoords(1, Math.PI / 2 - elev, SUN_AZIMUTH);
}

/*
  Physically based sky (Preetham scattering, three's Sky addon). The sun
  sits below the horizon at cruise, so the sky is a deep twilight the
  stars show through, and rises to just above it on approach for a real
  sunset with Mie glow around the disc. Its own procedural clouds are
  turned off (see makeSky).

  The shader is patched to multiply its final colour by uReveal (black
  opening) and uExposure (overall brightness, tuned by altitude).
*/
/** three's Sky, patched with reveal + exposure and tuned for a hazy dusk */
function makeSky() {
  const m = new ThreeSky();
  m.frustumCulled = false;
  const mat = m.material as THREE.ShaderMaterial;
  mat.fog = false;
  mat.uniforms.uReveal = { value: 0 };
  mat.uniforms.uExposure = { value: 1 };
  mat.fragmentShader = mat.fragmentShader
    .replace("uniform float time;", "uniform float time;\nuniform float uReveal;\nuniform float uExposure;")
    .replace("gl_FragColor = vec4( texColor, 1.0 );", "gl_FragColor = vec4( texColor * uExposure * uReveal, 1.0 );");
  const u = mat.uniforms;
  // hazier, more scattering air than the clear-day defaults, which
  // pushes a low sun toward deep orange instead of a white glare
  u.turbidity.value = 12;
  u.rayleigh.value = 4;
  u.mieCoefficient.value = 0.005;
  u.mieDirectionalG.value = 0.82;
  // the addon's built-in clouds formed concentric rings around a low sun;
  // the sprite cloud deck already does that job
  u.cloudCoverage.value = 0;
  return m;
}

/** shared per-frame sky state, so the visible sky and its reflection agree */
function updateSky(sky: THREE.Mesh, low: number, r: number, sun: THREE.Vector3, time: number) {
  const u = (sky.material as THREE.ShaderMaterial).uniforms;
  u.sunPosition.value.copy(sun);
  u.time.value = time;
  u.uReveal.value = r;
  // Preetham output is HDR; hold the exposure down near the sun-lit
  // horizon so the sunset stays saturated after tone mapping
  u.uExposure.value = THREE.MathUtils.lerp(0.9, 0.42, low);
}

function Sky() {
  const sky = useMemo(() => {
    const m = makeSky();
    m.scale.setScalar(8000);
    m.renderOrder = -10;
    return m;
  }, []);
  const sun = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, clock }) => {
    const low = lowness(camera.position.y);
    sunDirection(low, sun);
    updateSky(sky, low, reveal(), sun, reducedMotion ? 0 : clock.elapsedTime);
    sky.position.copy(camera.position);
  });

  return <primitive object={sky} />;
}

/*
  Reflections: a second, cloudless copy of the sky is rendered into a
  prefiltered environment map (PMREM) and set as scene.environment, so
  the jet's metal and canopy pick up the twilight blue at altitude and
  the sunset on approach. Re-baking costs a few cube renders, so it only
  happens when altitude or the opening reveal has moved noticeably.
*/
function SkyReflections() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const probe = useMemo(() => {
    const envScene = new THREE.Scene();
    const sky = makeSky();
    sky.scale.setScalar(10);
    envScene.add(sky);
    return { envScene, sky, pmrem: new THREE.PMREMGenerator(gl), sun: new THREE.Vector3() };
  }, [gl]);
  const last = useRef({ low: -1, r: -1, target: null as THREE.WebGLRenderTarget | null });

  useEffect(
    () => () => {
      last.current.target?.dispose();
      probe.pmrem.dispose();
      scene.environment = null;
    },
    [probe, scene],
  );

  useFrame(({ camera }) => {
    const low = lowness(camera.position.y);
    const r = reveal();
    const prev = last.current;
    if (Math.abs(low - prev.low) < 0.015 && Math.abs(r - prev.r) < 0.05) return;
    sunDirection(low, probe.sun);
    updateSky(probe.sky, low, r, probe.sun, 0);
    const target = probe.pmrem.fromScene(probe.envScene, 0, 0.1, 100);
    prev.target?.dispose();
    scene.environment = target.texture;
    scene.environmentIntensity = 0.9;
    last.current = { low, r, target };
  });

  return null;
}

function Stars({ count = 2600 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const size = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // upper hemisphere only, denser toward the zenith
      const u = Math.random();
      const v = Math.random() * 0.95 + 0.02;
      const theta = u * Math.PI * 2;
      const phi = Math.acos(v);
      const r = 3500;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      size[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    return g;
  }, [count]);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        fog: false,
        uniforms: { uOpacity: { value: 1 }, uTime: { value: 0 }, uPixelRatio: { value: 1 } },
        vertexShader: /* glsl */ `
          attribute float aSize;
          uniform float uTime;
          uniform float uPixelRatio;
          varying float vTwinkle;
          void main() {
            vTwinkle = 0.65 + 0.35 * sin(uTime * (0.6 + aSize * 2.0) + aSize * 40.0);
            gl_PointSize = (0.8 + pow(aSize, 6.0) * 2.4) * uPixelRatio;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: /* glsl */ `
          uniform float uOpacity;
          varying float vTwinkle;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, d);
            gl_FragColor = vec4(vec3(0.85, 0.9, 1.0), a * uOpacity * vTwinkle);
          }`,
      }),
    [],
  );

  useFrame(({ camera, clock, gl }) => {
    const low = lowness(camera.position.y);
    mat.uniforms.uOpacity.value = THREE.MathUtils.clamp(1 - low * 1.35, 0, 1) * reveal();
    mat.uniforms.uTime.value = reducedMotion ? 0 : clock.elapsedTime;
    mat.uniforms.uPixelRatio.value = gl.getPixelRatio();
    ref.current.position.copy(camera.position);
  });

  return <points ref={ref} geometry={geo} material={mat} renderOrder={-9} frustumCulled={false} />;
}

function cloudTexture() {
  const size = 128;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  // a few overlapping soft puffs so each sprite isn't a perfect circle
  for (let i = 0; i < 7; i++) {
    const x = size / 2 + (Math.random() - 0.5) * size * 0.35;
    const y = size / 2 + (Math.random() - 0.5) * size * 0.22;
    const r = size * (0.22 + Math.random() * 0.2);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(255,255,255,0.55)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const CLOUD_SPAN = 2400; // depth of the cloud field that wraps around the camera

function Clouds({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null!);
  const offset = useRef(0);
  const { tex, puffs } = useMemo(() => {
    const tex = cloudTexture();
    const puffs = Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 1600,
      y: THREE.MathUtils.lerp(CLOUD_BASE, CLOUD_TOP, Math.random()),
      z: Math.random() * CLOUD_SPAN,
      s: 140 + Math.random() * 220,
      o: 0.28 + Math.random() * 0.3,
    }));
    return { tex, puffs };
  }, [count]);

  const mats = useMemo(
    () =>
      puffs.map(
        (p) =>
          new THREE.SpriteMaterial({
            map: tex,
            transparent: true,
            depthWrite: false,
            opacity: p.o,
            color: "#c6d0e4",
            rotation: Math.random() * Math.PI,
          }),
      ),
    [puffs, tex],
  );

  const tint = useMemo(() => new THREE.Color(), []);

  useFrame(({ camera }, delta) => {
    if (!reducedMotion) offset.current += delta * GROUND_SPEED;
    const low = lowness(camera.position.y);
    // moonlit blue up high, warmed by the sunset underneath
    tint.set("#aab6d0").lerp(new THREE.Color("#e9b493"), Math.pow(low, 2));
    const r = reveal();
    group.current.children.forEach((child, i) => {
      const p = puffs[i];
      // wrap each puff so the deck is endless along the flight path
      const z = ((p.z + offset.current) % CLOUD_SPAN) - CLOUD_SPAN * 0.8;
      child.position.set(p.x, p.y, z);
      const m = mats[i];
      m.color.copy(tint);
      // thin out the puffs right in front of the lens so text stays legible
      const d = child.position.distanceTo(camera.position);
      m.opacity = p.o * THREE.MathUtils.smoothstep(d, 40, 220) * r;
    });
  });

  return (
    <group ref={group}>
      {puffs.map((p, i) => (
        <sprite key={i} material={mats[i]} scale={[p.s * 1.8, p.s, 1]} />
      ))}
    </group>
  );
}

function Ground() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        fog: false,
        uniforms: {
          uOffset: { value: 0 },
          uCam: { value: new THREE.Vector3() },
          uFog: { value: new THREE.Color() },
          uLow: { value: 0 },
          uTime: { value: 0 },
          uReveal: { value: 0 },
        },
        vertexShader: /* glsl */ `
          varying vec3 vWorld;
          void main() {
            vec4 w = modelMatrix * vec4(position, 1.0);
            vWorld = w.xyz;
            gl_Position = projectionMatrix * viewMatrix * w;
          }`,
        fragmentShader: /* glsl */ `
          uniform float uOffset;
          uniform vec3 uCam;
          uniform vec3 uFog;
          uniform float uLow;
          uniform float uTime;
          uniform float uReveal;
          varying vec3 vWorld;

          float hash(vec2 p) {
            vec3 p3 = fract(vec3(p.xyx) * 0.1031);
            p3 += dot(p3, p3.yzx + 33.33);
            return fract((p3.x + p3.y) * p3.z);
          }
          float noise(vec2 p) {
            vec2 i = floor(p), f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
                       mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
          }
          float fbm(vec2 p) {
            float v = 0.0, a = 0.5;
            for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
            return v;
          }
          float gridLine(float coord, float spacing) {
            float c = coord / spacing;
            float w = fwidth(c);
            float l = abs(fract(c - 0.5) - 0.5);
            return 1.0 - smoothstep(0.0, w * 1.2, l);
          }

          void main() {
            // the terrain slides toward +z, so sample it behind the offset
            vec2 q = vWorld.xz - vec2(0.0, uOffset);

            float land = fbm(q * 0.0025);
            float fields = fbm(q * 0.018 + 7.0);
            vec3 col = mix(vec3(0.035, 0.045, 0.06), vec3(0.075, 0.085, 0.095), land);
            col = mix(col, col * vec3(1.15, 1.1, 0.9), step(0.55, fields) * 0.6);

            // a faint navigation grid, the HUD's idea of the ground
            float g = max(gridLine(q.x, 120.0), gridLine(q.y, 120.0));
            col += vec3(0.91, 0.69, 0.29) * g * 0.07;

            // clustered city lights
            vec2 cell = floor(q / 9.0);
            float r = hash(cell);
            float town = smoothstep(0.52, 0.72, fbm(cell * 0.035));
            vec2 c = (cell + 0.25 + 0.5 * vec2(hash(cell + 3.1), hash(cell + 7.7))) * 9.0;
            float dl = length(q - c);
            float lit = step(1.0 - town * 0.75, r);
            float pw = fwidth(dl);
            float dotA = smoothstep(0.9 + pw, 0.0, dl) * lit;
            float tw = 0.75 + 0.25 * sin(uTime * 3.0 + r * 60.0);
            vec3 lightCol = mix(vec3(1.0, 0.72, 0.38), vec3(0.85, 0.9, 1.0), step(0.8, hash(cell + 1.7)));
            col += lightCol * dotA * 1.6 * tw;

            // runway: tarmac, edge lights, centreline dashes
            float rx = abs(vWorld.x);
            float strip = 1.0 - smoothstep(13.0, 13.5, rx);
            col = mix(col, vec3(0.03, 0.032, 0.036), strip * 0.92);
            float edge = smoothstep(1.4, 0.0, length(vec2(rx - 14.0, mod(q.y, 28.0) - 14.0)));
            float dash = (1.0 - smoothstep(0.25, 0.55, rx)) * step(0.5, fract(q.y / 24.0));
            float runwayOn = smoothstep(0.55, 0.9, uLow);
            col += vec3(1.0, 0.82, 0.55) * edge * 2.2 * runwayOn;
            col += vec3(0.9) * dash * 0.35 * runwayOn;

            // haze: thicker the farther the ground is from the eye
            float d = distance(vWorld, uCam);
            float f = 1.0 - exp(-d * mix(0.0012, 0.0016, uLow));
            col = mix(col, uFog, clamp(f, 0.0, 1.0));
            // colours above are authored in display (sRGB) terms; the post
            // chain works in linear light and re-encodes at the end, so square
            // them (gamma 2.0, close to sRGB). Squaring rather than pow() keeps
            // this NaN-free: pow() is undefined at and below zero, and one NaN
            // pixel gets smeared across the whole frame by the bloom blur.
            gl_FragColor = vec4(col * uReveal, 1.0);
          }`,
      }),
    [],
  );
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ camera, clock }, delta) => {
    if (!reducedMotion) mat.uniforms.uOffset.value += delta * GROUND_SPEED;
    mat.uniforms.uTime.value = clock.elapsedTime;
    mat.uniforms.uCam.value.copy(camera.position);
    const low = lowness(camera.position.y);
    mat.uniforms.uLow.value = low;
    mat.uniforms.uFog.value.copy(C.fogHigh).lerp(C.fogLow, Math.pow(low, 1.8));
    mat.uniforms.uReveal.value = reveal();
    ref.current.position.set(camera.position.x, 0, camera.position.z - 2000);
  });

  return (
    <mesh ref={ref} material={mat} rotation={[-Math.PI / 2, 0, 0]} frustumCulled={false}>
      <planeGeometry args={[9000, 9000]} />
    </mesh>
  );
}

export function World({ lite }: { lite: boolean }) {
  const fog = useAtmosphere();
  const hemi = useRef<THREE.HemisphereLight>(null!);
  const key = useRef<THREE.DirectionalLight>(null!);
  const rim = useRef<THREE.DirectionalLight>(null!);

  useFrame(({ camera }) => {
    const low = lowness(camera.position.y);
    fog.color.copy(C.fogHigh).lerp(C.fogLow, Math.pow(low, 1.8)).lerp(BLACK, 1 - reveal());
    fog.near = THREE.MathUtils.lerp(400, 120, low);
    fog.far = THREE.MathUtils.lerp(3200, 1800, low);
    // cool moonlight up high, the sunset taking over near the ground
    key.current.color.set("#c9d4ff").lerp(new THREE.Color("#ffd2a6"), low);
    key.current.intensity = THREE.MathUtils.lerp(2.2, 2.8, low);
    rim.current.intensity = THREE.MathUtils.lerp(1.2, 3.4, low);
    hemi.current.intensity = THREE.MathUtils.lerp(0.55, 0.9, low);
  });

  return (
    <>
      <hemisphereLight ref={hemi} args={["#7f8fb8", "#1a1410", 0.6]} />
      <directionalLight ref={key} position={[-6, 10, 8]} intensity={2.2} />
      {/* rim from the sun ahead, so the silhouette catches warm light */}
      <directionalLight ref={rim} position={[4, 1.5, -12]} color="#ffb06a" intensity={1.2} />
      <Sky />
      <SkyReflections />
      <Stars count={lite ? 1400 : 2600} />
      <Clouds count={lite ? 26 : 48} />
      <Ground />
    </>
  );
}
