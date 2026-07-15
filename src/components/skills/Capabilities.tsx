import { Code, Globe } from "lucide-react";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/ui/Reveal";
import { SECTION_BANDS, sectionBandClass } from "@/lib/section-band";

export function Capabilities() {
  return (
    <section
      id="capabilities"
      className={`${sectionBandClass(SECTION_BANDS.capabilities)} relative`}
    >
      <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <Reveal>
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 font-mono text-xs tracking-[0.22em] text-accent uppercase">
              Capabilities
            </p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <Code className="h-5 w-5 text-accent" aria-hidden />
              </div>
              <h2 className="font-display text-3xl leading-tight tracking-tight text-fg sm:text-4xl md:text-5xl">
                Skills
              </h2>
            </div>
            <p className="mt-4 text-base leading-relaxed text-fg-muted sm:text-lg">
              Systems, AI, cloud, and backend craft — grouped by how they show up
              in shipped work.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-10 md:grid-cols-4">
          <Reveal delay={0.05}>
            <h3 className="font-display mb-4 flex items-center gap-2 text-lg tracking-tight text-fg">
              <Globe className="h-4 w-4 text-accent" aria-hidden />
              Languages
            </h3>
            <div className="space-y-3">
              {profile.languages.map((language) => (
                <div
                  key={language.name}
                  className="flex items-center justify-between gap-4 text-sm"
                >
                  <span className="text-fg">{language.name}</span>
                  <span
                    className={
                      language.native
                        ? "shrink-0 font-medium text-accent"
                        : language.name === "Spanish"
                          ? "shrink-0 italic text-fg-muted"
                          : "shrink-0 text-fg-muted"
                    }
                  >
                    {language.level}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="grid gap-10 sm:grid-cols-2 md:col-span-3">
            {profile.skills.map((cluster, index) => (
              <Reveal key={cluster.id} delay={0.05 * (index + 1)}>
                <div className="border-t border-line pt-6">
                  <h3 className="font-display text-2xl tracking-tight text-fg">
                    {cluster.label}
                  </h3>
                  <ul className="mt-5 space-y-2.5">
                    {cluster.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-sm text-fg-muted"
                      >
                        <span className="h-px w-5 bg-accent/70" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
