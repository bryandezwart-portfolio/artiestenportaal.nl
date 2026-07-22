import { formatEUR } from "@/lib/format";

type Point = { label: string; gross: number; label_amount: number };

export default function IncomeChart({ points }: { points: Point[] }) {
  const max = Math.max(1, ...points.map((p) => p.gross));
  const width = 700;
  const height = 200;
  const barGap = 8;
  const barWidth = (width - barGap * (points.length - 1)) / points.length;

  return (
    <svg viewBox={`0 0 ${width} ${height + 24}`} className="w-full h-auto">
      {points.map((p, i) => {
        const barHeight = (p.gross / max) * height;
        const x = i * (barWidth + barGap);
        const y = height - barHeight;
        return (
          <g key={p.label}>
            <title>
              {p.label}: {formatEUR(p.gross)}
            </title>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={Math.max(barHeight, 1)}
              rx={3}
              className="fill-accent/80 hover:fill-accent transition-colors"
            />
            <text
              x={x + barWidth / 2}
              y={height + 16}
              textAnchor="middle"
              className="fill-current text-muted"
              style={{ fontSize: "9px" }}
            >
              {p.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
