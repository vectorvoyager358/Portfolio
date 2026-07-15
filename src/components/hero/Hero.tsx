"use client";

import { Fragment, useMemo } from "react";
import {
  BadgeCheck,
  Bot,
  Briefcase,
  FolderGit2,
  Mail,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { profile } from "@/data/profile";
import { Atmosphere } from "@/components/hero/Atmosphere";
import { PersonaAvatar } from "@/components/ui/PersonaAvatar";
import { BeamPill } from "@/components/hero/BeamPill";
import { useTypewriterRotation } from "@/components/hero/useTypewriterRotation";
import {
  heroNavActiveIndex,
} from "@/lib/hero-nav";
import { SECTION_BANDS, sectionBandClass } from "@/lib/section-band";

const heroNavItems = [
  { href: "#experience", label: "My path", icon: Briefcase, action: "link" },
  { href: "#work", label: "What I build", icon: FolderGit2, action: "link" },
  { href: "#contact", label: "Let's talk", icon: Mail, action: "link" },
  { href: "#ask", label: "Ask me", icon: Bot, action: "ask" },
] as const;

export function Hero({ onAsk }: { onAsk: () => void }) {
  const reduce = useReducedMotion();
  const roles = useMemo(
    () =>
      reduce
        ? [profile.greetingRoles[0] ?? profile.title]
        : profile.greetingRoles,
    [reduce],
  );
  const { displayText, roleIndex } = useTypewriterRotation(roles);
  const total = heroNavItems.length;
  const activeIndex = reduce ? 0 : heroNavActiveIndex(roleIndex, total);

  return (
    <section
      id="top"
      className={`${sectionBandClass(SECTION_BANDS.hero)} relative flex min-h-[100svh] items-center overflow-hidden py-24 sm:py-28`}
    >
      <Atmosphere />
      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 sm:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-12"
        >
          <div className="relative shrink-0">
            <div className="relative h-40 w-40 md:h-48 md:w-48">
              <div
                className="absolute inset-0 rounded-full bg-[linear-gradient(to_bottom_right,color-mix(in_srgb,var(--gradient-from)_30%,transparent),color-mix(in_srgb,var(--gradient-to)_30%,transparent))] blur-xl"
                aria-hidden
              />
              <div
                className="absolute inset-0 rounded-full border border-white/25 bg-gradient-to-br from-white/25 to-white/5 shadow-2xl backdrop-blur-sm dark:border-white/15"
                aria-hidden
              />
              <div className="absolute inset-2 rounded-full bg-[linear-gradient(to_bottom_right,color-mix(in_srgb,var(--gradient-from)_55%,transparent),color-mix(in_srgb,var(--gradient-to)_55%,transparent))] p-[2px]">
                <div className="relative h-full w-full overflow-hidden rounded-full bg-bg-elevated">
                  <PersonaAvatar
                    size="hero"
                    priority
                    className="!h-full !w-full"
                  />
                </div>
              </div>
            </div>
            <motion.div
              initial={reduce ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.35, type: "spring", stiffness: 200 }}
              className="absolute -right-1 -bottom-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-bg bg-[linear-gradient(135deg,var(--gradient-from),var(--gradient-to))] shadow-lg"
              aria-label="Verified profile"
            >
              <BadgeCheck className="h-6 w-6 text-white" />
            </motion.div>
          </div>

          <div className="min-w-0 flex-1 text-center md:text-left">
            <p className="mb-2 text-lg text-fg-muted">
              Hi, I&apos;m{" "}
              <span className="text-gradient font-semibold">
                {profile.shortName}
              </span>
              ,
            </p>
            <h1 className="font-display mb-5 text-3xl leading-tight font-bold tracking-tight md:text-4xl lg:text-5xl">
              <span className="text-gradient whitespace-nowrap">
                {displayText}
              </span>
              {!reduce ? (
                <span className="terminal-caret ml-1 inline-block h-[0.85em] w-[3px] translate-y-0.5 align-middle" />
              ) : null}
              <br />
              <span className="text-fg">{profile.greetingLead}</span>
              <br />
              <BeamPill>
                {profile.greetingBeamTerms.map((term, index) => (
                  <Fragment key={term}>
                    {index > 0 ? (
                      <span className="opacity-60"> + </span>
                    ) : null}
                    {term}
                  </Fragment>
                ))}
              </BeamPill>
            </h1>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              {heroNavItems.map((item, index) => {
                const Icon = item.icon;
                const active = index === activeIndex;
                const className = `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all duration-300 ${
                  active
                    ? "scale-105 border border-[#3ee0c5] bg-[#3ee0c5]/15 text-fg"
                    : "border border-[#3ee0c5]/30 bg-bg-elevated/80 text-fg-muted"
                }`;

                if (item.action === "ask") {
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={onAsk}
                      className={className}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                      {item.label}
                    </button>
                  );
                }

                return (
                  <a key={item.href} href={item.href} className={className}>
                    <Icon className="h-4 w-4" aria-hidden />
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
