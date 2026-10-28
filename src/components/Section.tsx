import type { ReactNode } from "react";
import { motion } from "motion/react";

/*
  Every content section shares one editorial frame: a hairline rule, the
  heading in a narrow column on the left (sticky on desktop so it stays
  beside its content), and the content in a reading-width column to its
  right. The whole block stays on the left half of wide screens so the
  jet keeps the right side.
*/
export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative scroll-mt-16 px-4 py-14 sm:px-8 md:py-20 lg:px-16">
      <div className="max-w-[44rem] border-t border-line pt-8 lg:grid lg:grid-cols-[9rem_minmax(0,1fr)] lg:gap-10 lg:pt-10">
        <Reveal className="mb-8 lg:sticky lg:top-24 lg:mb-0 lg:self-start">
          <h2 className="font-serif text-3xl leading-none lg:text-[1.65rem]">{title}</h2>
        </Reveal>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

/** fades and lifts its children in once, the first time they scroll into view */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li";
}) {
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Tag>
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
