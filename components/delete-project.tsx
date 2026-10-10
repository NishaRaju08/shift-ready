"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteProject } from "@/app/actions/projects";
import { Button, ErrorText } from "@/components/ui";

export function DeleteProject({ id }: { id: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onDelete() {
    setPending(true);
    const result = await deleteProject(id);
    if (!result.ok) {
      setError(result.error);
      setPending(false);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="grid gap-2">
      <Button variant="danger" type="button" onClick={onDelete} disabled={pending}>
        {pending ? "Deleting..." : "Delete"}
      </Button>
      <ErrorText>{error}</ErrorText>
    </div>
  );
}
