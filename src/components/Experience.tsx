import { experience, type Role } from "../data/profile";
import { Logo } from "./Logo";
import { Reveal, Section } from "./Section";

/** consecutive roles at the same company share one company header */
function byCompany(roles: Role[]) {
  const groups: { org: string; logo?: string; roles: Role[] }[] = [];
  for (const r of roles) {
    const last = groups[groups.length - 1];
    if (last && last.org === r.org) last.roles.push(r);
    else groups.push({ org: r.org, logo: r.logo, roles: [r] });
  }
  return groups;
}

export function Experience() {
  return (
    <Section id="experience" title="Experience">
      <ol className="space-y-12">
        {byCompany(experience).map((g) => (
          <Reveal as="li" key={g.org}>
            <div className="flex items-center gap-4">
              <Logo src={g.logo} name={g.org} />
              <h3 className="text-lg font-medium">{g.org}</h3>
            </div>

            {/* role timeline: a rail under the logo, one node per role */}
            <ol className="mt-5 ml-5 space-y-8 border-l border-line pl-8">
              {g.roles.map((r, i) => (
                <li key={r.title} className="relative">
                  <span
                    aria-hidden="true"
                    className={`absolute top-[0.45rem] -left-[2.32rem] size-2 rounded-full ring-4 ring-night ${
                      i === 0 && r.dates.includes("Present") ? "bg-hud" : "bg-dim"
                    }`}
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <p className="font-medium text-ink">{r.title}</p>
                    <p className="font-mono text-xs text-dim tabular-nums">{r.dates}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-dim">{r.place}</p>
                  <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-ink/80">
                    {r.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                  <p className="mt-3 font-mono text-[11px] tracking-wide text-hud/80">{r.tags.join("  ·  ")}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
