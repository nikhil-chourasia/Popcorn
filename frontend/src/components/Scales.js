"use client";

// Scales — diagonal, horizontal, or vertical repeating line pattern background
// Drop it anywhere as: <Scales /> or <Scales orientation="horizontal" size={14} />
export default function Scales({
  orientation = "diagonal",
  size = 12,
  color = "rgba(255,255,255,0.045)",
  style = {},
  className = "",
}) {
  const s = size;
  const c = encodeURIComponent(color);

  const patterns = {
    diagonal: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${s}' height='${s}'%3E%3Cpath d='M0 ${s} L${s} 0' stroke='${c}' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
    horizontal: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${s}' height='${s}'%3E%3Cline x1='0' y1='${s}' x2='${s}' y2='${s}' stroke='${c}' stroke-width='1'/%3E%3C/svg%3E")`,
    vertical: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${s}' height='${s}'%3E%3Cline x1='${s}' y1='0' x2='${s}' y2='${s}' stroke='${c}' stroke-width='1'/%3E%3C/svg%3E")`,
  };

  return (
    <div
      className={className}
      style={{
        backgroundImage: patterns[orientation] ?? patterns.diagonal,
        backgroundRepeat: "repeat",
        backgroundSize: `${s}px ${s}px`,
        ...style,
      }}
    />
  );
}
