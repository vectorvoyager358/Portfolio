"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MusicToggle } from "@/components/music/MusicToggle";

type AmbientMusicContextValue = {
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
};

const AmbientMusicContext = createContext<AmbientMusicContextValue | null>(
  null,
);

export function AmbientMusicProvider({ children }: { children: ReactNode }) {
  const [chatOpen, setChatOpenState] = useState(false);
  const setChatOpen = useCallback((open: boolean) => {
    setChatOpenState(open);
  }, []);

  const value = useMemo(
    () => ({ chatOpen, setChatOpen }),
    [chatOpen, setChatOpen],
  );

  return (
    <AmbientMusicContext.Provider value={value}>
      {children}
      <MusicToggle chatOpen={chatOpen} />
    </AmbientMusicContext.Provider>
  );
}

export function useAmbientMusic(): AmbientMusicContextValue {
  const ctx = useContext(AmbientMusicContext);
  if (!ctx) {
    throw new Error("useAmbientMusic must be used within AmbientMusicProvider");
  }
  return ctx;
}
