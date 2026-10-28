import { skills } from "../data/profile";
import { Panel, Section } from "./Section";

export function Skills() {
  return (
    <Section id="skills" index="05" label="Loadout" title="The toolkit I fly with.">
      <Panel>
        <dl className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
          {skills.map((g) => (
            <div key={g.group}>
              <dt className="font-mono text-[10px] tracking-[0.3em] text-hud uppercase">{g.group}</dt>
              <dd className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-[15px] text-ink/85">
                {g.items.map((item, i) => (
                  <span key={item}>
                    {item}
                    {i < g.items.length - 1 && <span className="ml-3 text-dim/50" aria-hidden="true">/</span>}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Panel>
    </Section>
  );
}
