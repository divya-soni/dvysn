"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import Ink, { MarkPaths } from "../ink/Ink";
import { drawMemgpt, MEM, memMarks, slot } from "@/lib/ink/schematics/memgpt";
import { sound } from "@/lib/sound";
import { useInk } from "./useInk";

const SAMPLES = [
  "remember: blue door",
  "call mom at six",
  "book a table for two",
  "where did I park?",
  "add milk to the list",
  "the wifi is on the fridge",
  "what did I say first?",
];
const SEED = ["hi there", "my name is Divya", "I live in Hyderabad", "I like chai"];

type Msg = { id: number; text: string };

function chip(text: string) {
  return text.length > 13 ? `${text.slice(0, 12)}…` : text;
}

export default function MemGPT() {
  const drawing = useMemo(() => drawMemgpt(3), []);
  const ref = useRef<SVGSVGElement>(null);
  useInk(ref);

  const [msgs, setMsgs] = useState<Msg[]>(() => SEED.map((text, id) => ({ id, text })));
  const [draft, setDraft] = useState("");
  const [log, setLog] = useState("4 MESSAGES IN CONTEXT");
  const nextId = useRef(SEED.length);
  const sample = useRef(0);

  const n = msgs.length;
  const ctxStart = Math.max(0, n - MEM.ctx.cap);
  const recallStart = Math.max(0, ctxStart - MEM.recall.cap);

  const send = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim() || SAMPLES[sample.current++ % SAMPLES.length];
    setDraft("");
    setMsgs((m) => [...m, { id: nextId.current++, text }]);
    const total = n + 1;
    sound.type(Math.min(text.length, 6));
    if (total > MEM.ctx.cap + MEM.recall.cap) sound.thud();
    else if (total > MEM.ctx.cap) sound.whoosh();
    if (total > MEM.ctx.cap + MEM.recall.cap) setLog(`SUMMARISED “${chip(msgs[recallStart].text)}” INTO THE ARCHIVE`);
    else if (total > MEM.ctx.cap) setLog(`EVICTED “${chip(msgs[ctxStart].text)}” TO RECALL`);
    else setLog(`${total} MESSAGES IN CONTEXT`);
  };

  const placed = msgs.map((m, i) => {
    if (i >= ctxStart) return { m, tier: "ctx" as const, at: slot("ctx", i - ctxStart) };
    if (i >= recallStart) return { m, tier: "recall" as const, at: slot("recall", i - recallStart) };
    return { m, tier: "archive" as const, at: slot("archive", (recallStart - 1 - i) % MEM.archive.cap) };
  });
  const archived = recallStart;

  return (
    <figure className="schematic">
      <Ink
        ref={ref}
        drawing={drawing}
        layerStyle={{ spin: { transformOrigin: `${MEM.cx}px ${MEM.cy}px` } }}
        label={`MemGPT model: ${n - ctxStart} messages in active context, ${ctxStart - recallStart} in recall, ${archived} summarised in the archive.`}
      >
        <text x={MEM.cx} y={MEM.cy + 36} textAnchor="middle" className="tiny">
          LLM
        </text>
        {(
          [
            ["CONTEXT", MEM.ctx.r],
            ["RECALL", MEM.recall.r],
            ["ARCHIVE", MEM.archive.r],
          ] as const
        ).map(([name, r]) => (
          <g key={name}>
            <rect x={MEM.cx - r - 30} y={MEM.cy - 7} width={60} height={13} className="paper" />
            <text x={MEM.cx - r} y={MEM.cy + 3} textAnchor="middle" className="tiny">
              {name}
            </text>
          </g>
        ))}
        {placed.map(({ m, tier, at }) => (
          <g key={m.id} className="mem-item" style={{ transform: `translate(${at[0]}px, ${at[1]}px)` }}>
            {tier === "ctx" ? (
              <>
                <rect x={-chip(m.text).length * 3.2 - 6} y={-9} width={chip(m.text).length * 6.4 + 12} height={17} className="paper" />
                <text x={0} y={3.5} textAnchor="middle" className="hi">
                  {chip(m.text)}
                </text>
              </>
            ) : (
              <MarkPaths marks={(tier === "recall" ? memMarks.recall : memMarks.archive).frames[0]} />
            )}
          </g>
        ))}
        <text x={12} y={390} className="hi" aria-live="polite">
          LOG · {log}
        </text>
        <text x={12} y={408}>
          CTX {n - ctxStart}/{MEM.ctx.cap} · RECALL {ctxStart - recallStart} · ARCHIVE {archived}
        </text>
      </Ink>
      <form className="toy-form" onSubmit={send}>
        <label htmlFor="mem-input" className="sr-only">
          Message
        </label>
        <input
          id="mem-input"
          className="toy-input"
          value={draft}
          maxLength={40}
          placeholder="Type a message, or just press Send"
          onChange={(e) => setDraft(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" className="toy-btn">
          Send
        </button>
      </form>
      <figcaption className="toy-hint">Context holds six messages. Older ones move to recall, then get summarised into the archive.</figcaption>
    </figure>
  );
}
