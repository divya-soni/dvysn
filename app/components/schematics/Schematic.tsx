"use client";

import Clive from "./Clive";
import MemGPT from "./MemGPT";
import Mira from "./Mira";
import PngToPsd from "./PngToPsd";
import PromptVersioning from "./PromptVersioning";
import Tally from "./Tally";
import ToolCalling from "./ToolCalling";

const toys: Record<string, () => React.JSX.Element> = {
  "prompt-versioning": PromptVersioning,
  "memgpt-prototype": MemGPT,
  "tool-calling": ToolCalling,
  "tally-expense-tracker": Tally,
  mira: Mira,
  clive: Clive,
  "png-to-psd": PngToPsd,
};

/** The playable drawing for a project. */
export default function Schematic({ slug }: { slug: string }) {
  const Toy = toys[slug];
  return Toy ? <Toy /> : null;
}
