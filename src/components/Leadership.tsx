import { honors, leadership } from "../data/profile";
import { Panel, Section } from "./Section";

export function Leadership() {
  return (
    <Section id="leadership" index="06" label="Leadership & honors" title="Pulling others up with me.">
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

        <div className="flex flex-col gap-5 sm:flex-row">
          <img
            src="/img/top100.jpg"
            alt="Top 100 Interns in the Nation award graphic"
            width={600}
            height={600}
            loading="lazy"
            className="aspect-square w-full rounded-2xl object-cover ring-1 ring-line sm:w-44"
          />
          <Panel className="flex-1">
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
