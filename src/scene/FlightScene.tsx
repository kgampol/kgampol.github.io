import { useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Jet } from "./Jet";
import { World } from "./World";
import { altitudeAt, bindScroll, flight, stepFlight } from "./flight";

/*
  The camera rides alongside the jet. Altitude comes from the scroll
  position; the horizontal framing comes from the viewport, so the jet
  sits to the right of the copy on wide screens and above it on phones.
*/
function CameraRig() {
  const { camera, size } = useThree();
  const look = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    stepFlight(delta);
    const p = flight.progress;
    const alt = altitudeAt(p);
    const aspect = size.width / size.height;
    const wide = aspect > 1.05;
    const tanHalf = Math.tan(THREE.MathUtils.degToRad((camera as THREE.PerspectiveCamera).fov / 2));

    // Distance chosen so the ~11-unit wingspan covers a set share of the
    // screen width: about a third on desktop, a bit over half on a phone.
    const share = wide ? 0.34 : 0.58;
    const back = THREE.MathUtils.clamp(11 / (2 * share * tanHalf * aspect), 18, 60);
    const halfW = tanHalf * back * aspect;
    const halfH = tanHalf * back;

    // jet stays at the origin in x/z; the camera slides left so it reads right
    const cx = wide ? -0.42 * halfW : 0;
    const above = THREE.MathUtils.lerp(4.2, 3.2, p);
    camera.position.set(cx, alt + above, back);

    // Aim at a point below the jet at its own depth, which lifts the jet
    // above centre by that amount: a touch on desktop, up near the nav on
    // phones so it clears the copy. Mid-dive, desktop tips down a little
    // more so the clouds fill the frame, while phones ease the jet down
    // so its tails never slide under the nav.
    const dive = Math.sin(p * Math.PI);
    const lift = ((wide ? 0.06 : 0.68) + dive * (wide ? 0.12 : -0.08)) * halfH;
    look.set(cx, alt - lift, 0);
    camera.lookAt(look);
  });

  return null;
}

export default function FlightScene() {
  useEffect(() => bindScroll(), []);
  const lite = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <Canvas
        dpr={[1, lite ? 1.5 : 2]}
        camera={{ fov: 40, near: 0.5, far: 9000, position: [0, altitudeAt(0) + 4, 21] }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <CameraRig />
        <World lite={lite} />
        <JetAtAltitude />
      </Canvas>
      {/* Darken the side the copy lives on so text stays readable over
          bright cloud and sunset, while the jet's side stays untouched. */}
      <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/30 to-transparent md:bg-gradient-to-r md:from-night/80 md:via-night/35 md:to-transparent" />
    </div>
  );
}

function JetAtAltitude() {
  const group = useMemo(() => new THREE.Group(), []);
  useFrame(() => {
    group.position.y = altitudeAt(flight.progress);
  });
  return (
    <primitive object={group}>
      <Jet />
    </primitive>
  );
}
