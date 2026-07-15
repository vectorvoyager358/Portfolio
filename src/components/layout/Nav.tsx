"use client";

import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Nav({ onOpenCommand }: { onOpenCommand: () => void }) {
  return (
    <div
      className="fixed top-4 right-4 z-[60] flex items-center gap-2 sm:top-5 sm:right-6"
      role="toolbar"
      aria-label="Site controls"
    >
      <ThemeToggle />
      <button
        type="button"
        onClick={onOpenCommand}
        className="inline-flex items-center gap-2 rounded-md border border-line bg-bg-elevated/90 px-3 py-1.5 text-xs text-fg-muted shadow-sm backdrop-blur-md transition hover:border-accent/40 hover:text-fg"
        aria-label="Open command palette"
      >
        <span className="hidden sm:inline">Jump</span>
        <kbd className="rounded border border-line bg-bg-soft px-1.5 py-0.5 font-mono text-[10px]">
          ⌘K
        </kbd>
      </button>
    </div>
  );
}
