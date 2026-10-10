"use client";

import { useState } from "react";
import { searchIntegration } from "@/app/actions/search";
import { FrameworkSelect } from "@/components/framework-select";
import { ToolShell, useSearchAction } from "@/components/tool-shell";
import { Field, fieldClass } from "@/components/ui";

export function IntegrationForm() {
  const { payload, error, pending, run } = useSearchAction();
  const [framework, setFramework] = useState("nextjs");
  const [library, setLibrary] = useState("");

  return (
    <ToolShell
      type="integration"
      title="Integration docs"
      blurb="Search official setup docs for a library against the framework you are shipping."
      defaultName={library ? `${library} on ${framework}` : "Integration"}
      pending={pending}
      error={error}
      payload={payload}
      onSubmit={() => run(() => searchIntegration({ framework, library }))}
    >
      <Field label="Framework">
        <FrameworkSelect value={framework} onChange={setFramework} />
      </Field>
      <Field label="Library">
        <input
          className={fieldClass}
          value={library}
          onChange={(event) => setLibrary(event.target.value)}
          placeholder="Stripe, Clerk, Prisma..."
          required
        />
      </Field>
    </ToolShell>
  );
}
