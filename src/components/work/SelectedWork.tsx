"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, GitBranch } from "lucide-react";
import { profile, type Project } from "@/data/profile";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SECTION_BANDS, sectionBandClass } from "@/lib/section-band";

function ProjectPanel({
  project,
  open,
  onToggle,
}: {
  project: Project;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      className={`rounded-2xl border bg-bg-elevated/60 px-6 shadow-sm backdrop-blur-sm transition-colors sm:px-8 ${
        open ? "border-accent/40" : "border-line"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="group flex w-full items-start justify-between gap-6 py-6 text-left sm:py-7"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            {project.status ? (
              <span className="font-mono text-[10px] tracking-[0.16em] text-accent uppercase">
                {project.status}
              </span>
            ) : null}
            <p
              className="font-mono text-[11px] tracking-[0.18em] uppercase"
              style={{ color: project.accent }}
            >
              {project.tagline}
            </p>
          </div>
          <h3 className="font-display text-2xl tracking-tight text-fg sm:text-3xl md:text-4xl">
            {project.name}
          </h3>
        </div>
        <span
          className={`mt-2 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-lg transition ${
            open
              ? "bg-accent text-bg"
              : "text-fg-muted group-hover:border-accent/50"
          }`}
        >
          {open ? "−" : "+"}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-8 pb-10 md:grid-cols-[1.05fr_0.95fr]">
              <div>
                <p className="max-w-2xl text-base leading-relaxed text-fg-muted">
                  {project.description}
                </p>
                {project.why ? (
                  <div
                    className="mt-5 border-l-2 pl-4"
                    style={{ borderColor: project.accent }}
                  >
                    <p className="font-mono text-[10px] tracking-[0.16em] text-accent uppercase">
                      Why I built it
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-fg/85">
                      {project.why}
                    </p>
                  </div>
                ) : null}
                <ul className="mt-6 space-y-3">
                  {project.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm leading-relaxed text-fg/90"
                    >
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: project.accent }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                {project.metrics?.length ? (
                  <div className="grid grid-cols-2 gap-x-2 gap-y-4 border-t border-line pt-4 sm:grid-cols-[1.35fr_1fr_1fr]">
                    {project.metrics.map((metric) => (
                      <div key={metric.label} className="min-w-0">
                        <p className="whitespace-nowrap font-display text-sm text-fg lg:text-base">
                          {metric.value}
                        </p>
                        <p className="mt-1 font-mono text-[10px] tracking-[0.14em] text-fg-muted uppercase">
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
                <div>
                  <p className="mb-3 font-mono text-[11px] tracking-[0.18em] text-fg-muted uppercase">
                    Stack
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="border-b border-line pb-0.5 text-sm text-fg"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-accent transition hover:text-accent-strong"
                  >
                    <GitBranch className="h-4 w-4" />
                    Repository
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                  {project.live ? (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-fg-muted transition hover:text-fg"
                    >
                      Live demo
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  );
}

export function SelectedWork() {
  const [openId, setOpenId] = useState<string>(profile.projects[0]?.id ?? "");

  return (
    <section
      id="work"
      className={`${sectionBandClass(SECTION_BANDS.work)} relative`}
    >
      <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="What I build"
          title="Projects"
        />
      </Reveal>
      <Reveal delay={0.08}>
        <div className="mx-auto mt-10 max-w-3xl">
          {profile.projects.map((project, index) => (
            <div key={project.id}>
              <ProjectPanel
                project={project}
                open={openId === project.id}
                onToggle={() =>
                  setOpenId((current) =>
                    current === project.id ? "" : project.id,
                  )
                }
              />
              {index < profile.projects.length - 1 ? (
                <div className="flex justify-center" aria-hidden>
                  <span className="block h-12 w-px border-l border-dashed border-line" />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Reveal>
      </div>
    </section>
  );
}
