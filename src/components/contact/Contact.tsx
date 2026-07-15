import Link from "next/link";
import { ExternalLink, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/ui/Reveal";
import { LinkedInLogo } from "@/components/contact/LinkedInLogo";
import { SECTION_BANDS, sectionBandClass } from "@/lib/section-band";

export function Contact() {
  const { contactCta } = profile;

  return (
    <footer
      id="contact"
      className={`${sectionBandClass(SECTION_BANDS.contact)} relative py-16 md:py-24`}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--bg) 25%, var(--bg) 75%, transparent 100%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-5xl px-5 text-center sm:px-8">
        <Reveal>
          <h2 className="font-display mb-4 text-3xl font-bold tracking-tight text-fg md:text-4xl">
            {contactCta.title}
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg">
            {contactCta.description}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--gradient-from),var(--gradient-to))] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-accent/25 transition-all duration-200 hover:brightness-110 hover:shadow-xl hover:shadow-accent/30 active:brightness-95"
            >
              <Mail className="h-4 w-4" aria-hidden />
              {contactCta.contactLabel}
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-bg-elevated/80 px-6 py-3 text-sm font-medium text-fg transition-colors duration-200 hover:border-accent/50 hover:bg-accent/5"
            >
              <LinkedInLogo className="h-4 w-4 text-[#0A66C2]" />
              LinkedIn
              <ExternalLink className="h-3 w-3 text-fg-muted" aria-hidden />
            </a>
          </div>
        </Reveal>

        <p className="mt-12 text-xs text-fg-muted">
          © {new Date().getFullYear()} {profile.name}
          <span className="mx-2 text-line">|</span>
          <Link href="/privacy" className="transition hover:text-accent">
            Privacy
          </Link>
        </p>
      </div>
    </footer>
  );
}
