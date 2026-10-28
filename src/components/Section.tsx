import type { ReactNode } from "react";
import { motion } from "motion/react";

/*
  Every content section shares this frame: an id for the nav, a HUD-style
  index label, and a reveal as it scrolls into view. Copy sits in the left
  column on desktop so the jet keeps the right side of the screen.
*/
export function Section({
  id,
  index,
  label,
  title,
  children,
  wide = false,
}: {
  id: string;
  index: string;
  label: string;
  title: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <section id={id} className="relative scroll-mt-20 px-4 py-24 sm:px-8 md:py-32 lg:px-16">
      <div className={wide ? "max-w-5xl" : "max-w-2xl"}>
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-hud uppercase">
            {index} <span className="text-dim">/</span> {label}
          </p>
          <h2 className="mt-3 font-serif text-4xl leading-tight text-balance sm:text-5xl">{title}</h2>
        </motion.header>
        {children}
      </div>
    </section>
  );
}

/** a translucent panel that keeps copy legible over the moving sky */
export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-2xl border border-line bg-night/60 p-6 backdrop-blur-md sm:p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] tracking-wide text-dim">
      {children}
    </span>
  );
}
