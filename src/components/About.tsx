import { profile } from "../data/profile";
import { Section } from "./Section";

export function About() {
  return (
    <Section id="about" title="About">
      <p className="text-xl leading-relaxed font-light text-ink/90 sm:text-2xl sm:leading-relaxed">
        {profile.summary}
      </p>
      <p className="mt-6 font-mono text-[11px] tracking-[0.18em] text-dim uppercase">
        {profile.badges.join("  ·  ")}
      </p>
    </Section>
  );
}
