import { describe, expect, it } from "vitest";
import {
  heroNavActiveIndex,
  heroNavBorderTint,
  heroNavProgress,
  heroNavTint,
  heroNavToPercent,
} from "@/lib/hero-nav";

describe("heroNavProgress", () => {
  it("starts at 0 and ends at 1 across the row", () => {
    expect(heroNavProgress(0, 4)).toBe(0);
    expect(heroNavProgress(3, 4)).toBe(1);
  });

  it("steps evenly", () => {
    expect(heroNavProgress(1, 4)).toBeCloseTo(1 / 3);
    expect(heroNavProgress(2, 4)).toBeCloseTo(2 / 3);
  });
});

describe("heroNavToPercent", () => {
  it("maps to whole percentages toward gradient-to", () => {
    expect(heroNavToPercent(0, 4)).toBe(0);
    expect(heroNavToPercent(3, 4)).toBe(100);
  });
});

describe("heroNavTint", () => {
  it("builds color-mix strings that shift teal to blue", () => {
    expect(heroNavTint(0, 4)).toContain("var(--gradient-from) 100%");
    expect(heroNavTint(3, 4)).toContain("var(--gradient-to) 100%");
    expect(heroNavBorderTint(1, 4)).toContain("transparent");
  });
});

describe("heroNavActiveIndex", () => {
  it("walks left to right then wraps with the typewriter roles", () => {
    expect(heroNavActiveIndex(0, 4)).toBe(0);
    expect(heroNavActiveIndex(1, 4)).toBe(1);
    expect(heroNavActiveIndex(3, 4)).toBe(3);
    expect(heroNavActiveIndex(4, 4)).toBe(0);
    expect(heroNavActiveIndex(5, 4)).toBe(1);
  });
});
