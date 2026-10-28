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
        <motion.h1
          {...rise(0.15)}
          className="font-serif text-6xl leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl"
        >
          {profile.name}
        </motion.h1>

        <motion.p {...rise(0.3)} className="mt-6 text-lg text-ink/85 sm:text-xl">
          {profile.role} at {profile.org}
        </motion.p>

        <motion.div {...rise(0.45)} className="mt-9 flex flex-wrap gap-3">
          <a
            href="#experience"
            className="rounded-full bg-hud px-6 py-3 text-sm font-medium text-night transition-transform hover:-translate-y-0.5"
          >
            View experience
          </a>
          <a
            href={profile.links.resume}
            download="Kenneth_Gampol_Resume.pdf"
            className="rounded-full border border-line bg-night/40 px-6 py-3 text-sm backdrop-blur transition-colors hover:border-ink/40"
          >
            Download resume
          </a>
        </motion.div>
      </div>
    </section>
  );
}
