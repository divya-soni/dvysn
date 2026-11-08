import type { CSSProperties, ReactNode, SVGProps } from "react";
import type { Drawing, Mark } from "@/lib/ink/sketch";

type LayerStyles = Record<string, CSSProperties | undefined>;

export function MarkPaths({ marks }: { marks: Mark[] }) {
  return marks.map((m, i) => (
    <path
      key={i}
      d={m.d}
      className={`t-${m.tone}`}
      fill={m.fill ? "currentColor" : "none"}
      stroke={m.w ? "currentColor" : "none"}
      strokeWidth={m.w || undefined}
      strokeDasharray={m.dash}
    />
  ));
}

function byLayer(marks: Mark[]) {
  const order: string[] = [];
  const groups = new Map<string, Mark[]>();
  for (const m of marks) {
    const key = m.layer ?? "";
    if (!groups.has(key)) {
      groups.set(key, []);
      order.push(key);
    }
    groups.get(key)!.push(m);
  }
  return order.map((key) => [key, groups.get(key)!] as const);
}

/** The frames of a drawing as <g> groups, for use inside another SVG. */
export function InkFrames({ drawing, layerStyle }: { drawing: Drawing; layerStyle?: LayerStyles }) {
  return drawing.frames.map((marks, f) => (
    <g key={f} className={`frame f${f}`}>
      {byLayer(marks).map(([layer, ms]) =>
        layer ? (
          <g key={layer} className={`layer ${layer}`} style={layerStyle?.[layer]}>
            <MarkPaths marks={ms} />
          </g>
        ) : (
          <MarkPaths key="_" marks={ms} />
        ),
      )}
    </g>
  ));
}

type InkProps = {
  drawing: Drawing;
  layerStyle?: LayerStyles;
  label?: string;
  children?: ReactNode;
} & Omit<SVGProps<SVGSVGElement>, "children" | "viewBox">;

/** Renders a drawing. Works in server and client components. */
export default function Ink({ drawing, layerStyle, label, children, className, ...rest }: InkProps) {
  return (
    <svg
      viewBox={`0 0 ${drawing.w} ${drawing.h}`}
      className={`ink-svg${className ? ` ${className}` : ""}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...rest}
    >
      <InkFrames drawing={drawing} layerStyle={layerStyle} />
      {children}
    </svg>
  );
}
