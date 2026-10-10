"use client";

import { useState } from "react";
import { searchAlternatives } from "@/app/actions/search";
import { FrameworkSelect } from "@/components/framework-select";
import { ToolShell, useSearchAction } from "@/components/tool-shell";
import { Field, fieldClass } from "@/components/ui";

export function AlternativesForm() {
  const { payload, error, pending, run } = useSearchAction();
  const [framework, setFramework] = useState("nextjs");
  const [need, setNeed] = useState("");

  return (
    <ToolShell
      type="alternatives"
      title="Library alternatives"
      blurb="Describe what you need and compare free, freemium, and paid options for that stack."
      defaultName={need ? `${need} alternatives` : "Alternatives"}
      pending={pending}
      error={error}
      payload={payload}
      onSubmit={() => run(() => searchAlternatives({ framework, need }))}
    >
      <Field label="Framework">
        <FrameworkSelect value={framework} onChange={setFramework} />
      </Field>
      <Field label="What do you need?">
        <input
          className={fieldClass}
          value={need}
          onChange={(event) => setNeed(event.target.value)}
          placeholder="chat UI, auth, form library..."
          required
        />
      </Field>
    </ToolShell>
  );
}
