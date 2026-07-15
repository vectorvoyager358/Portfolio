"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  isDarkTheme,
  oppositeTheme,
  resolveTheme,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/lib/theme";

function readDomTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("light")
    ? "light"
    : "dark";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const dark = isDarkTheme(theme);
  root.classList.toggle("dark", dark);
  root.classList.toggle("light", !dark);
  root.style.colorScheme = theme;
}

function subscribeTheme(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getThemeSnapshot(): Theme {
  return readDomTheme();
}

function getServerThemeSnapshot(): Theme {
  return "dark";
}

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  useEffect(() => {
    if (localStorage.getItem(THEME_STORAGE_KEY)) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      applyTheme(resolveTheme(null, event.matches));
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = oppositeTheme(readDomTheme());
    applyTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // ignore storage errors
    }
  }, []);

  return {
    theme,
    isDark: isDarkTheme(theme),
    toggleTheme,
  };
}
