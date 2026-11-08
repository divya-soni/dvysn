"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import Ink from "../ink/Ink";
import { drawTally, TALLY } from "@/lib/ink/schematics/tally";
import { useInk } from "./useInk";

type Row = { id: number; amt: number; cat: string; note: string };

const CATEGORIES: [RegExp, string][] = [
  [/chai|coffee|tea|lunch|dinner|breakfast|food|swiggy|zomato|snack/i, "FOOD"],
  [/uber|ola|auto|metro|cab|bus|fuel|petrol|train/i, "TRANSPORT"],
  [/grocer|veg|milk|market|fruit/i, "GROCERIES"],
  [/electric|bill|wifi|internet|phone|recharge|gas/i, "BILLS"],
  [/rent/i, "RENT"],
  [/movie|netflix|book|game|concert/i, "FUN"],
  [/doctor|medicine|pharmacy|gym/i, "HEALTH"],
];

function parse(text: string): Omit<Row, "id"> | null {
  const m = text.match(/(\d[\d,]*(?:\.\d+)?)/);
  if (!m) return null;
  const amt = Math.round(Number(m[1].replace(/,/g, "")));
  const cat = CATEGORIES.find(([re]) => re.test(text))?.[1] ?? "OTHER";
  const note =
    text
      .replace(m[1], "")
      .replace(/\b(rs|rupees|inr|spent|paid|on|for|in|at|the|a)\b|₹/gi, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 11) || "—";
  return { amt, cat, note };
}

function lines(text: string, width = 26) {
  const out: string[] = [];
  let cur = "";
  for (const w of text.split(/\s+/)) {
    if ((cur + " " + w).trim().length > width && cur) {
      out.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) out.push(cur);
  return out.slice(0, 2);
}

export default function Tally() {
  const drawing = useMemo(() => drawTally(3), []);
  const ref = useRef<SVGSVGElement>(null);
  useInk(ref);

  const [rows, setRows] = useState<Row[]>([
    { id: 1, amt: 500, cat: "GROCERIES", note: "veg market" },
    { id: 0, amt: 1200, cat: "BILLS", note: "electricity" },
  ]);
  const [message, setMessage] = useState("500 on veg market");
  const [reply, setReply] = useState("LOGGED UNDER GROCERIES");
  const [collapsing, setCollapsing] = useState(false);
  const [draft, setDraft] = useState("250 on chai");
  const nextId = useRef(2);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessage(text);
    setDraft("");
    const row = parse(text);
    if (!row) {
      setReply("NO AMOUNT FOUND. TRY “250 ON CHAI”.");
      return;
    }
    setCollapsing(true);
    window.setTimeout(() => {
      setRows((r) => [{ ...row, id: nextId.current++ }, ...r].slice(0, TALLY.rows));
      setReply(`LOGGED UNDER ${row.cat}`);
      setCollapsing(false);
    }, 420);
  };

  const total = rows.reduce((s, r) => s + r.amt, 0);
  const { bubble, sheet, cols, rowY } = TALLY;

  return (
    <figure className="schematic">
      <Ink
        ref={ref}
        drawing={drawing}
        layerStyle={{ wave: { transform: collapsing ? "scaleY(0.05)" : "scaleY(1)" } }}
        label={`Tally model. Last message: ${message}. The sheet has ${rows.length} rows totalling ${total}.`}
      >
        {lines(message).map((l, i) => (
          <text key={i} x={bubble.x + 14} y={bubble.y + 26 + i * 18} className="bubble-text">
            {l}
          </text>
        ))}
        <text x={bubble.x} y={TALLY.wave.y + 56} className="tiny" aria-live="polite">
          {reply}
        </text>
        <text x={cols[0]} y={80}>AMT</text>
        <text x={cols[1]} y={80}>CATEGORY</text>
        <text x={cols[2]} y={80}>NOTE</text>
        {rows.map((r, k) => (
          <g key={r.id}>
            {k === 0 ? <circle cx={sheet.x - 9} cy={rowY(k) + 1} r={3} className="amber-dot" /> : null}
            <text x={cols[0]} y={rowY(k) + 5} className="hi">
              {r.amt.toLocaleString("en-IN")}
            </text>
            <text x={cols[1]} y={rowY(k) + 5} className="tiny">
              {r.cat}
            </text>
            <text x={cols[2]} y={rowY(k) + 5} className="tiny">
              {r.note}
            </text>
          </g>
        ))}
        <text x={cols[0]} y={sheet.y + sheet.h - 14} className="hi">
          TOTAL {total.toLocaleString("en-IN")}
        </text>
      </Ink>
      <form className="toy-form" onSubmit={submit}>
        <label htmlFor="tally-input" className="sr-only">
          Say what you spent
        </label>
        <input
          id="tally-input"
          className="toy-input"
          value={draft}
          maxLength={40}
          placeholder="120 on an auto"
          onChange={(e) => setDraft(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" className="toy-btn">
          Log it
        </button>
      </form>
      <figcaption className="toy-hint">Type it the way you would say it. The sentence becomes one row in the sheet.</figcaption>
    </figure>
  );
}
