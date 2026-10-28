import { motion } from "motion/react";
import { experience, type Role } from "../data/profile";
import { Section, Tag } from "./Section";

/** logos are dark-on-white artwork, so they sit on a light tile */
export function LogoTile({ src, name }: { src?: string; name: string }) {
  return (
    <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-white p-1.5 ring-1 ring-white/20">
      {src ? (
        <img src={src} alt={`${name} logo`} loading="lazy" className="size-full object-contain" />
      ) : (
        <span className="font-serif text-lg text-night">
          {name
            .split(/[\s-]+/)
            .slice(0, 2)
            .map((w) => w[0])
            .join("")}
        </span>
      )}
    </div>
  );
}

function RoleCard({ role, i }: { role: Role; i: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
      className="relative pl-8 sm:pl-10"
    >
      {/* waypoint on the timeline */}
      <span
        aria-hidden="true"
        className="absolute top-7 left-0 size-[11px] -translate-x-1/2 rotate-45 border border-hud bg-night"
      />
      <article className="rounded-2xl border border-line bg-night/60 p-6 backdrop-blur-md sm:p-7">
        <div className="flex items-start gap-4">
          <LogoTile src={role.logo} name={role.org} />
          <div className="min-w-0">
            <p className="font-mono text-[10px] tracking-[0.3em] text-hud uppercase">{role.callsign}</p>
            <h3 className="mt-1 text-lg font-medium leading-snug">{role.title}</h3>
            <p className="text-sm text-dim">
              {role.org} · {role.place}
            </p>
          </div>
        </div>
        <p className="mt-4 font-mono text-xs tracking-wider text-dim">{role.dates}</p>
        <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink/85">
          {role.points.map((pt) => (
            <li key={pt} className="relative pl-5">
              <span aria-hidden="true" className="absolute top-[0.7em] left-0 h-px w-2.5 bg-hud/70" />
              {pt}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-2">
          {role.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      </article>
    </motion.li>
  );
}

export function Experience() {
  return (
    <Section id="experience" index="02" label="Flight log" title="Where I've flown.">
      <ol className="relative space-y-8 border-l border-hud/25">
        {experience.map((role, i) => (
          <RoleCard key={`${role.org}-${role.title}`} role={role} i={i} />
        ))}
      </ol>
    </Section>
  );
}
