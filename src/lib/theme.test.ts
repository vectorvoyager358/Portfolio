import { describe, expect, it } from "vitest";
import {
  isDarkTheme,
  oppositeTheme,
  resolveTheme,
  THEME_INIT_SCRIPT,
  THEME_STORAGE_KEY,
} from "@/lib/theme";

describe("theme helpers", () => {
  it("prefers stored theme over system", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("falls back to system preference", () => {
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme(null, false)).toBe("light");
    expect(resolveTheme("weird", true)).toBe("dark");
  });

  it("toggles and classifies themes", () => {
    expect(oppositeTheme("dark")).toBe("light");
    expect(oppositeTheme("light")).toBe("dark");
    expect(isDarkTheme("dark")).toBe(true);
    expect(isDarkTheme("light")).toBe(false);
  });

  it("ships a FOUC-safe init script for the storage key", () => {
    expect(THEME_INIT_SCRIPT).toContain(THEME_STORAGE_KEY);
    expect(THEME_INIT_SCRIPT).toContain("classList.toggle");
  });
});
