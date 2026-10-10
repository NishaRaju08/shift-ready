import { HistoryBoard } from "@/components/history-board";
import { EmptyState } from "@/components/ui";
import { listProjects } from "@/lib/projects";
import { PROJECT_TYPES, type ProjectType } from "@/lib/types";

export default async function HistoryIndexPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = (await searchParams).type;
  const value = Array.isArray(raw) ? raw[0] : raw;
  const filter: "all" | ProjectType =
    value && PROJECT_TYPES.includes(value as ProjectType) ? (value as ProjectType) : "all";

  const { projects, setupNeeded } = await listProjects();

  if (setupNeeded) {
    return (
      <EmptyState
        title="Projects table is missing"
        body="Run supabase/schema.sql in the Supabase SQL editor, then refresh."
      />
    );
  }

  return <HistoryBoard projects={projects} filter={filter} />;
}
