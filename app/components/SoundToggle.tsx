"use client";

import { useSyncExternalStore } from "react";
import { MarkPaths } from "./ink/Ink";
import { sketch } from "@/lib/ink/sketch";
import { isMuted, setMuted, sound, subscribeSound } from "@/lib/sound";

const speaker = sketch(
  28,
  28,
  (p) =>
    p.poly(
      [
        [4, 11],
        [9, 11],
        [15, 6],
        [15, 22],
        [9, 17],
        [4, 17],
      ],
      { width: 1.3, roughness: 0.7 },
    ),
  { seed: 21, frames: 1 },
);

const waves = sketch(
  28,
  28,
  (p) => {
    p.arc(15, 14, 9, 11, -1, 1, { width: 1.1, roughness: 0.5, single: true });
    p.arc(15, 14, 18, 20, -0.9, 0.9, { width: 1.1, roughness: 0.5, single: true });
  },
  { seed: 22, frames: 1 },
);

const cross = sketch(
  28,
  28,
  (p) => {
    p.line(19, 10, 26, 18, { width: 1.2, roughness: 0.5, single: true });
    p.line(26, 10, 19, 18, { width: 1.2, roughness: 0.5, single: true });
  },
  { seed: 23, frames: 1 },
);

/** Mutes or unmutes every sound on the site; the choice is remembered. */
export default function SoundToggle() {
  const muted = useSyncExternalStore(subscribeSound, isMuted, () => false);
  const label = muted ? "Unmute sounds" : "Mute sounds";

  return (
    <button
      type="button"
      className="sound-toggle"
      data-muted={muted ? "1" : "0"}
      aria-label={label}
      title={label}
      onClick={() => {
        setMuted(!muted);
        if (muted) sound.tick();
      }}
    >
      <svg viewBox="0 0 28 28" aria-hidden="true">
        <MarkPaths marks={speaker.frames[0]} />
        <MarkPaths marks={(muted ? cross : waves).frames[0]} />
      </svg>
    </button>
  );
}
