"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import Ink from "../ink/Ink";
import { drawToolCalling, TC } from "@/lib/ink/schematics/toolCalling";
import { useInk } from "./useInk";

type Result = { folders: string[]; token: string; reply: string; touched: string | null };

const NAME = `["“”']?([\\w.-]{1,16})["“”']?`;

/** A tiny, deterministic stand-in for the model: text in, command token out. */
function run(input: string, folders: string[], last: string | null): Result {
  const text = input.trim();
  const resolve = (name: string) => (/^(it|that)$/i.test(name) && last ? last : name);

  let m = text.match(new RegExp(`(?:make|create|new|add)\\b.*?\\b(?:folder|directory|dir)\\b(?:\\s+(?:called|named))?\\s+${NAME}`, "i"));
  if (m) {
    const name = m[1];
    if (folders.includes(name)) return { folders, token: "‹reply›", reply: `“${name}” already exists.`, touched: name };
    if (folders.length >= TC.slots) return { folders, token: "‹reply›", reply: "The tree is full. Delete a folder first.", touched: last };
    return { folders: [...folders, name], token: `‹mkdir ${name}›`, reply: `Made “${name}”.`, touched: name };
  }
  m = text.match(new RegExp(`(?:rename|move)\\s+${NAME}\\s+to\\s+${NAME}`, "i"));
  if (m) {
    const from = resolve(m[1]);
    const to = m[2];
    if (!folders.includes(from)) return { folders, token: "‹reply›", reply: `I can't find “${from}”.`, touched: last };
    return { folders: folders.map((f) => (f === from ? to : f)), token: `‹mv ${from} ${to}›`, reply: `Renamed it to “${to}”.`, touched: to };
  }
  m = text.match(new RegExp(`(?:delete|remove|rm)\\s+(?:the\\s+)?(?:folder\\s+)?${NAME}`, "i"));
  if (m) {
    const name = resolve(m[1]);
    if (!folders.includes(name)) return { folders, token: "‹reply›", reply: `I can't find “${name}”.`, touched: last };
    return { folders: folders.filter((f) => f !== name), token: `‹rm ${name}›`, reply: `Deleted “${name}”.`, touched: null };
  }
  if (/\b(list|ls|show)\b/i.test(text)) {
    return { folders, token: "‹ls›", reply: folders.length ? folders.join(", ") : "Nothing here yet.", touched: last };
  }
  return { folders, token: "‹reply›", reply: "I can only make, rename or delete folders.", touched: last };
}

export default function ToolCalling() {
  const drawing = useMemo(() => drawToolCalling(3), []);
  const ref = useRef<SVGSVGElement>(null);
  useInk(ref);

  const [state, setState] = useState<Result>({
    folders: ["essays", "experiments"],
    token: "‹mkdir experiments›",
    reply: "Made “experiments”.",
    touched: "experiments",
  });
  const [draft, setDraft] = useState("make a folder called notes");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setState((s) => run(draft, s.folders, s.touched));
    setDraft("");
  };

  const layerStyle = Object.fromEntries(
    Array.from({ length: TC.slots }, (_, k) => [`slot-${k}`, { opacity: k < state.folders.length ? 1 : 0 }]),
  );

  return (
    <figure className="schematic">
      <Ink
        ref={ref}
        drawing={drawing}
        layerStyle={layerStyle}
        label={`Tool calling model. The model emitted ${state.token}. Folders: ${state.folders.join(", ") || "none"}.`}
      >
        <text x={28} y={60}>MODEL OUTPUT</text>
        <text x={TC.root.x} y={60}>FILES</text>
        <text x={TC.token.x + 12} y={TC.token.y + 21.5} className="hi" aria-live="polite">
          {state.token}
        </text>
        <text x={28} y={250} className="tiny">
          {state.reply.toUpperCase()}
        </text>
        <text x={TC.root.x + 32} y={TC.root.y + 15} className="hi">
          ~/projects
        </text>
        {state.folders.map((f, k) => (
          <text key={`${k}-${f}`} x={TC.trunkX + 54} y={TC.slotY(k) + 4} className={f === state.touched ? "amber-text" : "hi"}>
            {f}
          </text>
        ))}
      </Ink>
      <form className="toy-form" onSubmit={submit}>
        <label htmlFor="tc-input" className="sr-only">
          Ask for a folder change
        </label>
        <input
          id="tc-input"
          className="toy-input"
          value={draft}
          maxLength={48}
          placeholder="make a folder called ideas"
          onChange={(e) => setDraft(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" className="toy-btn">
          Run
        </button>
      </form>
      <figcaption className="toy-hint">
        Try “rename it to drafts” or “delete it”. The model only writes a token; the app does the work.
      </figcaption>
    </figure>
  );
}
