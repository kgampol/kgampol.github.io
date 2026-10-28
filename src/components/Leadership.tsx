import { honors, leadership } from "../data/profile";
import { Panel, Section } from "./Section";

export function Leadership() {
  return (
    <Section id="leadership" title="Leadership & Honors">
      <div className="grid gap-5">
        <Panel>
          <ul className="divide-y divide-line">
            {leadership.map((l) => (
              <li key={l.name} className="flex flex-col gap-0.5 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <span className="font-medium">{l.name}</span>
                <span className="text-sm text-dim sm:text-right">{l.note}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <div>
          <Panel>
            <p className="font-mono text-[10px] tracking-[0.3em] text-hud uppercase">Honors</p>
            <ul className="mt-4 space-y-2.5">
              {honors.map((h) => (
                <li key={h} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rotate-45 bg-hud" />
                  <span className="text-ink/85">{h}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </Section>
  );
}
