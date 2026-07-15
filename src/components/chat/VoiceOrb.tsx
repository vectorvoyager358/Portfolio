"use client";

import { useEffect, useRef } from "react";
import {
  isVoiceSpeechLevel,
  meterFromTimeDomain,
} from "@/lib/audio-meter";

export type VoiceStatus =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "error";

function lerp(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

function adjustAlpha(color: string, alpha: number): string {
  if (color.startsWith("#")) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return color;
}

const COLORS = {
  from: "#3EE0C5",
  to: "#7EB8FF",
};

export function VoiceOrb({
  stream,
  status,
  statusText,
  onSpeechDetected,
}: {
  stream: MediaStream | null;
  status: VoiceStatus;
  statusText?: string;
  onSpeechDetected?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const smoothLevelRef = useRef(0);
  const timeRef = useRef(0);
  const levelRef = useRef(0);
  const speechFramesRef = useRef(0);
  const speechDetectedRef = useRef(false);
  const onSpeechDetectedRef = useRef(onSpeechDetected);
  const statusRef = useRef(status);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    onSpeechDetectedRef.current = onSpeechDetected;
  }, [onSpeechDetected]);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  useEffect(() => {
    levelRef.current = 0;
    speechFramesRef.current = 0;
    speechDetectedRef.current = false;
    if (status !== "listening" || !stream) return;

    const AudioContextCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextCtor) return;

    const context = new AudioContextCtor();
    const analyser = context.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.7;
    const source = context.createMediaStreamSource(stream);
    source.connect(analyser);
    const data = new Uint8Array(new ArrayBuffer(analyser.fftSize));
    let alive = true;
    let tickId = 0;

    const tick = () => {
      if (!alive) return;
      analyser.getByteTimeDomainData(data);
      levelRef.current = meterFromTimeDomain(data);
      if (!speechDetectedRef.current) {
        speechFramesRef.current = isVoiceSpeechLevel(levelRef.current)
          ? speechFramesRef.current + 1
          : 0;
        if (speechFramesRef.current >= 3) {
          speechDetectedRef.current = true;
          onSpeechDetectedRef.current?.();
        }
      }
      tickId = window.requestAnimationFrame(tick);
    };

    const resumeAndTick = () => {
      void context.resume().then(() => {
        if (!alive) return;
        tickId = window.requestAnimationFrame(tick);
      });
    };

    resumeAndTick();

    const onGesture = () => resumeAndTick();
    window.addEventListener("pointerdown", onGesture, { once: true });

    return () => {
      alive = false;
      window.removeEventListener("pointerdown", onGesture);
      window.cancelAnimationFrame(tickId);
      try {
        source.disconnect();
      } catch {
        // ignore
      }
      void context.close().catch(() => undefined);
      levelRef.current = 0;
    };
  }, [stream, status]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const paint = () => {
      const isMobile = window.matchMedia("(max-width: 640px)").matches;
      const dpr = window.devicePixelRatio || 1;
      const size = isMobile ? 200 : 180;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cx = size / 2;
      const cy = size / 2;
      const baseRadius = size * 0.28;
      const currentStatus = statusRef.current;

      const rawLevel =
        currentStatus === "listening"
          ? levelRef.current
          : currentStatus === "thinking"
            ? 0.12 + Math.sin(timeRef.current * 2.5) * 0.04
            : 0;

      smoothLevelRef.current = lerp(smoothLevelRef.current, rawLevel, 0.15);
      const smoothLevel = smoothLevelRef.current;

      timeRef.current += 0.02;
      const t = timeRef.current;

      ctx.clearRect(0, 0, size, size);

      let radius = baseRadius;
      let distortion = 0;
      let opacity = 1;
      let gradientAngle = t * 0.5;
      let pulseScale = 1;

      if (reducedMotionRef.current) {
        opacity =
          currentStatus === "listening"
            ? 0.7 + smoothLevel * 0.3
            : currentStatus === "thinking"
              ? 0.4 + Math.sin(t * 3) * 0.2
              : 0.6;
      } else {
        switch (currentStatus) {
          case "listening":
            distortion = 0.05 + smoothLevel * 0.28;
            radius = baseRadius * (1 + smoothLevel * 0.18);
            opacity = 0.85;
            break;
          case "thinking":
            gradientAngle = t * 2;
            distortion = 0.08 + Math.sin(t * 3) * 0.04;
            pulseScale = 0.98 + Math.sin(t * 2.5) * 0.02;
            opacity = 0.72;
            break;
          case "error":
            distortion = 0.04;
            opacity = 0.65;
            break;
          default:
            pulseScale = 0.95 + Math.sin(t * 1.5) * 0.05;
            distortion = 0.02;
            opacity = 0.6;
        }
      }

      radius *= pulseScale;

      const segments = 64;
      ctx.beginPath();
      for (let i = 0; i <= segments; i += 1) {
        const angle = (i / segments) * Math.PI * 2;
        const n1 = Math.sin(angle * 3 + t * 2) * distortion;
        const n2 = Math.cos(angle * 5 + t * 1.5) * distortion * 0.7;
        const n3 = Math.sin(angle * 7 + t * 3) * distortion * 0.3;
        const displacement = 1 + n1 + n2 + n3;
        const r = radius * displacement;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      const gx1 = cx + Math.cos(gradientAngle) * radius;
      const gy1 = cy + Math.sin(gradientAngle) * radius;
      const gx2 = cx - Math.cos(gradientAngle) * radius;
      const gy2 = cy - Math.sin(gradientAngle) * radius;
      const gradient = ctx.createLinearGradient(gx1, gy1, gx2, gy2);

      if (currentStatus === "error") {
        gradient.addColorStop(0, "#ff7b72");
        gradient.addColorStop(1, adjustAlpha("#ffb4ae", 0.55));
      } else if (currentStatus === "listening") {
        gradient.addColorStop(0, COLORS.from);
        gradient.addColorStop(1, adjustAlpha(COLORS.to, 0.65));
      } else if (currentStatus === "thinking") {
        gradient.addColorStop(0, adjustAlpha(COLORS.to, 0.85));
        gradient.addColorStop(1, adjustAlpha(COLORS.from, 0.7));
      } else {
        gradient.addColorStop(0, adjustAlpha(COLORS.from, 0.7));
        gradient.addColorStop(1, adjustAlpha(COLORS.to, 0.7));
      }

      ctx.globalAlpha = opacity;
      ctx.fillStyle = gradient;
      ctx.fill();

      if (currentStatus === "listening" || currentStatus === "thinking") {
        ctx.shadowBlur = 20 + smoothLevel * 35;
        ctx.shadowColor =
          currentStatus === "thinking" ? COLORS.to : COLORS.from;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.globalAlpha = 1;
      rafRef.current = window.requestAnimationFrame(paint);
    };

    rafRef.current = window.requestAnimationFrame(paint);
    return () => {
      window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (status === "idle") return null;

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-2">
      <div
        role="img"
        aria-label={
          status === "thinking" ? "Transcribing speech" : "Voice activity"
        }
        className="relative z-10 flex min-h-[200px] min-w-[200px] items-center justify-center rounded-full"
      >
        <canvas
          ref={canvasRef}
          aria-hidden
          className="pointer-events-none block"
        />
      </div>
      <p
        className={`text-center font-mono text-[11px] tracking-[0.16em] uppercase ${
          status === "error" ? "text-danger" : "text-fg-muted"
        }`}
        aria-live="polite"
      >
        {statusText}
      </p>
    </div>
  );
}
