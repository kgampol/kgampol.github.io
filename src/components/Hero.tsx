import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { profile } from "../data/profile";

/*
  The opening: the name alone on a black screen. The section is two
  screens tall with the name pinned for the first one, which gives the
  scene one screen of scroll for the jet to sweep across it before the
  page moves on.
*/
export function Hero() {
  const hint = useRef<HTMLDivElement>(null);

  // the scroll hint bows out as soon as the visitor starts scrolling
  useEffect(() => {
    const update = () => {
      const t = Math.min(1, window.scrollY / (window.innerHeight * 0.15));
      if (hint.current) hint.current.style.opacity = String(1 - t);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <section className="relative h-[200dvh]">
      <div className="sticky top-0 grid h-dvh place-items-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center font-serif text-6xl leading-none tracking-tight sm:text-8xl lg:text-9xl"
        >
          {profile.name}
        </motion.h1>

        <div ref={hint} aria-hidden="true" className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{ opacity: { delay: 1.6, duration: 1 }, y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
            className="block h-8 w-px bg-gradient-to-b from-ink/60 to-transparent"
          />
        </div>
      </div>
    </section>
  );
}
