import { profile } from "@/data/profile";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SECTION_BANDS, sectionBandClass } from "@/lib/section-band";

export function Experience() {
  const job = profile.experience[0];

  return (
    <section
      id="experience"
      className={`${sectionBandClass(SECTION_BANDS.experience)} relative`}
    >
      <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="My path"
          title="Work experience"
          description="End-to-end ownership across discovery → delivery → adoption, collaborating closely with stakeholders and engineering."
        />
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mb-14 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {profile.focusAreas.map((area) => (
            <div key={area.title} className="border-t border-line pt-4">
              <h3 className="font-display text-lg tracking-tight text-fg">
                {area.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {area.detail}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <article className="border-t border-line pt-10">
          <div className="grid gap-10 md:grid-cols-[240px_1fr]">
            <div className="space-y-2">
              <p className="font-display text-2xl text-fg">{job.company}</p>
              <p className="text-sm text-accent">{job.role}</p>
              <p className="font-mono text-xs text-fg-muted">
                {job.start} – {job.end}
              </p>
              <p className="text-xs text-fg-muted">{job.location}</p>
            </div>
            <div>
              {job.summary ? (
                <p className="mb-6 max-w-2xl text-base leading-relaxed text-fg/90">
                  {job.summary}
                </p>
              ) : null}
              <ol className="relative space-y-5 border-l border-line pl-6">
                {job.bullets.map((bullet) => (
                  <li key={bullet} className="relative">
                    <span className="absolute top-2 -left-[31px] h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_0_4px_rgba(62,224,197,0.12)]" />
                    <p className="text-sm leading-relaxed text-fg/90 sm:text-base">
                      {bullet}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </article>
      </Reveal>
      </div>
    </section>
  );
}
