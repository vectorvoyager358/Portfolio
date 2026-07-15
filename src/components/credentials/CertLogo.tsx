import type { ReactNode } from "react";
import type { CertLogoKey } from "@/data/profile";

type CertLogoProps = {
  logo: CertLogoKey;
};

export function CertLogo({ logo }: CertLogoProps) {
  const logos: Record<CertLogoKey, ReactNode> = {
    anthropic: (
      <svg
        viewBox="0 0 92.2 65"
        className="h-6 w-6"
        fill="currentColor"
        aria-hidden
      >
        <path d="M66.5,0H52.4l25.7,65h14.1L66.5,0z M25.7,0L0,65h14.4l5.3-13.6h26.9L51.8,65h14.4L40.5,0C40.5,0,25.7,0,25.7,0z M24.3,39.3l8.8-22.8l8.8,22.8H24.3z" />
      </svg>
    ),
    microsoft: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="currentColor"
        aria-hidden
      >
        <path d="M0 0h11.377v11.372H0zm12.623 0H24v11.372H12.623zM0 12.623h11.377V24H0zm12.623 0H24V24H12.623z" />
      </svg>
    ),
  };

  return logos[logo] ?? null;
}
