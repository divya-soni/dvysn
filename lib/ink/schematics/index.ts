import type { Drawing } from "../sketch";
import { drawClive } from "./clive";
import { drawMemgpt } from "./memgpt";
import { drawMira } from "./mira";
import { drawPngToPsd } from "./pngToPsd";
import { drawPromptVersioning, PV } from "./promptVersioning";
import { drawTally } from "./tally";
import { drawToolCalling } from "./toolCalling";

/** Still versions of each project's drawing, for the index. */
export const thumbs: Record<string, () => Drawing> = {
  "prompt-versioning": () => drawPromptVersioning(1, PV.initial),
  "memgpt-prototype": () => drawMemgpt(1),
  "tool-calling": () => drawToolCalling(1, 2),
  "tally-expense-tracker": () => drawTally(1),
  mira: () => drawMira(1),
  clive: () => drawClive(1),
  "png-to-psd": () => drawPngToPsd(1),
};

export const descriptions: Record<string, string> = {
  "prompt-versioning": "Seven rings for seven saved versions, with a production pointer aimed at one of them.",
  "memgpt-prototype": "Three rings: active context in the middle, recall storage around it, archived summaries outside.",
  "tool-calling": "A model's text stream emitting a command token, and the folder tree it changes.",
  "tally-expense-tracker": "A spoken message, its waveform, and the expense sheet row it becomes.",
  mira: "An open textbook with a lens over a diagram, revealing notes.",
  clive: "A video with a timeline; everything after the playhead is hatched over.",
  "png-to-psd": "One picture split into four stacked layers.",
};
