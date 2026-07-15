import { Award } from "lucide-react";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/ui/Reveal";
import { CertLogo } from "@/components/credentials/CertLogo";
import { SECTION_BANDS, sectionBandClass } from "@/lib/section-band";

export function Certifications() {
  const certifications = [...profile.certifications].sort(
    (a, b) => Number(b.year ?? 0) - Number(a.year ?? 0),
  );

  return (
    <section
      id="certifications"
      className={`${sectionBandClass(SECTION_BANDS.certifications)} relative`}
    >
      <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <Reveal>
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 font-mono text-xs tracking-[0.22em] text-accent uppercase">
              Credentials
            </p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <Award className="h-5 w-5 text-accent" aria-hidden />
              </div>
              <h2 className="font-display text-3xl leading-tight tracking-tight text-fg sm:text-4xl md:text-5xl">
                Certifications
              </h2>
            </div>
            <p className="mt-4 text-base leading-relaxed text-fg-muted sm:text-lg">
              Signals of continued learning across AI tooling and modern developer
              workflows.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="overflow-hidden rounded-xl border border-line bg-bg-elevated">
            {certifications.map((cert, index) => (
              <a
                key={`${cert.issuer}-${cert.name}`}
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-4 px-5 py-4 transition hover:bg-bg-soft sm:gap-6 sm:px-6 sm:py-5 ${
                  index > 0 ? "border-t border-line" : ""
                }`}
              >
                <span className="w-12 shrink-0 font-mono text-sm font-semibold tabular-nums text-accent">
                  {cert.year ?? "—"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-base leading-snug tracking-tight text-fg transition group-hover:text-accent sm:text-lg">
                    {cert.name}
                  </p>
                  <p className="mt-0.5 text-sm text-fg-muted">{cert.issuer}</p>
                </div>
                <div className="opacity-60 transition-opacity group-hover:opacity-100">
                  <CertLogo logo={cert.logo} />
                </div>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
