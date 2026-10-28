import { useEffect, useState } from "react";
import { profile } from "../data/profile";

const links = [
  { href: "#projects", label: "Projects" },
  { href: "#education", label: "Education" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "border-b border-line bg-night/70 backdrop-blur-md" : ""
      }`}
    >
      <nav className="flex h-16 items-center justify-between px-4 sm:px-8 lg:px-16" aria-label="Primary">
        <a href="#top" className="font-mono text-sm tracking-[0.2em] uppercase">
          K<span className="text-hud">·</span>Gampol
        </a>

        <ul className="hidden items-center gap-8 text-sm text-dim md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a className="transition-colors hover:text-ink" href={l.href}>
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={profile.links.resume}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-hud/60 px-4 py-1.5 text-hud transition-colors hover:bg-hud hover:text-night"
            >
              Resume
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="-mr-2 grid size-10 place-items-center md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="relative block h-3 w-5">
            <span className={`absolute left-0 h-px w-5 bg-ink transition-transform ${open ? "top-1.5 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 h-px w-5 bg-ink transition-transform ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
          </span>
        </button>
      </nav>

      {open && (
        <ul id="mobile-menu" className="flex flex-col gap-1 px-4 pb-6 md:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <a className="block py-3 text-lg" href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a className="block py-3 text-lg text-hud" href={profile.links.resume} target="_blank" rel="noreferrer">
              Resume ↗
            </a>
          </li>
        </ul>
      )}
    </header>
  );
}
