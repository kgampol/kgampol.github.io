import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { flight, pitchAt, reducedMotion } from "./flight";

/*
  A twin-engine, twin-tail fighter built from primitives. The nose points
  down -z. Every part is shaped from a real planform (Shape + extrude) or a
  lathed profile so the silhouette reads as one aircraft rather than boxes.
*/

const skin = new THREE.MeshStandardMaterial({
  color: "#8b94a3",
  metalness: 0.45,
  roughness: 0.48,
});
const skinDark = new THREE.MeshStandardMaterial({
  color: "#5d6573",
  metalness: 0.5,
  roughness: 0.55,
});
const canopyMat = new THREE.MeshPhysicalMaterial({
  color: "#1a2433",
  metalness: 0.2,
  roughness: 0.08,
  clearcoat: 1,
  clearcoatRoughness: 0.05,
  sheen: 0.4,
  sheenColor: new THREE.Color("#e8b04a"),
});
const nozzleMat = new THREE.MeshStandardMaterial({
  color: "#2b2f36",
  metalness: 0.8,
  roughness: 0.35,
  side: THREE.DoubleSide,
});

function lathe(points: [number, number][], segments = 40) {
  const g = new THREE.LatheGeometry(
    points.map(([r, y]) => new THREE.Vector2(r, y)),
    segments,
  );
  // lathe runs along +y; lay it along -z so the first point is the tail
  g.rotateX(-Math.PI / 2);
  return g;
}

function plate(outline: [number, number][], thickness: number) {
  const shape = new THREE.Shape(outline.map(([x, y]) => new THREE.Vector2(x, y)));
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: thickness * 0.45,
    bevelSize: thickness * 0.6,
    bevelSegments: 2,
  });
  g.translate(0, 0, -thickness / 2);
  return g;
}

function useJetGeometry() {
  return useMemo(() => {
    // fuselage: tail (y=0) to nose tip (y=10.6), radius in x
    const fuselage = lathe([
      [0.0, -0.1],
      [0.62, 0.0],
      [0.78, 0.6],
      [0.86, 2.6],
      [0.84, 5.2],
      [0.72, 6.8],
      [0.55, 8.0],
      [0.36, 9.1],
      [0.16, 10.1],
      [0.0, 10.7],
    ]);
    fuselage.translate(0, 0, 5);
    fuselage.scale(1.25, 0.72, 1); // flatten into a blended, wider body

    // wing planform in (span x, chord) — drawn flat then laid into x-z
    const wing = plate(
      [
        [0.6, 0.0],
        [5.4, 1.5],
        [5.5, 2.25],
        [0.6, 4.4],
      ],
      0.09,
    );
    wing.rotateX(Math.PI / 2);
    wing.translate(0, 0, -0.6);

    // leading-edge extension blending wing into the nose
    const lex = plate(
      [
        [0.5, 0.6],
        [1.35, 0.15],
        [0.55, -3.7],
      ],
      0.07,
    );
    lex.rotateX(Math.PI / 2);
    lex.translate(0, 0, -0.6);

    const stab = plate(
      [
        [0.5, -0.2],
        [2.6, -0.7],
        [2.7, -0.15],
        [0.5, 1.35],
      ],
      0.06,
    );
    stab.rotateX(Math.PI / 2);
    stab.translate(0, 0, 5.1);

    // vertical tail, drawn in (forward, up)
    const fin = plate(
      [
        [0, 0],
        [2.6, 0],
        [0.95, 2.4],
        [0.25, 2.4],
      ],
      0.06,
    );
    fin.rotateY(Math.PI / 2);

    const canopy = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    canopy.scale(0.42, 0.42, 1.55);

    const intake = new THREE.BoxGeometry(0.6, 0.62, 3.2);

    const nozzle = new THREE.CylinderGeometry(0.4, 0.46, 0.9, 24, 1, true);
    nozzle.rotateX(Math.PI / 2);

    // flame: a cone that points back along +z, base at the nozzle
    const flame = new THREE.ConeGeometry(0.34, 2.6, 20, 1, true);
    flame.rotateX(Math.PI / 2);
    flame.translate(0, 0, 1.3);

    return { fuselage, wing, lex, stab, fin, canopy, intake, nozzle, flame };
  }, []);
}

/** `boost` lifts the colour above 1.0 so the bloom pass treats it as a light */
function afterburnerMaterial(core: string, boost = 1) {
  return new THREE.MeshBasicMaterial({
    color: new THREE.Color(core).multiplyScalar(boost),
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}

/** a long, faint vapour trail streaming back from a wingtip */
function Contrail({ x }: { x: number }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        uniforms: { uStrength: { value: 0 }, uTime: { value: 0 } },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: /* glsl */ `
          uniform float uStrength;
          uniform float uTime;
          varying vec2 vUv;
          void main() {
            // v=1 at the wingtip, 0 far behind
            float along = vUv.y;
            float across = 1.0 - abs(vUv.x - 0.5) * 2.0;
            float ripple = 0.85 + 0.15 * sin(along * 40.0 - uTime * 18.0);
            float a = pow(along, 1.6) * pow(across, 1.5) * ripple * uStrength;
            gl_FragColor = vec4(vec3(0.92, 0.95, 1.0), a * 0.55);
          }`,
      }),
    [],
  );

  useFrame((state) => {
    // vapour shows up as the jet pulls through the dive, then fades
    const p = flight.progress;
    const pull = Math.min(1, Math.abs(flight.velocity) * 6);
    mat.uniforms.uStrength.value = 0.25 + 0.55 * Math.sin(p * Math.PI) + pull * 0.4;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh position={[x, 0.02, 1.6 + 6]} rotation={[-Math.PI / 2, 0, 0]} material={mat}>
      <planeGeometry args={[0.18, 12]} />
    </mesh>
  );
}

export function Jet(props: { position?: [number, number, number]; scale?: number }) {
  const g = useJetGeometry();
  const body = useRef<THREE.Group>(null!);
  const flames = useRef<THREE.Group>(null!);
  const coreMat = useMemo(() => afterburnerMaterial("#fff1c9", 4), []);
  const plumeMat = useMemo(() => afterburnerMaterial("#ff8a3d", 1.6), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const p = flight.progress;
    const idle = reducedMotion ? 0 : 1;

    // pitch follows the descent profile; roll answers scroll speed so a
    // fast flick reads as the jet banking into the dive
    const pitch = pitchAt(p) + Math.sin(t * 0.9) * 0.015 * idle;
    const bankFromSpeed = THREE.MathUtils.clamp(flight.velocity * 2.4, -0.55, 0.55);
    const roll = bankFromSpeed + Math.sin(t * 0.55) * 0.05 * idle;
    const yaw = Math.sin(t * 0.35) * 0.03 * idle;

    const b = body.current;
    b.rotation.x = THREE.MathUtils.damp(b.rotation.x, pitch, 4, delta);
    b.rotation.z = THREE.MathUtils.damp(b.rotation.z, roll, 3, delta);
    b.rotation.y = yaw;
    b.position.y = Math.sin(t * 1.3) * 0.12 * idle;

    // afterburner flicker, hotter while diving
    const burn = 0.75 + 0.25 * Math.sin(p * Math.PI);
    const flicker = 1 + Math.sin(t * 47) * 0.06 + Math.sin(t * 31) * 0.05;
    flames.current.scale.set(1, 1, burn * flicker);
    coreMat.opacity = 0.7 + 0.2 * flicker - 0.2;
  });

  return (
    <group position={props.position} scale={props.scale ?? 1}>
      <group ref={body}>
        <mesh geometry={g.fuselage} material={skin} castShadow />
        <mesh geometry={g.canopy} material={canopyMat} position={[0, 0.48, -2.3]} />

        {/* wings, LEX and stabilators, mirrored */}
        {[1, -1].map((side) => (
          <group key={side} scale={[side, 1, 1]}>
            <mesh geometry={g.wing} material={skin} position={[0, -0.05, 0]} />
            <mesh geometry={g.lex} material={skin} position={[0, 0.02, 0]} />
            <mesh geometry={g.stab} material={skinDark} position={[0, -0.12, 0]} />
            <mesh geometry={g.intake} material={skinDark} position={[0.95, -0.18, -0.2]} />
            {/* canted twin tails */}
            <group position={[0.72, 0.38, 5.0]} rotation={[0, 0, -0.38]}>
              <mesh geometry={g.fin} material={skin} />
            </group>
            <mesh geometry={g.nozzle} material={nozzleMat} position={[0.42, -0.05, 5.15]} />
          </group>
        ))}

        <group ref={flames} position={[0, -0.05, 5.5]}>
          {[0.42, -0.42].map((x) => (
            <group key={x} position={[x, 0, 0]}>
              <mesh geometry={g.flame} material={plumeMat} scale={[1.25, 1.25, 1.35]} />
              <mesh geometry={g.flame} material={coreMat} scale={[0.6, 0.6, 0.75]} />
            </group>
          ))}
          <pointLight color="#ff9a4a" intensity={14} distance={9} decay={2} />
        </group>

        <Contrail x={5.45} />
        <Contrail x={-5.45} />
      </group>
    </group>
  );
}
