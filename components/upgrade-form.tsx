"use client";

import { useEffect, useMemo, useState } from "react";
import { listUpgradeTargets, searchUpgrade } from "@/app/actions/search";
import { FrameworkSelect } from "@/components/framework-select";
import { ToolShell, useSearchAction } from "@/components/tool-shell";
import { Field, fieldClass, TextArea } from "@/components/ui";
import { detectStack, frameworkById, parsePackageJson } from "@/lib/frameworks";

export function UpgradeForm() {
  const { payload, error, pending, run } = useSearchAction();
  const [packageJson, setPackageJson] = useState("");
  const [framework, setFramework] = useState("nextjs");
  const [targetVersion, setTargetVersion] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [latest, setLatest] = useState("");
  const [lookupError, setLookupError] = useState<string | null>(null);

  const detected = useMemo(() => {
    try {
      return detectStack(parsePackageJson(packageJson));
    } catch {
      return null;
    }
  }, [packageJson]);

  const pkg = (detected?.framework ?? frameworkById(framework)).packages[0];
  const current = detected?.version ?? "";

  useEffect(() => {
    let cancelled = false;
    setLookupError(null);
    void listUpgradeTargets(pkg, current).then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setOptions([]);
        setLatest("");
        setLookupError(result.error);
        return;
      }
      setOptions(result.options);
      setLatest(result.latest);
      setTargetVersion((value) => value || result.latest);
    });
    return () => {
      cancelled = true;
    };
  }, [pkg, current]);

  return (
    <ToolShell
      type="upgrade"
      title="Upgrade guide"
      blurb="Paste package.json. Target versions are real npm releases only, so a typo cannot poison the search."
      defaultName={
        detected
          ? `${detected.framework.label} ${detected.version} to ${targetVersion || latest}`
          : "Upgrade guide"
      }
      pending={pending}
      error={error}
      payload={payload}
      onSubmit={() =>
        run(() =>
          searchUpgrade({
            packageJson,
            framework: framework || detected?.framework.id || "react",
            targetVersion,
          }),
        )
      }
    >
      <Field label="package.json">
        <TextArea
          value={packageJson}
          onChange={(event) => {
            const value = event.target.value;
            setPackageJson(value);
            try {
              const stack = detectStack(parsePackageJson(value));
              if (stack) setFramework(stack.framework.id);
            } catch {}
          }}
          placeholder='{ "dependencies": { "next": "14.2.0" } }'
          required
        />
      </Field>
      <Field
        label="Framework"
        hint={detected ? `Detected ${detected.framework.label} ${detected.version}` : undefined}
      >
        <FrameworkSelect value={framework} onChange={setFramework} />
      </Field>
      <Field label="Target version" hint={latest ? `Latest ${latest}` : undefined}>
        <input
          className={fieldClass}
          value={targetVersion}
          onChange={(event) => setTargetVersion(event.target.value)}
          list="upgrade-versions"
          placeholder={latest || "15.0.0"}
          pattern="\d+\.\d+\.\d+"
          title="Use a published x.y.z version"
          required
        />
        <datalist id="upgrade-versions">
          {options.map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>
      </Field>
      {lookupError ? (
        <p className="text-xs text-[var(--faint)]">{lookupError}</p>
      ) : options.length > 0 ? (
        <p className="text-xs text-[var(--faint)]">
          Pick from published releases newer than {current || "your install"}.
        </p>
      ) : null}
    </ToolShell>
  );
}
