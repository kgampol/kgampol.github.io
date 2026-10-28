import { honors, leadership } from "../data/profile";
import { Reveal, Section } from "./Section";

export function Leadership() {
  return (
    <Section id="leadership" title="Leadership & Honors">
      <Reveal>
        <ul className="divide-y divide-line">
          {leadership.map((l) => (
            <li key={l.name} className="py-3.5 first:pt-0">
              <p className="font-medium">{l.name}</p>
              <p className="mt-0.5 text-sm text-dim">{l.note}</p>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-10">
        <h3 className="font-mono text-[11px] tracking-[0.18em] text-dim uppercase">Honors</h3>
        <ul className="mt-4 grid gap-x-8 gap-y-2 text-[15px] text-ink/85 sm:grid-cols-2">
          {honors.map((h) => (
            <li key={h} className="flex gap-3">
              <span aria-hidden="true" className="mt-[0.6rem] h-px w-3 shrink-0 bg-hud" />
              {h}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
