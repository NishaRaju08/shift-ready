import { notFound } from "next/navigation";
import { Logo } from "@/components/nav";
import { ResultView } from "@/components/result-view";
import { Badge } from "@/components/ui";
import { frameworkById } from "@/lib/frameworks";
import { getSharedProject } from "@/lib/projects";
import { PROJECT_LABELS } from "@/lib/types";

export default async function SharePage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;
  const project = await getSharedProject(shareId);
  if (!project) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <Logo />
      <p className="mt-10 text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Shared finding</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{project.name}</h1>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge>{PROJECT_LABELS[project.type]}</Badge>
        <Badge>{frameworkById(project.framework).label}</Badge>
      </div>
      <div className="mt-8">
        <ResultView result={project.result} />
      </div>
    </main>
  );
}
