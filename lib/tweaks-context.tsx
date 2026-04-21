"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { TweakState } from "@/lib/types";

/* Tweakable design preferences — shown when the "Tweaks" toggle is on.
   The marker block is kept for parity with the prototype; it's inert here
   but allows tooling to auto-rewrite defaults if you later re-introduce it. */
export const TWEAK_DEFAULTS: TweakState = /*EDITMODE-BEGIN*/ {
  mood: "sage",
  density: "default",
  hero: "asymmetric",
  viewport: "desktop",
} /*EDITMODE-END*/;

interface TweaksContextValue {
  tweaks: TweakState;
  setTweak: <K extends keyof TweakState>(key: K, value: TweakState[K]) => void;
  panelVisible: boolean;
  setPanelVisible: (v: boolean) => void;
  togglePanel: () => void;
}

const TweaksContext = createContext<TweaksContextValue | null>(null);

const STORAGE_KEY = "peto-tweaks";

export function TweaksProvider({ children }: { children: ReactNode }) {
  const [tweaks, setTweaks] = useState<TweakState>(TWEAK_DEFAULTS);
  const [panelVisible, setPanelVisible] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTweaks({ ...TWEAK_DEFAULTS, ...JSON.parse(raw) });
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Reflect tweaks on <body> data-* attributes so CSS-variable overrides
  // (set in globals.css) apply instantly everywhere.
  useEffect(() => {
    document.body.dataset.mood = tweaks.mood;
    document.body.dataset.density = tweaks.density;
    if (hydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tweaks));
      } catch {
        // ignore
      }
    }
  }, [tweaks, hydrated]);

  const setTweak = useCallback(<K extends keyof TweakState>(key: K, value: TweakState[K]) => {
    setTweaks((prev) => ({ ...prev, [key]: value }));
  }, []);

  const togglePanel = useCallback(() => setPanelVisible((v) => !v), []);

  const value = useMemo<TweaksContextValue>(
    () => ({ tweaks, setTweak, panelVisible, setPanelVisible, togglePanel }),
    [tweaks, setTweak, panelVisible, togglePanel],
  );

  return <TweaksContext.Provider value={value}>{children}</TweaksContext.Provider>;
}

export function useTweaks() {
  const ctx = useContext(TweaksContext);
  if (!ctx) throw new Error("useTweaks must be used inside <TweaksProvider>");
  return ctx;
}
