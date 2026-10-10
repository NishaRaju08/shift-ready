"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveProject } from "@/app/actions/projects";
import { Button, ErrorText, Field, fieldClass } from "@/components/ui";
import type { ProjectType, SearchPayload } from "@/lib/types";

export function SaveProject({
  type,
  payload,
  defaultName,
}: {
  type: ProjectType;
  payload: SearchPayload;
  defaultName: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(defaultName);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSave() {
    setPending(true);
    setError(null);
    const saved = await saveProject({
      name,
      type,
      framework: payload.framework,
      query: payload.query,
      input: payload.input,
      result: payload.result,
      sources: payload.result.sources,
    });
    setPending(false);
    if (!saved.ok) {
      setError(saved.error);
      return;
    }
    router.push(`/history/${saved.data.id}`);
  }

  return (
    <div className="grid gap-3 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
      <Field label="Save this finding">
        <input
          className={fieldClass}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Next 15 shop upgrade"
        />
      </Field>
      <ErrorText>{error}</ErrorText>
      <Button type="button" onClick={onSave} disabled={pending || !name.trim()}>
        {pending ? "Saving..." : "Save to history"}
      </Button>
    </div>
  );
}
