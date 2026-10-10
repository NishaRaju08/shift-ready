import { Badge, Card } from "@/components/ui";
import { CommandKit } from "@/components/kit";
import { ShiftScoreCard } from "@/components/shift-score";
import type { SearchResult, SourceKind } from "@/lib/types";

const PRICING: Record<string, string> = {
  free: "Free / OSS",
  paid: "Paid",
  freemium: "Freemium",
  unknown: "Unknown",
};

const KIND: Record<SourceKind, string> = {
  github: "GitHub",
  npm: "npm",
  docs: "Docs",
  article: "Article",
};

export function ResultView({ result }: { result: SearchResult }) {
  const alternatives = result.alternatives ?? [];
  const sources = result.sources ?? [];
  const commands = result.commands ?? [];

  return (
    <div className="grid gap-6">
      {result.score ? <ShiftScoreCard score={result.score} /> : null}
      {commands.length > 0 ? <CommandKit commands={commands} /> : null}

      <Card className="p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">References to open</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight">{result.title}</h2>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{result.summary}</p>
      </Card>

      {alternatives.length > 0 ? (
        <section className="grid gap-3">
          <h3 className="text-sm font-medium text-[var(--muted)]">Libraries</h3>
          <div className="grid gap-3">
            {alternatives.map((item) => (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="lift rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{item.name}</p>
                  <Badge>{KIND[item.kind ?? "article"]}</Badge>
                  <Badge>{PRICING[item.pricing]}</Badge>
                </div>
                <p className="mt-2 break-all text-xs text-[var(--accent)]">{item.url}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {sources.length > 0 ? (
        <section className="grid gap-3">
          <h3 className="text-sm font-medium text-[var(--muted)]">Exact links</h3>
          <div className="grid gap-2">
            {sources.map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="lift rounded-xl border border-[var(--line)] px-4 py-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">{source.title}</p>
                  <Badge>{KIND[source.kind ?? "article"]}</Badge>
                </div>
                <p className="mt-1 break-all text-xs text-[var(--accent)]">{source.url}</p>
                <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{source.snippet}</p>
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
