"use client";

import { useEffect, useState } from "react";
import { publishProject } from "@/app/actions/projects";
import { CopyButton } from "@/components/copy-button";
import { Button, ErrorText } from "@/components/ui";

export function ShareFinding({
  id,
  shareId,
  isPublic,
}: {
  id: string;
  shareId?: string | null;
  isPublic?: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [share, setShare] = useState(isPublic && shareId ? shareId : "");
  const [origin, setOrigin] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  async function onShare() {
    setPending(true);
    setError(null);
    const result = await publishProject(id);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setShare(result.data.share_id ?? "");
  }

  const href = share ? `${origin}/s/${share}` : "";

  return (
    <div className="grid gap-2">
      {href ? (
        <CopyButton text={href} label="Copy share link" />
      ) : (
        <Button type="button" variant="ghost" onClick={onShare} disabled={pending}>
          {pending ? "Sharing..." : "Share finding"}
        </Button>
      )}
      <ErrorText>{error}</ErrorText>
    </div>
  );
}
