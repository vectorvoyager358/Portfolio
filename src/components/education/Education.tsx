import { profile } from "@/data/profile";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SECTION_BANDS, sectionBandClass } from "@/lib/section-band";

export function Education() {
  return (
    <section
      id="education"
      className={`${sectionBandClass(SECTION_BANDS.education)} relative`}
    >
      <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Education"
          title="Academic foundation"
          description="Data science graduate training paired with a strong engineering undergraduate core."
        />
      </Reveal>
      <div className="grid gap-8 sm:grid-cols-2">
        {profile.education.map((ed, index) => (
          <Reveal key={ed.school} delay={0.05 * index}>
            <div className="border-t border-line pt-6">
              <p className="font-display text-xl text-fg sm:text-2xl">
                {ed.school}
              </p>
              <p className="mt-2 text-sm text-fg-muted sm:text-base">
                {ed.degree}
              </p>
              <p className="mt-3 font-mono text-xs text-fg-muted">
                {ed.dates}
                {ed.detail ? ` · ${ed.detail}` : ""}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
      </div>
    </section>
  );
}
