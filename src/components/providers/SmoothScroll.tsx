"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, type ReactNode } from "react";

function ScrollLock({ locked }: { locked: boolean }) {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    if (locked) lenis.stop();
    else lenis.start();
  }, [locked, lenis]);

  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);

  return null;
}

export function SmoothScroll({
  children,
  locked = false,
}: {
  children: ReactNode;
  locked?: boolean;
}) {
  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.1, smoothWheel: true }}>
      <ScrollLock locked={locked} />
      {children}
    </ReactLenis>
  );
}
