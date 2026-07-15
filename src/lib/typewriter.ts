export type TypewriterOptions = {
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseAfterType?: number;
  pauseAfterDelete?: number;
};

export type TypewriterState = {
  displayText: string;
  roleIndex: number;
  isDeleting: boolean;
};

export const DEFAULT_TYPEWRITER_OPTIONS = {
  typeSpeed: 80,
  deleteSpeed: 60,
  pauseAfterType: 2000,
  pauseAfterDelete: 300,
} as const;

/** Delete like ctrl+backspace — drop the last word. */
export function deleteLastWord(text: string): string {
  const words = text.trimEnd().split(" ");
  words.pop();
  return words.length > 0 ? `${words.join(" ")} ` : "";
}

export function typeNextChar(current: string, target: string): string {
  return target.slice(0, Math.min(target.length, current.length + 1));
}

export function nextTypewriterStep(
  state: TypewriterState,
  roles: readonly string[],
  options: TypewriterOptions = {},
): { state: TypewriterState; delay: number; kind: "pause" | "type" | "delete" | "advance" } {
  const role = roles[state.roleIndex] ?? "";
  const typeSpeed = options.typeSpeed ?? DEFAULT_TYPEWRITER_OPTIONS.typeSpeed;
  const deleteSpeed = options.deleteSpeed ?? DEFAULT_TYPEWRITER_OPTIONS.deleteSpeed;
  const pauseAfterType =
    options.pauseAfterType ?? DEFAULT_TYPEWRITER_OPTIONS.pauseAfterType;
  const pauseAfterDelete =
    options.pauseAfterDelete ?? DEFAULT_TYPEWRITER_OPTIONS.pauseAfterDelete;

  if (!state.isDeleting && state.displayText === role) {
    return {
      state: { ...state, isDeleting: true },
      delay: pauseAfterType,
      kind: "pause",
    };
  }

  if (state.isDeleting && state.displayText === "") {
    const nextIndex =
      roles.length === 0 ? 0 : (state.roleIndex + 1) % roles.length;
    return {
      state: {
        displayText: "",
        roleIndex: nextIndex,
        isDeleting: false,
      },
      delay: pauseAfterDelete,
      kind: "advance",
    };
  }

  if (state.isDeleting) {
    return {
      state: {
        ...state,
        displayText: deleteLastWord(state.displayText),
      },
      delay: deleteSpeed,
      kind: "delete",
    };
  }

  return {
    state: {
      ...state,
      displayText: typeNextChar(state.displayText, role),
    },
    delay: typeSpeed,
    kind: "type",
  };
}
