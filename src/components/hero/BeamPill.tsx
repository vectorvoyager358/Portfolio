"use client";

import type { ReactNode } from "react";
import { useReducedMotion } from "motion/react";

const HEAL_PARTICLES = [
  { char: "+", left: "10%", delay: "0s", dur: "2.8s", size: "24px" },
  { char: "·", left: "30%", delay: "0.6s", dur: "2.2s", size: "20px" },
  { char: "✦", left: "55%", delay: "1.2s", dur: "3s", size: "18px" },
  { char: "0", left: "75%", delay: "0.3s", dur: "2.5s", size: "22px" },
  { char: "+", left: "90%", delay: "1.8s", dur: "2.6s", size: "20px" },
  { char: "1", left: "20%", delay: "2.1s", dur: "2.4s", size: "22px" },
  { char: "·", left: "65%", delay: "0.9s", dur: "3.2s", size: "18px" },
  { char: "✦", left: "45%", delay: "1.5s", dur: "2.7s", size: "20px" },
] as const;

export function BeamPill({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <span className={`relative inline-block ${reduce ? "" : "beam-pill"}`}>
      <span className="relative z-10">{children}</span>
      {!reduce
        ? HEAL_PARTICLES.map((particle, index) => (
            <span
              key={`${particle.char}-${index}`}
              className="pointer-events-none absolute select-none"
              style={{
                left: particle.left,
                bottom: "50%",
                fontSize: particle.size,
                color: "#4ade80",
                opacity: 0,
                animation: `heal-float ${particle.dur} ease-out ${particle.delay} infinite`,
              }}
              aria-hidden
            >
              {particle.char}
            </span>
          ))
        : null}
    </span>
  );
}
