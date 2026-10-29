import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Bloom, EffectComposer, Noise, ToneMapping, Vignette } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import { Jet } from "./Jet";
import { World } from "./World";
import { altitudeAt, bindScroll, flight, stepFlight } from "./flight";

/*
  Layout the camera frames around. These mirror the content column in
  components/Section.tsx (44rem wide, inset by px-4 / sm:px-8 / lg:px-16),
  so the jet can be placed in the space that column leaves free.
*/
const CONTENT_MAX = 704;
const GAP = 40;
/** from this width there is room to fly the jet beside the copy */
export const SIDE_LAYOUT_MIN = 1080;

/*
  What the camera rig decided this frame, shared with the jet so the
  intro sweep can be planned in screen terms: where the centre of the
  screen is at the jet's depth, and how wide the view is there.
*/
const framing = { cx: 0, lift: 0, halfW: 20 };

/*
  The camera rides alongside the jet. Altitude comes from the scroll
  position; the horizontal framing comes from the viewport. On wide
  screens the jet is centred in the free space right of the copy and
  sized to fit it, so a wingtip never crosses the text. Narrower screens
  put it above the copy instead.
*/
function CameraRig() {
  const { camera, size } = useThree();
  const look = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    stepFlight(delta);
    const p = flight.progress;
    const alt = altitudeAt(p);
    const w = size.width;
    const aspect = w / size.height;
    const tanHalf = Math.tan(THREE.MathUtils.degToRad((camera as THREE.PerspectiveCamera).fov / 2));

    const pad = w >= 1024 ? 64 : w >= 640 ? 32 : 16;
    const contentRight = Math.min(w, pad + CONTENT_MAX);
    const side = w >= SIDE_LAYOUT_MIN;
    const free = w - contentRight - GAP;

    // Wingspan in pixels: most of the free column (capped at a third of
    // the screen) beside the copy, or a bit over half the width above it.
    // The ~11-unit wingspan then sets how far back the camera sits.
    const spanPx = side ? Math.min(free * 0.85, w * 0.34) : w * 0.58;
    const share = spanPx / w;
    const back = THREE.MathUtils.clamp(11 / (2 * share * tanHalf * aspect), 18, 70);
    const halfW = tanHalf * back * aspect;
    const halfH = tanHalf * back;

    // jet stays at the origin in x/z; the camera slides left so the jet
    // lands on the chosen screen x
    const centerPx = side ? contentRight + GAP + free / 2 : w / 2;
    const cx = -((centerPx / w) * 2 - 1) * halfW;
    const above = THREE.MathUtils.lerp(4.2, 3.2, p);
    camera.position.set(cx, alt + above, back);

    // Aim at a point below the jet at its own depth, which lifts the jet
    // above centre by that amount: a touch beside the copy, up near the
    // nav when it flies above the copy. Mid-dive, the side layout tips down
    // a little more so the clouds fill the frame, while the stacked layout
    // eases the jet down so its tails never slide under the nav.
    const dive = Math.sin(p * Math.PI);
    const lift = ((side ? 0.06 : 0.68) + dive * (side ? 0.12 : -0.08)) * halfH;
    look.set(cx, alt - lift, 0);
    camera.lookAt(look);
    framing.cx = cx;
    framing.lift = lift;
    framing.halfW = halfW;
  });

  return null;
}

export default function FlightScene() {
  const scrim = useRef<HTMLDivElement>(null);
  useEffect(() => bindScroll(), []);

  // The scrim stays off through the intro so it never dims the jet's
  // sweep across the name or its climb through the middle of a phone
  // screen. It fades in from 90% of the intro to 20% past it, when the
  // jet is parked at the side (desktop) or the top (phones). On phones the top
  // band then darkens over the following screen, as content starts passing
  // over the jet.
  useEffect(() => {
    const update = () => {
      const vh = window.innerHeight;
      const intro = window.scrollY / vh;
      const el = scrim.current;
      if (!el) return;
      el.style.opacity = Math.min(1, Math.max(0, (intro - 0.9) / 0.3)).toFixed(3);
      const after = Math.min(1, Math.max(0, (window.scrollY - vh) / vh));
      el.style.setProperty("--scrim-top", (after * 0.6).toFixed(3));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const lite = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="animate-scene-in pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <Canvas
        dpr={[1, lite ? 1.5 : 2]}
        camera={{ fov: 40, near: 0.5, far: 9000, position: [0, altitudeAt(0) + 4, 21] }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          // tone mapping happens in the post chain instead, so bloom sees
          // the scene's full HDR range (sun disc, afterburners, city lights)
          gl.toneMapping = THREE.NoToneMapping;
        }}
      >
        <CameraRig />
        <World lite={lite} />
        <JetAtAltitude />
        <Grade lite={lite} />
      </Canvas>
      {/* Darken the side the copy lives on so text stays readable over
          bright cloud and sunset without boxes behind it, while the jet's
          side stays untouched. Below SIDE_LAYOUT_MIN, where the jet flies
          above the copy, darken everything beneath it instead, and fade the
          top in as the hero scrolls away so copy passing over the jet stays
          readable. Starts hidden; the scroll handler above fades it in. */}
      <div ref={scrim} style={{ opacity: 0 }} className="absolute inset-0 bg-[linear-gradient(to_top,rgb(5_7_13/0.9)_0%,rgb(5_7_13/0.8)_60%,rgb(5_7_13/var(--scrim-top,0))_88%,rgb(5_7_13/var(--scrim-top,0))_100%)] min-[1080px]:bg-[linear-gradient(to_right,rgb(5_7_13/0.92)_0%,rgb(5_7_13/0.82)_38%,rgb(5_7_13/0.4)_58%,transparent_74%)]" />
    </div>
  );
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/*
  Places the jet for the current scroll position. During the intro it
  enters from off-screen left at the height of the name (the centre of
  the screen), flies across it nose-first, then banks into a turn that
  swings its nose away from the viewer and lifts it into the spot the
  descent starts from. After the intro it simply sits at altitude.
*/
function JetAtAltitude() {
  const group = useMemo(() => {
    const g = new THREE.Group();
    g.rotation.order = "YXZ"; // yaw to the heading, then bank about the nose
    return g;
  }, []);

  useFrame(() => {
    const t = flight.intro;
    const alt = altitudeAt(flight.progress);
    const { cx, lift, halfW } = framing;

    // across: off-screen left -> final x, most of the travel up front so
    // the jet is over the name early in the scroll
    const startX = cx - halfW - 14;
    const across = easeOut(THREE.MathUtils.clamp(t / 0.8, 0, 1));
    // up: hold at the name's height while crossing, then climb to the
    // descent framing
    const rise = ease(THREE.MathUtils.smoothstep(t, 0.35, 1));
    // closer to the camera while it crosses, so it reads large over the name
    const near = Math.sin(Math.min(1, t / 0.9) * Math.PI) * 7;

    group.position.set(
      THREE.MathUtils.lerp(startX, 0, across),
      THREE.MathUtils.lerp(alt - lift, alt, rise),
      near,
    );

    // heading: nose pointing right (+x) on entry, turning to face away
    // (-z) for the descent; bank into the turn and roll level at the end
    const turn = ease(THREE.MathUtils.smoothstep(t, 0.25, 1));
    group.rotation.y = -Math.PI / 2 * (1 - turn);
    group.rotation.z = Math.sin(turn * Math.PI) * 0.75;
  });

  return (
    <primitive object={group}>
      <Jet />
    </primitive>
  );
}

/*
  The finishing pass. Bloom only picks up what is genuinely brighter than
  white in HDR (sun disc, afterburner cores, runway and city lights), so
  the copy-side of the frame and the dark sky stay clean. ACES tone
  mapping runs here rather than on the renderer, then a soft vignette
  and very light film grain. Phones skip the grain to save fill rate.

  No anti-aliasing pass, on purpose:
  - MSAA is off because with an MSAA framebuffer the mipmap bloom pass
    rendered a solid black frame (no GL error) on Apple GPUs via
    ANGLE/Metal.
  - FXAA traced the soft gradients of the cloud sprites as edges, drawing
    faint rings around them. SMAA would avoid that but embeds lookup
    textures worth ~58 KB gzipped.
  On high-DPI screens (rendered at up to 2x) the jet's edges barely
  alias; standard 1x screens see slightly harder edges on the jet.
*/
function Grade({ lite }: { lite: boolean }) {
  return (
    <EffectComposer multisampling={0} frameBufferType={THREE.HalfFloatType}>
      <Bloom mipmapBlur intensity={0.9} luminanceThreshold={1} luminanceSmoothing={0.2} radius={0.7} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <Vignette offset={0.32} darkness={0.55} />
      {!lite && <Noise opacity={0.035} premultiply blendFunction={BlendFunction.SCREEN} />}
    </EffectComposer>
  );
}
