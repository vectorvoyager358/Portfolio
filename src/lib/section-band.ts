/** Section band kinds used for santifer-style zebra grading. */
export type SectionBand = "hero" | "muted" | "clear";

/**
 * Alternating grades after the hero, matching santifer's
 * muted → clear → muted rhythm.
 */
export const SECTION_BANDS = {
  hero: "hero",
  experience: "muted",
  work: "clear",
  education: "muted",
  capabilities: "clear",
  certifications: "muted",
  ask: "clear",
  contact: "clear",
} as const satisfies Record<string, SectionBand>;

export function sectionBandClass(band: SectionBand): string {
  if (band === "hero") return "section-band section-band-hero";
  if (band === "muted") return "section-band section-band-muted";
  return "section-band section-band-clear";
}
