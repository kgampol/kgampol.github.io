import { useEffect, useRef } from "react";
import { CLOUD_BASE, CLOUD_TOP, altitudeAt, altitudeFeet, flight } from "../scene/flight";

/*
  A cockpit-style altimeter pinned to the right edge. It reads the same
  eased flight state the 3D scene uses, so the numbers and the view never
  disagree. Updates are written straight to the DOM from a rAF loop; no
  React state changes while scrolling.
*/

function phaseAt(p: number) {
  const alt = altitudeAt(p);
  if (p < 0.03) return "Cruise";
  if (alt > CLOUD_TOP + 20) return "Descending";
  if (alt > CLOUD_BASE - 20) return "In cloud";
  if (p < 0.94) return "Approach";
  return "Final";
}

const fmt = new Intl.NumberFormat("en-US");

export function Hud() {
  const alt = useRef<HTMLSpanElement>(null);
  const altMobile = useRef<HTMLSpanElement>(null);
  const phase = useRef<HTMLSpanElement>(null);
  const phaseMobile = useRef<HTMLSpanElement>(null);
  const vs = useRef<HTMLSpanElement>(null);
  const marker = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let lastFeet = altitudeFeet(flight.progress);
    let lastT = performance.now();
    let vsSmooth = 0;

    const tick = (t: number) => {
      const p = flight.progress;
      const feet = altitudeFeet(p);
      const dt = Math.max(1, t - lastT) / 1000;
      // vertical speed in ft/min, smoothed so it doesn't jitter
      vsSmooth += (((feet - lastFeet) / dt) * 60 - vsSmooth) * 0.08;
      lastFeet = feet;
      lastT = t;

      const a = fmt.format(Math.round(feet / 10) * 10);
      const ph = phaseAt(p);
      if (alt.current) alt.current.textContent = a;
      if (altMobile.current) altMobile.current.textContent = a;
      if (phase.current) phase.current.textContent = ph;
      if (phaseMobile.current) phaseMobile.current.textContent = ph;
      if (vs.current) {
        const v = Math.round(vsSmooth / 100) * 100;
        vs.current.textContent = `${v > 0 ? "+" : ""}${fmt.format(v)}`;
      }
      if (marker.current) marker.current.style.transform = `translateY(${p * 100}%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed z-40 font-mono text-hud uppercase">
      {/* desktop: vertical tape on the right edge */}
      <div className="fixed top-1/2 right-6 hidden -translate-y-1/2 items-center gap-4 xl:flex">
        <div className="text-right text-[10px] leading-relaxed tracking-[0.25em]">
          <p className="text-dim">Alt ft</p>
          <p className="text-base tracking-[0.1em] text-ink tabular-nums">
            <span ref={alt}>41,250</span>
          </p>
          <p className="mt-3 text-dim">V/S fpm</p>
          <p className="text-xs tracking-[0.1em] text-ink/80 tabular-nums">
            <span ref={vs}>0</span>
          </p>
          <p className="mt-3 text-dim">Phase</p>
          <p className="text-xs tracking-[0.2em]">
            <span ref={phase}>Cruise</span>
          </p>
        </div>
        <div className="relative h-[44vh] w-3">
          {/* ticks */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, rgb(232 176 74 / 0.45) 0 1px, transparent 1px 10%), repeating-linear-gradient(to bottom, rgb(232 176 74 / 0.2) 0 1px, transparent 1px 2.5%)",
              backgroundSize: "100% 100%, 50% 100%",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div ref={marker} className="absolute inset-x-0 top-0 h-full will-change-transform">
            <div className="absolute -top-px -left-2 h-0.5 w-5 bg-hud shadow-[0_0_10px_var(--color-hud)]" />
          </div>
        </div>
      </div>

      {/* phones and tablets: a compact readout in the corner */}
      <div className="fixed right-4 bottom-4 rounded-full border border-hud/30 bg-night/70 px-3 py-1.5 text-[10px] tracking-[0.2em] backdrop-blur xl:hidden">
        <span ref={altMobile} className="text-ink tabular-nums">41,250</span>
        <span className="text-dim"> ft · </span>
        <span ref={phaseMobile}>Cruise</span>
      </div>
    </div>
  );
}
