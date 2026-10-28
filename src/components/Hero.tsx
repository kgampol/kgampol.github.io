import { motion } from "motion/react";
import { profile } from "../data/profile";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function Hero() {
  return (
    <section className="relative flex min-h-dvh flex-col justify-end px-4 pt-24 pb-28 sm:px-8 md:justify-center md:pb-24 lg:px-16">
      <div className="max-w-2xl">
        <motion.p {...rise(0.1)} className="font-mono text-xs tracking-[0.3em] text-hud uppercase">
          Callsign // KGampol · {profile.location}
        </motion.p>

        <motion.h1
          {...rise(0.2)}
          className="mt-5 font-serif text-6xl leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl"
        >
          Kenneth
          <br />
          <span className="italic text-ink/85">Gampol</span>
        </motion.h1>

        <motion.p {...rise(0.35)} className="mt-6 text-lg text-ink/90 sm:text-xl">
          {profile.role} at {profile.org}
        </motion.p>
        <motion.p {...rise(0.45)} className="mt-3 max-w-xl text-base leading-relaxed text-dim sm:text-lg">
          {profile.tagline}
        </motion.p>

        <motion.div {...rise(0.55)} className="mt-9 flex flex-wrap gap-3">
          <a
            href="#experience"
            className="rounded-full bg-hud px-6 py-3 text-sm font-medium text-night transition-transform hover:-translate-y-0.5"
          >
            See the flight log
          </a>
          <a
            href={profile.links.resume}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-line bg-night/40 px-6 py-3 text-sm backdrop-blur transition-colors hover:border-ink/40"
          >
            Download resume
          </a>
        </motion.div>

        <motion.ul {...rise(0.65)} className="mt-10 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] tracking-[0.18em] text-dim uppercase">
          {profile.badges.map((b) => (
            <li key={b} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-hud" aria-hidden="true" />
              {b}
            </li>
          ))}
        </motion.ul>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] tracking-[0.35em] text-dim uppercase"
      >
        Scroll to descend
        <motion.span
          aria-hidden="true"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="block h-6 w-px bg-gradient-to-b from-hud to-transparent"
        />
      </motion.a>
    </section>
  );
}
