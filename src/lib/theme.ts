export const THEME_STORAGE_KEY = "theme";

export type Theme = "dark" | "light";

export function resolveTheme(
  stored: string | null,
  prefersDark: boolean,
): Theme {
  if (stored === "dark" || stored === "light") return stored;
  return prefersDark ? "dark" : "light";
}

export function isDarkTheme(theme: Theme): boolean {
  return theme === "dark";
}

export function oppositeTheme(theme: Theme): Theme {
  return theme === "dark" ? "light" : "dark";
}

/** Inline blocking script — keeps first paint aligned with preference. */
export const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});var d=s?s==="dark":window.matchMedia("(prefers-color-scheme:dark)").matches;var h=document.documentElement;h.classList.toggle("dark",d);h.classList.toggle("light",!d);h.style.colorScheme=d?"dark":"light";}catch(e){document.documentElement.classList.add("dark");}})();`;
