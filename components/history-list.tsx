import Link from "next/link";
import { LocalTime } from "@/components/local-time";
import { Badge, Card, EmptyState } from "@/components/ui";
import { frameworkById } from "@/lib/frameworks";
import { PROJECT_LABELS, type Project } from "@/lib/types";

export function HistoryList({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <EmptyState
        title="No saved findings yet"
        body="Run an upgrade, integration, or alternatives search and save it by name."
      />
    );
  }

  return (
    <div className="grid gap-3">
      {projects.map((project) => (
        <Link key={project.id} href={`/history/${project.id}`}>
          <Card className="lift p-5">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium">{project.name}</p>
              <Badge>{PROJECT_LABELS[project.type]}</Badge>
              <Badge>{frameworkById(project.framework).label}</Badge>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">{project.query}</p>
            <p className="mt-3 text-xs text-[var(--faint)]">
              <LocalTime value={project.created_at} />
            </p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
