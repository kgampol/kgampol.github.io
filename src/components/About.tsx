import { profile } from "../data/profile";
import { Panel, Section } from "./Section";

export function About() {
  return (
    <Section id="about" title="About">
      <Panel>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <img
            src={profile.photo}
            alt="Kenneth Gampol"
            width={849}
            height={900}
            loading="lazy"
            className="size-28 shrink-0 rounded-2xl object-cover ring-1 ring-line"
          />
          <div>
            <p className="leading-relaxed text-ink/85">{profile.summary}</p>
            <p className="mt-4 font-mono text-[11px] tracking-[0.18em] text-dim uppercase">
              {profile.badges.join(" · ")}
            </p>
          </div>
        </div>
      </Panel>
    </Section>
  );
}
