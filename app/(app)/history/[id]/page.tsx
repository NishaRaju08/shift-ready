import { notFound } from "next/navigation";
import { DeleteProject } from "@/components/delete-project";
import { ResultView } from "@/components/result-view";
import { ShareFinding } from "@/components/share-finding";
import { Badge } from "@/components/ui";
import { frameworkById } from "@/lib/frameworks";
import { getProject } from "@/lib/projects";
import { PROJECT_LABELS } from "@/lib/types";

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Saved finding</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{project.name}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge>{PROJECT_LABELS[project.type]}</Badge>
            <Badge>{frameworkById(project.framework).label}</Badge>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <ShareFinding id={project.id} shareId={project.share_id} isPublic={project.is_public} />
          <DeleteProject id={project.id} />
        </div>
      </div>
      <ResultView result={project.result} />
    </div>
  );
}
