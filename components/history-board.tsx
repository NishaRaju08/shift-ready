import Link from "next/link";
import { frameworkById } from "@/lib/frameworks";
import { relativeTime } from "@/lib/time";
import { PROJECT_LABELS, type Project, type ProjectType } from "@/lib/types";

const FILTERS: { id: "all" | ProjectType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "upgrade", label: "Upgrades" },
  { id: "integration", label: "Integrations" },
  { id: "alternatives", label: "Alternatives" },
];

const MARK: Record<ProjectType, { short: string; className: string }> = {
  upgrade: { short: "UP", className: "bg-[#3a2a12] text-[#e8a04a]" },
  integration: { short: "IN", className: "bg-[#143328] text-[#7dcea0]" },
  alternatives: { short: "AL", className: "bg-[#2c1d3a] text-[#c4a0e8]" },
};

function tags(project: Project) {
  const items = [frameworkById(project.framework).label];
  const score = project.result?.score;
  if (score) items.push(score.label);
  const alts = project.result?.alternatives?.length ?? 0;
  if (project.type === "alternatives" && alts) items.push(`${alts} alternatives`);
  const commands = project.result?.commands?.length ?? 0;
  if (commands) items.push(`${commands} commands`);
  return items.slice(0, 3);
}

export function HistoryBoard({
  projects,
  filter,
}: {
  projects: Project[];
  filter: "all" | ProjectType;
}) {
  const visible =
    filter === "all" ? projects : projects.filter((item) => item.type === filter);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">History</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {projects.length} report{projects.length === 1 ? "" : "s"} saved
          </p>
        </div>
        <div className="flex flex-wrap gap-1 rounded-full border border-[var(--line)] p-1 text-sm">
          {FILTERS.map((item) => {
            const href = item.id === "all" ? "/history" : `/history?type=${item.id}`;
            const active = filter === item.id;
            return (
              <Link
                key={item.id}
                href={href}
                className={`rounded-full px-3 py-1 ${active ? "bg-[var(--surface)] text-[var(--foreground)]" : "text-[var(--muted)]"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="grid gap-2">
          {visible.map((project) => {
            const mark = MARK[project.type];
            return (
              <div
                key={project.id}
                className="glass flex flex-wrap items-center gap-4 rounded-2xl px-4 py-4"
              >
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xs font-semibold ${mark.className}`}
                >
                  {mark.short}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{project.name}</p>
                  <p className="mt-1 truncate text-sm text-[var(--muted)]">
                    {PROJECT_LABELS[project.type]} · {project.result?.title || project.query}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags(project).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[var(--line)] px-2 py-0.5 text-[11px] text-[var(--muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[var(--faint)]">Saved {relativeTime(project.created_at)}</p>
                <Link
                  href={`/history/${project.id}`}
                  className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-sm hover:border-[var(--accent)]"
                >
                  Inspect
                </Link>
              </div>
            );
          })}
        </div>
      ) : null}

      <div className="glass grid place-items-center rounded-2xl px-6 py-14 text-center">
        <p className="text-base font-medium">Run an upgrade, integration, or alternatives search</p>
        <p className="mt-2 max-w-md text-sm text-[var(--muted)]">
          Audit your stack, generate the guide, and save it under a name you can reopen later.
        </p>
        <Link
          href="/upgrade"
          className="shine mt-5 inline-flex h-10 items-center rounded-lg bg-[var(--accent)] px-4 text-sm font-medium text-[#1a1308]"
        >
          + Start diagnostic scan
        </Link>
      </div>
    </div>
  );
}
