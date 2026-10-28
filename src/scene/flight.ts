// Tiny maths helpers kept local so this module has no three.js dependency
// and stays cheap to import from outside the lazily loaded scene.
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** frame-rate independent exponential smoothing (same formula as three's damp) */
const damp = (x: number, y: number, lambda: number, dt: number) =>
  lerp(x, y, 1 - Math.exp(-lambda * dt));

/*
  One shared flight state. The DOM writes the raw scroll target, the
  scene's frame loop eases `progress` toward it, and the camera and 3D
  objects read from here. Nothing in it triggers a React
  render, so scrolling never re-renders the page.
*/
export const flight = {
  /** raw intro position: 0 at the top, 1 after one screen of scrolling */
  introTarget: 0,
  /** eased copy of introTarget, which drives the jet's sweep across the name */
  intro: 0,
  /** raw descent position: 0 once the intro is done, 1 at the bottom */
  target: 0,
  /** eased copy of target, what everything actually animates from */
  progress: 0,
  /** signed change in progress per second, used for banking */
  velocity: 0,
};

export const reducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/*
  The first screen of scrolling belongs to the intro; it matches the
  extra screen of height the hero is given (h-[200dvh] with a pinned
  name). The descent uses whatever scroll is left after that.
*/
export function bindScroll() {
  const update = () => {
    const intro = window.innerHeight;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    flight.introTarget = clamp(window.scrollY / intro, 0, 1);
    flight.target = max > intro ? clamp((window.scrollY - intro) / (max - intro), 0, 1) : 0;
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  return () => {
    window.removeEventListener("scroll", update);
    window.removeEventListener("resize", update);
  };
}

export function stepFlight(delta: number) {
  flight.intro = reducedMotion ? flight.introTarget : damp(flight.intro, flight.introTarget, 4, delta);
  const before = flight.progress;
  flight.progress = reducedMotion
    ? flight.target
    : damp(flight.progress, flight.target, 3.2, delta);
  const v = delta > 0 ? (flight.progress - before) / delta : 0;
  flight.velocity = damp(flight.velocity, v, 6, delta);
}

/* --- the descent profile, shared by the camera and the scene --- */

export const CRUISE_ALT = 620; // world units at the top of the page
export const FLOOR_ALT = 9; // where the jet levels out at the bottom
export const CLOUD_BASE = 230;
export const CLOUD_TOP = 330;

/** altitude in world units. Eased so the dive is steepest mid-page. */
export function altitudeAt(p: number) {
  const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  return lerp(CRUISE_ALT, FLOOR_ALT, e);
}

/** nose pitch: level at the top, diving through the middle, flared at the end */
export function pitchAt(p: number) {
  const dive = Math.sin(Math.min(1, p / 0.92) * Math.PI);
  return -0.32 * dive;
}
