"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AMBIENT_AUDIO_SRC,
  AMBIENT_AUTO_SHOW_DELAY_MS,
  AMBIENT_BAND_CALIBRATION,
  AMBIENT_BAR_COUNT,
  AMBIENT_FADE_MS,
  AMBIENT_FFT_SIZE,
  AMBIENT_SEEN_KEY,
  AMBIENT_STORAGE_KEY,
  AMBIENT_VOL_DEFAULT,
  ambientTargetVolume,
  fadeVolumeAtStep,
  hzToBin,
  musicTooltipText,
  serializeAmbientPreference,
} from "@/lib/ambient-music";

function fadeTo(audio: HTMLAudioElement, target: number, ms: number) {
  const start = audio.volume;
  const steps = 20;
  const stepMs = ms / steps;
  let step = 0;
  const interval = window.setInterval(() => {
    step += 1;
    audio.volume = fadeVolumeAtStep({ start, target, step, steps });
    if (step >= steps) window.clearInterval(interval);
  }, stepMs);
}

function EqualizerBars({ analyser }: { analyser: AnalyserNode }) {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef(0);
  const dataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const smoothRef = useRef<number[]>(Array(AMBIENT_BAR_COUNT).fill(0.3));
  const prevRef = useRef<number[]>(Array(AMBIENT_BAR_COUNT).fill(0));
  const swellRef = useRef<number[]>(Array(AMBIENT_BAR_COUNT).fill(0));
  const frameRef = useRef(0);
  const minRef = useRef<number[]>(Array(AMBIENT_BAR_COUNT).fill(255));
  const maxRef = useRef<number[]>(Array(AMBIENT_BAR_COUNT).fill(0));

  useEffect(() => {
    const bufLen = analyser.frequencyBinCount;
    dataRef.current = new Uint8Array(new ArrayBuffer(bufLen));

    const bands = AMBIENT_BAND_CALIBRATION.map((band) => ({
      from: hzToBin(band.lo),
      to: hzToBin(band.hi),
    }));

    const tick = () => {
      frameRef.current += 1;
      const data = dataRef.current;
      if (!data) return;
      analyser.getByteFrequencyData(data);

      for (let i = 0; i < AMBIENT_BAR_COUNT; i += 1) {
        const band = bands[i];
        if (!band) continue;

        let sum = 0;
        let count = 0;
        for (let j = band.from; j <= band.to && j < bufLen; j += 1) {
          sum += data[j] ?? 0;
          count += 1;
        }
        if (count === 0) continue;
        const rawAvg = sum / count;

        if (rawAvg < (minRef.current[i] ?? 255)) minRef.current[i] = rawAvg;
        else {
          minRef.current[i] =
            (minRef.current[i] ?? rawAvg) +
            (rawAvg - (minRef.current[i] ?? rawAvg)) * 0.0003;
        }
        if (rawAvg > (maxRef.current[i] ?? 0)) maxRef.current[i] = rawAvg;
        else {
          maxRef.current[i] =
            (maxRef.current[i] ?? rawAvg) -
            ((maxRef.current[i] ?? rawAvg) - rawAvg) * 0.0003;
        }

        const spread = (maxRef.current[i] ?? 0) - (minRef.current[i] ?? 0);
        const minSpread = 25;
        let effMin = minRef.current[i] ?? 0;
        let effMax = maxRef.current[i] ?? 0;
        if (spread < minSpread) {
          const mid = (effMin + effMax) / 2;
          effMin = mid - minSpread / 2;
          effMax = mid + minSpread / 2;
        }

        const normalized = (rawAvg - effMin) / (effMax - effMin);
        const clamped01 = Math.max(0, Math.min(1, normalized));

        const delta = clamped01 - (prevRef.current[i] ?? 0);
        prevRef.current[i] = clamped01;
        if (delta > 0.01) {
          swellRef.current[i] = Math.min(
            0.3,
            (swellRef.current[i] ?? 0) + delta * 2,
          );
        } else {
          swellRef.current[i] = (swellRef.current[i] ?? 0) * 0.94;
        }

        const phase = Math.sin(frameRef.current * 0.015 + i * 1.8) * 0.06;
        const target =
          0.15 + clamped01 * 0.7 + (swellRef.current[i] ?? 0) + phase;
        const clamped = Math.max(0.12, Math.min(1, target));

        smoothRef.current[i] =
          (smoothRef.current[i] ?? 0.3) +
          (clamped - (smoothRef.current[i] ?? 0.3)) * 0.15;

        const bar = barsRef.current[i];
        if (bar) bar.style.height = `${(smoothRef.current[i] ?? 0.3) * 100}%`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [analyser]);

  return (
    <div className="flex h-[18px] items-end gap-[3px]">
      {Array.from({ length: AMBIENT_BAR_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            barsRef.current[i] = el;
          }}
          className="w-[4px] rounded-full bg-accent"
          style={{ height: "30%" }}
        />
      ))}
    </div>
  );
}

function MutedBars() {
  return (
    <div className="flex h-[18px] items-end gap-[3px]">
      {[8, 13, 10, 11].map((height, i) => (
        <div
          key={i}
          className="w-1 rounded-full bg-fg/45"
          style={
            {
              height,
              animation: `muted-breathe 2.5s ease-in-out ${i * 0.3}s infinite`,
              transformOrigin: "bottom",
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

function SignalBadge() {
  return (
    <span className="font-mono text-[10px] tracking-[0.18em] text-accent uppercase">
      SIG
    </span>
  );
}

function CommTooltip({
  playing,
  dismissed,
}: {
  playing: boolean;
  dismissed?: boolean;
}) {
  const text = musicTooltipText({ playing, dismissed });

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.2 }}
      className="pointer-events-none absolute bottom-1 left-full ml-3 whitespace-nowrap"
    >
      <div className="flex items-center gap-2 rounded-lg border border-line bg-bg-elevated/95 px-3 py-1.5 shadow-lg backdrop-blur-md">
        <SignalBadge />
        <span className="font-mono text-xs tracking-wide text-fg-muted">
          {text}
          {!dismissed && !playing ? (
            <span className="terminal-caret ml-1 inline-block h-[0.85em] w-[2px] align-middle" />
          ) : null}
        </span>
      </div>
    </motion.div>
  );
}

export function MusicToggle({ chatOpen }: { chatOpen: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [autoShow, setAutoShow] = useState(false);
  const [incoming, setIncoming] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [touchFullscreen, setTouchFullscreen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const interactedRef = useRef(false);
  const chatOpenRef = useRef(chatOpen);
  const playingRef = useRef(playing);

  useEffect(() => {
    chatOpenRef.current = chatOpen;
  }, [chatOpen]);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover)");
    const sync = () => setTouchFullscreen(!media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const audio = new Audio(AMBIENT_AUDIO_SRC);
    audio.loop = true;
    audio.volume = AMBIENT_VOL_DEFAULT;
    audio.preload = "none";
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const ensureAudioContext = useCallback((): AnalyserNode | null => {
    if (analyser) return analyser;
    if (ctxRef.current) return null;
    if (!audioRef.current) return null;

    const AudioContextCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextCtor) return null;

    const ctx = new AudioContextCtor();
    const source = ctx.createMediaElementSource(audioRef.current);
    const node = ctx.createAnalyser();
    node.fftSize = AMBIENT_FFT_SIZE;
    node.smoothingTimeConstant = 0.5;
    node.minDecibels = -90;
    node.maxDecibels = -10;
    source.connect(node);
    node.connect(ctx.destination);
    ctxRef.current = ctx;
    setAnalyser(node);
    return node;
  }, [analyser]);

  const persistPlaying = useCallback((next: boolean) => {
    try {
      localStorage.setItem(
        AMBIENT_STORAGE_KEY,
        serializeAmbientPreference(next),
      );
    } catch {
      // ignore storage errors
    }
  }, []);

  const startPlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    ensureAudioContext();
    if (ctxRef.current?.state === "suspended") {
      await ctxRef.current.resume();
    }
    try {
      await audio.play();
      setPlaying(true);
      persistPlaying(true);
    } catch {
      setPlaying(false);
      persistPlaying(false);
    }
  }, [ensureAudioContext, persistPlaying]);

  const stopPlayback = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
    persistPlaying(false);
  }, [persistPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !playing) return;
    fadeTo(audio, ambientTargetVolume(chatOpen), AMBIENT_FADE_MS);
  }, [chatOpen, playing]);

  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(AMBIENT_SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen || playing) return;

    const showTimer = window.setTimeout(() => {
      if (
        interactedRef.current ||
        chatOpenRef.current ||
        window.innerWidth < 640
      ) {
        return;
      }
      setAutoShow(true);
      setIncoming(true);
    }, AMBIENT_AUTO_SHOW_DELAY_MS);

    const farewellTimer = window.setTimeout(() => {
      if (interactedRef.current || playingRef.current) return;
      setDismissed(true);
    }, AMBIENT_AUTO_SHOW_DELAY_MS + 6000);

    const dismissTimer = window.setTimeout(() => {
      setAutoShow(false);
      setIncoming(false);
      setDismissed(false);
      try {
        localStorage.setItem(AMBIENT_SEEN_KEY, "1");
      } catch {
        // ignore
      }
    }, AMBIENT_AUTO_SHOW_DELAY_MS + 9000);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(farewellTimer);
      window.clearTimeout(dismissTimer);
    };
  }, [playing]);

  const toggle = useCallback(() => {
    interactedRef.current = true;
    setHovered(false);
    setAutoShow(false);
    setIncoming(false);
    try {
      localStorage.setItem(AMBIENT_SEEN_KEY, "1");
    } catch {
      // ignore
    }
    if (playing) stopPlayback();
    else void startPlayback();
  }, [playing, startPlayback, stopPlayback]);

  if (chatOpen && touchFullscreen) return null;

  const showTooltip = !chatOpen && (hovered || autoShow);
  const showIncoming = !chatOpen && incoming;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onClick={toggle}
      onMouseEnter={() => {
        if (window.matchMedia("(hover: hover)").matches) {
          setHovered(true);
          interactedRef.current = true;
        }
      }}
      onMouseLeave={() => {
        if (window.matchMedia("(hover: hover)").matches) setHovered(false);
      }}
      className={`fixed z-50 flex h-10 w-10 items-center justify-center rounded-full bg-bg-elevated/95 shadow-md backdrop-blur-md transition-shadow hover:shadow-lg ${
        showIncoming ? "border-2 border-accent" : "border border-line"
      }`}
      style={{
        bottom: "max(1.5rem, env(safe-area-inset-bottom, 0px) + 0.5rem)",
        left: "max(1.5rem, env(safe-area-inset-left, 0px) + 0.5rem)",
      }}
      aria-label={playing ? "Mute ambient music" : "Play ambient music"}
    >
      <AnimatePresence mode="wait">
        {playing && analyser ? (
          <motion.div
            key="on"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <EqualizerBars analyser={analyser} />
          </motion.div>
        ) : (
          <motion.div
            key="off"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <MutedBars />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showTooltip ? (
          <CommTooltip playing={playing} dismissed={dismissed} />
        ) : null}
      </AnimatePresence>
      {showIncoming ? (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-accent"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 0, 0.7],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ) : null}
    </motion.button>
  );
}
