"use client";

import { useEffect, useState } from "react";

export function HeroVisual() {
  const [score, setScore] = useState(12);

  useEffect(() => {
    const start = performance.now();
    const from = 12;
    const to = 74;
    let frame = 0;
    function tick(now: number) {
      const t = Math.min(1, (now - start) / 1200);
      const eased = 1 - (1 - t) ** 3;
      setScore(Math.round(from + (to - from) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="glass lift relative overflow-hidden rounded-3xl p-6">
      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[var(--accent)]/20 blur-2xl" />
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Live shift</p>
      <div className="mt-5 flex items-center gap-5">
        <div
          className="score-fill grid h-24 w-24 place-items-center rounded-full text-2xl font-semibold"
          style={{
            background: `conic-gradient(#e8a04a ${score * 3.6}deg, #2a261f 0deg)`,
          }}
        >
          <span className="grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full bg-[#12100c]">
            {score}
          </span>
        </div>
        <div>
          <p className="text-xl font-semibold">Plan a weekend</p>
          <p className="mt-1 text-sm text-[var(--muted)]">Next 14.2 → 15.5 · one major bump</p>
        </div>
      </div>
      <div className="mt-6 grid gap-2 font-mono text-[12px] text-[var(--muted)]">
        <p className="rounded-lg bg-[var(--surface)] px-3 py-2">npm install next@15.5.0</p>
        <p className="rounded-lg bg-[var(--surface)] px-3 py-2">npx @next/codemod upgrade 15</p>
      </div>
    </div>
  );
}
