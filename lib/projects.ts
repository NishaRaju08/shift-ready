import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";

export function missingTable(message: string) {
  return /Could not find the table/i.test(message) || message.includes("schema cache");
}

export async function listProjects() {
  await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    if (missingTable(error.message)) {
      return { projects: [] as Project[], setupNeeded: true };
    }
    throw new Error(error.message);
  }

  return { projects: (data ?? []) as Project[], setupNeeded: false };
}

export async function getProject(id: string) {
  await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (missingTable(error.message)) return null;
    throw new Error(error.message);
  }
  return (data as Project | null) ?? null;
}

export async function getSharedProject(shareId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("share_id", shareId)
    .eq("is_public", true)
    .maybeSingle();

  if (error) {
    if (missingTable(error.message) || /share_id|is_public/.test(error.message)) return null;
    throw new Error(error.message);
  }
  return (data as Project | null) ?? null;
}
