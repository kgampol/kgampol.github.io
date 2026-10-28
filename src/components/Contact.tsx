import { profile } from "../data/profile";
import { Section } from "./Section";

const channels: { label: string; value: string; href: string; download?: boolean }[] = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "LinkedIn", value: "in/kennethgampol", href: profile.links.linkedin },
  { label: "GitHub", value: "kgampol", href: profile.links.github },
  { label: "Resume", value: "Download PDF", href: profile.links.resume, download: true },
];

export function Contact() {
  return (
    <>
      <Section id="contact" title="Contact">
        <p className="max-w-xl text-lg leading-relaxed text-ink/85">
          Open to conversations about AI/ML, autonomy, and defense technology.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {channels.map((c) => {
            const external = !c.href.startsWith("mailto:") && !c.download;
            return (
              <li key={c.label}>
                <a
                  href={c.href}
                  {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                  {...(c.download ? { download: "Kenneth_Gampol_Resume.pdf" } : {})}
                  className="group flex items-center justify-between rounded-2xl border border-line bg-night/60 px-5 py-4 backdrop-blur-md transition-colors hover:border-hud/60"
                >
                  <span>
                    <span className="block font-mono text-[10px] tracking-[0.3em] text-hud uppercase">{c.label}</span>
                    <span className="mt-1 block text-ink/90">{c.value}</span>
                  </span>
                  <span aria-hidden="true" className="text-dim transition-transform group-hover:translate-x-1 group-hover:text-hud">
                    →
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </Section>

      <footer className="px-4 pt-10 pb-16 sm:px-8 lg:px-16">
        <div className="flex max-w-2xl flex-col gap-2 border-t border-line pt-6 font-mono text-[11px] tracking-[0.2em] text-dim uppercase sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <a href="#top" className="hover:text-hud">
            Back to top ↑
          </a>
        </div>
      </footer>
    </>
  );
}
