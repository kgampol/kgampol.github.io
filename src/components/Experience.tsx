import { experience, profile, type Role } from "../data/profile";
import { Logo } from "./Logo";
import { Reveal, Section } from "./Section";

/** consecutive roles at the same company share one company header */
function byCompany(roles: Role[]) {
  const groups: { org: string; orgNote?: string; logo?: string; mark?: string; roles: Role[] }[] = [];
  for (const r of roles) {
    const last = groups[groups.length - 1];
    if (last && last.org === r.org) last.roles.push(r);
    else groups.push({ org: r.org, orgNote: r.orgNote, logo: r.logo, mark: r.mark, roles: [r] });
  }
  return groups;
}

export function Experience() {
  return (
    <Section id="experience" title="Experience">
      <ol className="space-y-10">
        {byCompany(experience).map((g) => (
          <Reveal as="li" key={g.org}>
            <div className="flex items-center gap-4">
              <Logo src={g.logo} name={g.org} mark={g.mark} />
              <div>
                <h3 className="text-lg font-medium">{g.org}</h3>
                {g.orgNote && <p className="text-xs text-dim">{g.orgNote}</p>}
              </div>
            </div>

            {/* role timeline: a rail under the logo, one node per role */}
            <ol className="mt-4 ml-[21.5px] space-y-5 border-l border-line pl-8">
              {g.roles.map((r, i) => (
                <li key={r.title} className="relative">
                  <span
                    aria-hidden="true"
                    className={`absolute top-[0.45rem] -left-[36.5px] size-2 rounded-full ring-4 ring-night ${
                      i === 0 && r.dates.includes("Present") ? "bg-hud" : "bg-dim"
                    }`}
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <p className="font-medium text-ink">{r.title}</p>
                    <p className="font-mono text-xs text-dim tabular-nums">{r.dates}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-dim">{r.place}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        ))}
      </ol>
      <a
        href={profile.links.resume}
        download="Kenneth_Gampol_Resume.pdf"
        className="group mt-10 inline-flex items-center gap-1.5 text-sm text-ink/85 transition-colors hover:text-hud"
      >
        Full details in the resume
        <span aria-hidden="true" className="text-dim transition-colors group-hover:text-hud">↓</span>
      </a>
    </Section>
  );
}
