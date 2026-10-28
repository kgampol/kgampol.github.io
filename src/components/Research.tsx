import { research } from "../data/profile";
import { Panel, Section, Tag } from "./Section";

export function Research() {
  return (
    <Section id="research" title="Research">
      <div className="grid gap-5">
        {research.map((r) => (
          <Panel key={r.title}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-serif text-2xl">{r.title}</h3>
              <p className="font-mono text-xs tracking-wider text-dim">{r.dates}</p>
            </div>
            <p className="mt-1 text-sm text-hud">{r.org}</p>
            <p className="text-sm text-dim">{r.place}</p>
            <p className="mt-4 leading-relaxed text-ink/85">{r.body}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {r.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </Section>
  );
}
