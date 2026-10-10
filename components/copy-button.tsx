"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <Button type="button" variant="ghost" onClick={onCopy}>
      {copied ? "Copied" : label}
    </Button>
  );
}
