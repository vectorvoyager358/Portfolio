"use client";

import type { ReactNode } from "react";
import { AmbientMusicProvider } from "@/components/providers/AmbientMusicProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return <AmbientMusicProvider>{children}</AmbientMusicProvider>;
}
