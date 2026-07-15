"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/useTheme";

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-bg-elevated/90 shadow-sm backdrop-blur-md transition hover:border-accent/40"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400" />
      ) : (
        <Moon className="h-4 w-4 text-sky-400" />
      )}
    </button>
  );
}
