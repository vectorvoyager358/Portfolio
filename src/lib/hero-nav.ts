/** Progress 0..1 along a teal→blue spectrum for hero nav tints. */
export function heroNavProgress(index: number, total: number): number {
  if (total <= 1) return 1;
  return index / (total - 1);
}

/** CSS color-mix percentage toward gradient-to for a nav item. */
export function heroNavToPercent(index: number, total: number): number {
  return Math.round(heroNavProgress(index, total) * 100);
}

/** Solid tint along the brand gradient (for icons / borders). */
export function heroNavTint(index: number, total: number): string {
  const to = heroNavToPercent(index, total);
  const from = 100 - to;
  return `color-mix(in srgb, var(--gradient-from) ${from}%, var(--gradient-to) ${to}%)`;
}

/** Soft border tint of the same hue. */
export function heroNavBorderTint(index: number, total: number): string {
  return `color-mix(in srgb, ${heroNavTint(index, total)} 45%, transparent)`;
}

/**
 * Which nav pill is highlighted while the hero typewriter cycles roles.
 * Wraps so the highlight walks left→right and returns.
 */
export function heroNavActiveIndex(
  roleIndex: number,
  total: number,
): number {
  if (total <= 0) return 0;
  return ((roleIndex % total) + total) % total;
}
