import Link from "next/link";
import { HeroVisual } from "@/components/hero-visual";
import { STEPS, TOOLS } from "@/lib/product";

export default function DashboardPage() {
  return (
    <div className="grid gap-8">
      <section className="reveal glass relative overflow-hidden rounded-3xl p-6 md:grid md:grid-cols-[1.15fr_0.85fr] md:items-center md:gap-10 md:p-8">
        <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-[var(--accent)]/15 blur-3xl" />
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Workspace</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Know the blast radius before you <span className="glow-text">shift</span>.
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-7 text-[var(--muted)]">
            Upgrade paths, integration docs, and library alternatives — with a score, copyable
            commands, and links you can inspect later.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/upgrade"
              className="shine inline-flex h-11 items-center rounded-lg bg-[var(--accent)] px-5 text-sm font-medium text-[#1a1308]"
            >
              Start an upgrade scan
            </Link>
            <Link
              href="/history"
              className="inline-flex h-11 items-center rounded-lg border border-[var(--line)] px-5 text-sm hover:border-[var(--accent)]"
            >
              View history
            </Link>
          </div>
        </div>
        <div className="mt-8 md:mt-0">
          <HeroVisual />
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="lift glass group flex flex-col rounded-2xl p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">{tool.type}</p>
              <p className="rounded-full border border-[var(--line)] px-2 py-0.5 text-[11px] text-[var(--muted)]">
                {tool.sample}
              </p>
            </div>
            <h2 className="mt-4 text-lg font-semibold">{tool.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-[var(--muted)]">{tool.body}</p>
            <p className="mt-4 font-mono text-[11px] text-[var(--faint)]">{tool.cue}</p>
            <span className="mt-4 text-sm text-[var(--accent)]">Open →</span>
          </Link>
        ))}
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {STEPS.map((step) => (
          <div key={step.n} className="glass rounded-2xl p-5">
            <p className="text-xs tracking-[0.2em] text-[var(--accent)]">{step.n}</p>
            <h3 className="mt-3 font-medium">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{step.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
