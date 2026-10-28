import { skills } from "../data/profile";
import { Reveal, Section } from "./Section";

export function Skills() {
  return (
    <Section id="skills" title="Skills">
      <Reveal>
        <dl className="divide-y divide-line">
          {skills.map((g) => (
            <div key={g.group} className="grid gap-1.5 py-4 first:pt-0 last:pb-0 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6">
              <dt className="pt-0.5 font-mono text-[11px] tracking-[0.18em] text-dim uppercase">{g.group}</dt>
              <dd className="text-[15px] leading-relaxed text-ink/85">{g.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
