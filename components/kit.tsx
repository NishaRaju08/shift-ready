import { CopyButton } from "@/components/copy-button";

export function CommandKit({ commands }: { commands: string[] }) {
  const block = commands.join("\n");

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-[var(--muted)]">Do this next</h3>
        <CopyButton text={block} label="Copy kit" />
      </div>
      <pre className="mt-3 overflow-x-auto rounded-xl bg-[var(--surface)] p-4 font-mono text-[13px] leading-6">
        {block}
      </pre>
    </div>
  );
}
