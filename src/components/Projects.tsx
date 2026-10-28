import { useEffect, useRef } from "react";
import { projects, type Project } from "../data/profile";
import { reducedMotion } from "../scene/flight";
import { Reveal, Section } from "./Section";

/** plays only while on screen, so off-screen clips cost nothing */
function DemoVideo({ src, poster, alt }: { src: string; poster: string; alt: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || reducedMotion) return;
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()),
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      aria-label={alt}
      muted
      loop
      playsInline
      preload="none"
      controls={reducedMotion}
      className="size-full object-cover"
    />
  );
}

function Visual({ p, index }: { p: Project; index: number }) {
  const frame = "overflow-hidden rounded-xl bg-white/[0.03] ring-1 ring-line";

  if (p.media) {
    return (
      <div className="flex gap-3">
        <div className={`aspect-video flex-[16] ${frame}`}>
          <DemoVideo src={p.media.video} poster={p.media.poster} alt={p.media.alt} />
        </div>
        {p.media.still && (
          <div className={`hidden flex-[6.75] sm:block ${frame}`}>
            <img src={p.media.still} alt="" loading="lazy" className="size-full object-cover" />
          </div>
        )}
      </div>
    );
  }

  if (p.stat) {
    return (
      <div className={`relative flex aspect-[16/6] flex-col justify-end p-6 sm:p-8 ${frame}`}>
        {/* a faint grid and an amber glow give the tile depth without imagery */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(120% 90% at 100% 0%, rgb(232 176 74 / 0.16), transparent 60%), linear-gradient(rgb(231 235 243 / 0.05) 1px, transparent 1px), linear-gradient(90deg, rgb(231 235 243 / 0.05) 1px, transparent 1px)",
            backgroundSize: "100% 100%, 28px 28px, 28px 28px",
          }}
        />
        <span aria-hidden="true" className="absolute top-5 right-6 font-mono text-[11px] tracking-[0.2em] text-dim">
          {String(index + 1).padStart(2, "0")}
        </span>
        <p className="relative font-serif text-5xl leading-none text-hud sm:text-6xl">{p.stat.value}</p>
        <p className="relative mt-3 text-sm text-dim">{p.stat.label}</p>
      </div>
    );
  }

  return null;
}

export function Projects() {
  return (
    <Section id="projects" title="Projects">
      <ol className="space-y-16">
        {projects.map((p, i) => (
          <Reveal as="li" key={p.title}>
            <Visual p={p} index={i} />

            <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 className="text-xl font-medium">{p.title}</h3>
              <p className="font-mono text-xs text-dim tabular-nums">{p.dates}</p>
            </div>
            <p className="mt-1 text-sm text-dim">{p.context}</p>

            <p className="mt-4 text-base leading-relaxed text-ink/90">{p.summary}</p>
            <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-ink/75">
              {p.points.map((pt) => (
                <li key={pt} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.7rem] h-px w-3 shrink-0 bg-hud/70" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
              <p className="font-mono text-[11px] tracking-wide text-hud/80">{p.tags.join("  ·  ")}</p>
              {p.links && (
                <ul className="flex gap-5 text-sm">
                  {p.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-1.5 text-ink/85 transition-colors hover:text-hud"
                      >
                        {l.label}
                        <span aria-hidden="true" className="text-dim transition-colors group-hover:text-hud">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
