"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { ResultView } from "@/components/result-view";
import { SaveProject } from "@/components/save-project";
import { Button, EmptyState, ErrorText } from "@/components/ui";
import type { ActionState, ProjectType, SearchPayload } from "@/lib/types";

export function useSearchAction() {
  const [payload, setPayload] = useState<SearchPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function run(action: () => Promise<ActionState>) {
    setPending(true);
    setError(null);
    const response = await action();
    setPending(false);
    if (!response.ok) {
      setError(response.error);
      setPayload(null);
      return;
    }
    setPayload(response.data);
  }

  return { payload, error, pending, run };
}

export function ToolShell({
  type,
  title,
  blurb,
  defaultName,
  pending,
  error,
  payload,
  onSubmit,
  children,
}: {
  type: ProjectType;
  title: string;
  blurb: string;
  defaultName: string;
  pending: boolean;
  error: string | null;
  payload: SearchPayload | null;
  onSubmit: () => Promise<void>;
  children: ReactNode;
}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSubmit();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <aside className="reveal grid h-fit gap-5">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{type}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{blurb}</p>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {children}
          <ErrorText>{error}</ErrorText>
          <Button type="submit" disabled={pending} className={pending ? "pulse-ring" : ""}>
            {pending ? "Searching..." : "Search docs"}
          </Button>
        </form>
        {payload ? <SaveProject type={type} payload={payload} defaultName={defaultName} /> : null}
      </aside>
      <section className="reveal reveal-d2">
        {payload ? (
          <div className="reveal">
            <ResultView result={payload.result} />
          </div>
        ) : (
          <EmptyState
            title="Results show up here"
            body="Run a search to pull official docs, sources, and notes for this stack."
          />
        )}
      </section>
    </div>
  );
}
