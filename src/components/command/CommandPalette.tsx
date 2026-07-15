"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Command = {
  id: string;
  label: string;
  hint: string;
  run: () => void;
};

export function CommandPalette({
  open,
  onClose,
  onAsk,
}: {
  open: boolean;
  onClose: () => void;
  onAsk: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<Command[]>(
    () => [
      {
        id: "experience",
        label: "Experience",
        hint: "Halliburton",
        run: () => {
          document
            .getElementById("experience")
            ?.scrollIntoView({ behavior: "smooth" });
        },
      },
      {
        id: "work",
        label: "Selected work",
        hint: "Projects",
        run: () => {
          document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
        },
      },
      {
        id: "education",
        label: "Education",
        hint: "Degrees",
        run: () => {
          document
            .getElementById("education")
            ?.scrollIntoView({ behavior: "smooth" });
        },
      },
      {
        id: "capabilities",
        label: "Skills",
        hint: "Skills",
        run: () => {
          document
            .getElementById("capabilities")
            ?.scrollIntoView({ behavior: "smooth" });
        },
      },
      {
        id: "certifications",
        label: "Certifications",
        hint: "Credentials",
        run: () => {
          document
            .getElementById("certifications")
            ?.scrollIntoView({ behavior: "smooth" });
        },
      },
      {
        id: "ask",
        label: "Ask Jeethesh",
        hint: "AI assistant",
        run: onAsk,
      },
      {
        id: "contact",
        label: "Contact",
        hint: "Email & social",
        run: () => {
          document
            .getElementById("contact")
            ?.scrollIntoView({ behavior: "smooth" });
        },
      },
    ],
    [onAsk],
  );

  const filtered = commands.filter((command) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      command.label.toLowerCase().includes(q) ||
      command.hint.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 10);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[14vh]">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Close command palette"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-line bg-bg-elevated shadow-2xl"
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Jump to a section…"
          className="w-full border-b border-line bg-transparent px-4 py-4 text-sm text-fg outline-none placeholder:text-fg-muted"
        />
        <ul className="max-h-72 overflow-auto p-2">
          {filtered.length === 0 ? (
            <li className="px-3 py-4 text-sm text-fg-muted">No matches</li>
          ) : (
            filtered.map((command) => (
              <li key={command.id}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm text-fg transition hover:bg-accent-dim"
                  onClick={() => {
                    command.run();
                    setQuery("");
                    onClose();
                  }}
                >
                  <span>{command.label}</span>
                  <span className="font-mono text-[11px] text-fg-muted">
                    {command.hint}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
