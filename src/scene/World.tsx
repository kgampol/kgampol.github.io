import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CLOUD_BASE, CLOUD_TOP, CRUISE_ALT, FLOOR_ALT, reducedMotion } from "./flight";

/*
  The world the jet descends through: a sky dome that runs from near-space
  black at cruise down to a dusk horizon, a starfield that fades as the air
  thickens, a cloud deck to punch through, and the ground with city lights
  and a runway at the bottom. The jet never moves forward; the world slides
  past it along +z, which keeps the camera maths trivial.
*/

const GROUND_SPEED = 70; // world units per second the terrain slides past

/** 0 at cruise altitude, 1 on the deck */
function lowness(altitude: number) {
  return THREE.MathUtils.clamp(1 - (altitude - FLOOR_ALT) / (CRUISE_ALT - FLOOR_ALT), 0, 1);
}

const C = {
  zenithHigh: new THREE.Color("#020309"),
  horizonHigh: new THREE.Color("#0e1a36"),
  zenithLow: new THREE.Color("#0b1734"),
  horizonLow: new THREE.Color("#d9824c"),
  glow: new THREE.Color("#ffb56b"),
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

function Sky() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          uLow: { value: 0 },
          uZenith: { value: new THREE.Color() },
          uHorizon: { value: new THREE.Color() },
          uGlow: { value: C.glow.clone() },
        },
        vertexShader: /* glsl */ `
          varying vec3 vDir;
          void main() {
            vDir = normalize(position);
            vec4 p = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * p;
          }`,
        fragmentShader: /* glsl */ `
          uniform float uLow;
          uniform vec3 uZenith;
          uniform vec3 uHorizon;
          uniform vec3 uGlow;
          varying vec3 vDir;
          void main() {
            vec3 d = normalize(vDir);
            float h = d.y;
            vec3 col = mix(uHorizon, uZenith, smoothstep(-0.05, 0.55, h));
            // warm band hugging the horizon, strongest low down
            float band = exp(-abs(h) * 14.0);
            col += uGlow * band * (0.08 + 0.55 * uLow);
            // a setting sun ahead and slightly right
            vec3 sunDir = normalize(vec3(0.62, 0.035, -1.0));
            float s = max(dot(d, sunDir), 0.0);
            col += uGlow * (pow(s, 900.0) * 3.0 + pow(s, 24.0) * 0.35) * uLow;
            // below the horizon, fade into the haze the ground sits in
            col = mix(col, uHorizon * 0.55, smoothstep(0.0, -0.25, h));
            gl_FragColor = vec4(col, 1.0);
          }`,
      }),
    [],
  );
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ camera }) => {
    const low = lowness(camera.position.y);
    mat.uniforms.uLow.value = low;
    mat.uniforms.uZenith.value.copy(C.zenithHigh).lerp(C.zenithLow, low);
    mat.uniforms.uHorizon.value.copy(C.horizonHigh).lerp(C.horizonLow, Math.pow(low, 1.6));
    ref.current.position.copy(camera.position);
  });

  return (
    <mesh ref={ref} material={mat} renderOrder={-10} frustumCulled={false}>
      <sphereGeometry args={[4000, 48, 24]} />
    </mesh>
  );
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
    mat.uniforms.uOpacity.value = THREE.MathUtils.clamp(1 - low * 1.35, 0, 1);
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
    group.current.children.forEach((child, i) => {
      const p = puffs[i];
      // wrap each puff so the deck is endless along the flight path
      const z = ((p.z + offset.current) % CLOUD_SPAN) - CLOUD_SPAN * 0.8;
      child.position.set(p.x, p.y, z);
      const m = mats[i];
      m.color.copy(tint);
      // thin out the puffs right in front of the lens so text stays legible
      const d = child.position.distanceTo(camera.position);
      m.opacity = p.o * THREE.MathUtils.smoothstep(d, 40, 220);
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
            gl_FragColor = vec4(col, 1.0);
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
    fog.color.copy(C.fogHigh).lerp(C.fogLow, Math.pow(low, 1.8));
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
      <Stars count={lite ? 1400 : 2600} />
      <Clouds count={lite ? 26 : 48} />
      <Ground />
    </>
  );
}
