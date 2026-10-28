import { motion } from "motion/react";
import { education } from "../data/profile";
import { Section } from "./Section";

export function Education() {
  return (
    <Section id="education" title="Education">
      <ul className="grid gap-5 sm:grid-cols-2">
        {education.map((e, i) => (
          <motion.li
            key={e.school}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col rounded-2xl border border-line bg-night/60 p-6 backdrop-blur-md"
          >
            <div className="grid size-20 place-items-center rounded-2xl bg-white p-2.5 ring-1 ring-white/20">
              <img src={e.logo} alt={`${e.school} logo`} loading="lazy" className="size-full object-contain" />
            </div>
            <h3 className="mt-5 text-lg font-medium leading-snug">{e.school}</h3>
            <p className="mt-1 text-ink/85">{e.degree}</p>
            <p className="mt-1 text-sm text-hud">{e.detail}</p>
            <p className="mt-auto pt-5 font-mono text-xs tracking-wider text-dim">
              {e.dates} · {e.place}
            </p>
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}
