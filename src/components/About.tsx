import { motion } from "motion/react";
import { profile, stats } from "../data/profile";
import { Panel, Section } from "./Section";

export function About() {
  return (
    <Section id="about" title="About">
      <Panel>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <img
            src={profile.photo}
            alt="Kenneth Gampol"
            width={849}
            height={900}
            loading="lazy"
            className="size-28 shrink-0 rounded-2xl object-cover ring-1 ring-line sm:size-32"
          />
          <div className="space-y-4 leading-relaxed text-ink/85">
            {profile.summary.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </Panel>

      <dl className="mt-6 grid grid-cols-2 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-line bg-night/60 p-5 backdrop-blur-md"
          >
            <dt className="sr-only">{s.label}</dt>
            <dd className="font-serif text-3xl text-hud sm:text-4xl">{s.value}</dd>
            <dd className="mt-2 text-sm leading-snug text-dim">{s.label}</dd>
          </motion.div>
        ))}
      </dl>
    </Section>
  );
}
