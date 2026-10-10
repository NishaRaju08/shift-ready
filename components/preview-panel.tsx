import { Badge } from "@/components/ui";
import { PREVIEWS } from "@/lib/product";
import type { ProjectType } from "@/lib/types";

export function PreviewPanel({ type }: { type: ProjectType }) {
  const preview = PREVIEWS[type];

  return (
    <div className="glass relative overflow-hidden rounded-3xl p-6">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--accent)]/15 blur-2xl" />
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">What you get</p>
      <div className="mt-4 flex items-start gap-4">
        {preview.score ? (
          <div
            className="grid h-16 w-16 shrink-0 place-items-center rounded-full text-lg font-semibold"
            style={{
              background: `conic-gradient(#e8a04a ${preview.score * 3.6}deg, #2a261f 0deg)`,
            }}
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#12100c]">
              {preview.score}
            </span>
          </div>
        ) : null}
        <div>
          <p className="text-lg font-semibold">{preview.label}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Search to replace this sample with live SerpAPI references.
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-2">
        {preview.lines.map((line) => (
          <p key={line} className="rounded-lg bg-[var(--surface)] px-3 py-2 font-mono text-[12px] text-[var(--muted)]">
            {line}
          </p>
        ))}
      </div>
      <div className="mt-5 grid gap-2">
        {preview.links.map((link) => (
          <div
            key={link.name}
            className="flex items-center justify-between rounded-xl border border-[var(--line)] px-3 py-2.5"
          >
            <p className="truncate text-sm">{link.name}</p>
            <Badge>{link.kind}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
