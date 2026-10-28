import { profile } from "../data/profile";
import { Reveal, Section } from "./Section";

const links = [
  { label: "LinkedIn", href: profile.links.linkedin, mark: "↗" },
  { label: "GitHub", href: profile.links.github, mark: "↗" },
  { label: "Resume", href: profile.links.resume, mark: "↓", download: true },
];

export function Contact() {
  return (
    <>
      <Section id="contact" title="Contact">
        <Reveal>
          <p className="text-[15px] leading-relaxed text-ink/80">
            Open to conversations about AI/ML, autonomy, and defense technology.
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-5 inline-block font-serif text-3xl break-all text-ink underline decoration-line decoration-1 underline-offset-[10px] transition-colors hover:text-hud hover:decoration-hud sm:text-4xl"
          >
            {profile.email}
          </a>
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  {...(l.download
                    ? { download: "Kenneth_Gampol_Resume.pdf" }
                    : { target: "_blank", rel: "noreferrer" })}
                  className="group inline-flex items-center gap-1.5 text-ink/85 transition-colors hover:text-hud"
                >
                  {l.label}
                  <span aria-hidden="true" className="text-dim transition-colors group-hover:text-hud">
                    {l.mark}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <footer className="px-4 pb-14 sm:px-8 lg:px-16">
        <div className="flex max-w-[44rem] flex-col gap-2 border-t border-line pt-6 font-mono text-[11px] tracking-[0.18em] text-dim uppercase sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <a href="#top" className="transition-colors hover:text-hud">
            Back to top ↑
          </a>
        </div>
      </footer>
    </>
  );
}
