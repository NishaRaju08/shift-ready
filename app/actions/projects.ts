"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { missingTable } from "@/lib/projects";
import { createClient } from "@/lib/supabase/server";
import type { ActionState, Project, ProjectType, SearchResult, Source } from "@/lib/types";

export async function saveProject(input: {
  name: string;
  type: ProjectType;
  framework: string;
  query: string;
  input: Record<string, unknown>;
  result: SearchResult;
  sources: Source[];
}): Promise<ActionState<Project>> {
  const user = await requireUser();
  const name = input.name.trim();
  if (!name) return { ok: false, error: "Name is required" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name,
      type: input.type,
      framework: input.framework,
      query: input.query,
      input: input.input,
      result: input.result,
      sources: input.sources,
    })
    .select("*")
    .single();

  if (error || !data) {
    const message = error?.message ?? "Save failed";
    return {
      ok: false,
      error: missingTable(message)
        ? "Run supabase/schema.sql in the Supabase SQL editor, then try again."
        : message,
    };
  }

  revalidatePath("/dashboard");
  return { ok: true, data: data as Project };
}

export async function publishProject(id: string): Promise<ActionState<Project>> {
  await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .update({ is_public: true })
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: /is_public|share_id/.test(error?.message ?? "")
        ? "Run supabase/share.sql in the SQL editor to enable sharing."
        : error?.message ?? "Share failed",
    };
  }
  return { ok: true, data: data as Project };
}

export async function deleteProject(id: string): Promise<ActionState<null>> {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard");
  return { ok: true, data: null };
}
