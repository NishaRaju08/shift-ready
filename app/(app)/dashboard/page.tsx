import Link from "next/link";
import { HistoryList } from "@/components/history-list";
import { EmptyState } from "@/components/ui";
import { listProjects } from "@/lib/projects";

const TOOLS = [
  { href: "/upgrade", title: "Upgrade guide", body: "From package.json to the next version." },
  { href: "/integrations", title: "Integration docs", body: "Library setup for your framework." },
  { href: "/alternatives", title: "Alternatives", body: "Free and paid options for a need." },
];

export default async function DashboardPage() {
  const { projects, setupNeeded } = await listProjects();

  return (
    <div className="grid gap-10">
      <section className="reveal">
        <h1 className="text-3xl font-semibold tracking-tight">Your workspace</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Saved findings stay attached to this account by name.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="lift rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5"
            >
              <h2 className="font-medium">{tool.title}</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{tool.body}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="grid gap-4">
        <h2 className="text-lg font-semibold">History</h2>
        {setupNeeded ? (
          <EmptyState
            title="Projects table is missing"
            body="Run supabase/schema.sql in the Supabase SQL editor, then refresh."
          />
        ) : (
          <HistoryList projects={projects} />
        )}
      </section>
    </div>
  );
}
