import type { Metadata } from "next";
import Link from "next/link";
import { privacyPolicy } from "@/data/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for Jeethesh Reddy's portfolio — how Ask Jeethesh chat, voice mode, and site preferences handle data.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrivacyPage() {
  const t = privacyPolicy;

  return (
    <div className="relative min-h-full">
      <div className="noise" aria-hidden />
      <div className="dot-grid" aria-hidden />
      <main className="relative z-10 mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-24">
        <header className="mb-10">
          <h1 className="font-display text-3xl font-bold tracking-tight text-fg md:text-4xl">
            {t.title}
          </h1>
          <p className="mt-2 text-sm text-fg-muted">{t.lastUpdated}</p>
        </header>

        <article>
          <p className="mb-8 text-base leading-relaxed text-fg-muted md:text-lg">
            {t.intro}
          </p>

          {t.sections.map((section) => (
            <section key={section.heading} className="mb-8">
              <h2 className="font-display mb-3 text-xl font-semibold tracking-tight text-fg">
                {section.heading}
              </h2>

              {section.items ? (
                <ul className="mb-4 space-y-2">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-base text-fg-muted"
                    >
                      <span
                        className="mt-0.5 shrink-0 font-bold text-accent"
                        aria-hidden
                      >
                        ●
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {section.body ? (
                <p className="text-base leading-relaxed text-fg-muted">
                  {section.body}
                </p>
              ) : null}

              {section.email ? (
                <p className="mt-2">
                  <a
                    href={`mailto:${section.email}`}
                    className="text-accent underline underline-offset-2 transition hover:text-accent-strong"
                  >
                    {section.email}
                  </a>
                </p>
              ) : null}
            </section>
          ))}

          <div className="mt-12 border-t border-line pt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-medium text-accent transition hover:underline"
            >
              ← {t.backHome}
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
