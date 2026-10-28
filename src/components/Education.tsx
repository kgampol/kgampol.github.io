import { education } from "../data/profile";
import { Logo } from "./Logo";
import { Reveal, Section } from "./Section";

export function Education() {
  return (
    <Section id="education" title="Education">
      <ul className="divide-y divide-line">
        {education.map((e) => (
          <Reveal as="li" key={e.school} className="flex gap-4 py-6 first:pt-0 last:pb-0">
            <Logo src={e.logo} name={e.school} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="text-lg font-medium">{e.school}</h3>
                <p className="font-mono text-xs text-dim tabular-nums">{e.dates}</p>
              </div>
              <p className="mt-1 text-[15px] text-ink/85">{e.degree}</p>
              <p className="mt-0.5 text-sm text-dim">{e.detail}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
