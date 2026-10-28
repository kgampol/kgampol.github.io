import { research } from "../data/profile";
import { Reveal, Section } from "./Section";

export function Research() {
  return (
    <Section id="research" title="Research">
      <ul className="divide-y divide-line">
        {research.map((r) => (
          <Reveal as="li" key={r.title} className="py-6 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 className="text-lg font-medium">{r.title}</h3>
              <p className="font-mono text-xs text-dim tabular-nums">{r.dates}</p>
            </div>
            <p className="mt-0.5 text-sm text-dim">
              {r.org} · {r.place}
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/80">{r.body}</p>
            <p className="mt-3 font-mono text-[11px] tracking-wide text-hud/80">{r.tags.join("  ·  ")}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
