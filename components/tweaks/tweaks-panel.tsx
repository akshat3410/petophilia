"use client";

import { useTweaks } from "@/lib/tweaks-context";
import { X, Settings2 } from "lucide-react";
import type { TweakState } from "@/lib/types";
import { cn } from "@/lib/utils";

const MOODS: Array<{ id: TweakState["mood"]; label: string; swatch: string }> = [
  { id: "sage", label: "Sage", swatch: "#CFE3D8" },
  { id: "dusk", label: "Dusk", swatch: "#E8D5C9" },
  { id: "mineral", label: "Mineral", swatch: "#DED9D1" },
  { id: "honey", label: "Honey", swatch: "#ECD9B3" },
];

const DENSITIES: Array<{ id: TweakState["density"]; label: string }> = [
  { id: "cozy", label: "Cozy" },
  { id: "default", label: "Default" },
  { id: "roomy", label: "Roomy" },
];

const HEROES: Array<{ id: TweakState["hero"]; label: string }> = [
  { id: "asymmetric", label: "Asymmetric" },
  { id: "centered", label: "Centered" },
];

const VIEWPORTS: Array<{ id: TweakState["viewport"]; label: string }> = [
  { id: "desktop", label: "Desktop" },
  { id: "mobile", label: "Mobile" },
];

export function TweaksPanel() {
  const { tweaks, setTweak, panelVisible, setPanelVisible, togglePanel } = useTweaks();

  return (
    <>
      {/* Floating toggle handle */}
      <button
        onClick={togglePanel}
        aria-label="Toggle tweaks"
        className={cn(
          "fixed bottom-6 left-6 z-40 flex h-11 items-center gap-2 rounded-full bg-accent px-4 text-white shadow-soft-lg transition-all duration-200 hover:-translate-y-0.5",
          panelVisible && "opacity-0 pointer-events-none",
        )}
      >
        <Settings2 size={14} strokeWidth={2} />
        <span className="font-mono text-[11px] uppercase tracking-[0.18em]">Tweaks</span>
      </button>

      {/* Panel */}
      <aside
        className={cn(
          "fixed bottom-6 left-6 z-40 w-[300px] rounded-2xl border border-accent/20 bg-white shadow-soft-lg backdrop-blur-lg transition-all duration-200",
          panelVisible ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="text-[12px] font-black uppercase tracking-[0.14em] text-accent">/design knobs</p>
            <h3 className="mt-1 text-[18px] font-black leading-none text-primary">Tweaks</h3>
          </div>
          <button
            onClick={() => setPanelVisible(false)}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full text-primary transition-colors hover:bg-border/30"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          <Group label="Mood">
            <div className="grid grid-cols-4 gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setTweak("mood", m.id)}
                  className={cn(
                    "group flex flex-col items-center gap-1.5 rounded-sm p-1.5 transition-colors",
                    tweaks.mood === m.id ? "bg-border/30" : "hover:bg-primary/[0.03]",
                  )}
                >
                  <span
                    className={cn(
                      "h-7 w-full rounded-[6px] border transition-transform",
                      tweaks.mood === m.id ? "border-accent scale-100" : "border-border",
                    )}
                    style={{ background: m.swatch }}
                  />
                  <span className="text-[11px] font-semibold text-primary">{m.label}</span>
                </button>
              ))}
            </div>
          </Group>

          <Group label="Density">
            <SegmentedRow
              options={DENSITIES}
              value={tweaks.density}
              onChange={(v) => setTweak("density", v)}
            />
          </Group>

          <Group label="Hero">
            <SegmentedRow
              options={HEROES}
              value={tweaks.hero}
              onChange={(v) => setTweak("hero", v)}
            />
          </Group>

          <Group label="Viewport">
            <SegmentedRow
              options={VIEWPORTS}
              value={tweaks.viewport}
              onChange={(v) => setTweak("viewport", v)}
            />
          </Group>
        </div>
      </aside>
    </>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mono-label mb-2.5">/{label.toLowerCase()}</p>
      {children}
    </div>
  );
}

function SegmentedRow<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Array<{ id: T; label: string }>;
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-full bg-border/30 p-1">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "rounded-full py-1.5 text-[12px] font-medium transition-colors",
            value === o.id ? "bg-accent text-white" : "text-primary hover:bg-accent/10",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
