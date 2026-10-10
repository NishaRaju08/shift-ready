import type { ShiftScore } from "@/lib/types";

export function ShiftScoreCard({ score }: { score: ShiftScore }) {
  const tone = score.score >= 75 ? "#7dcea0" : score.score >= 45 ? "#e8a04a" : "#e38b7d";

  return (
    <div className="score-fill flex items-center gap-5 glass rounded-2xl p-5">
      <div
        className="grid h-20 w-20 shrink-0 place-items-center rounded-full text-2xl font-semibold"
        style={{
          background: `conic-gradient(${tone} ${score.score * 3.6}deg, #2a261f 0deg)`,
        }}
      >
        <span className="grid h-14 w-14 place-items-center rounded-full bg-[var(--panel)]">
          {score.score}
        </span>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Shift score</p>
        <p className="mt-1 text-lg font-semibold">{score.label}</p>
        <ul className="mt-2 grid gap-1 text-sm text-[var(--muted)]">
          {score.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
