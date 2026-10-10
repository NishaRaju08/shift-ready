"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function safePath(value: FormDataEntryValue | null) {
  const path = String(value ?? "/dashboard");
  return path.startsWith("/") ? path : "/dashboard";
}

export async function signIn(_prev: unknown, formData: FormData) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
    if (error) return { error: error.message };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Sign in failed" };
  }
  redirect(safePath(formData.get("next")));
}

export async function signUp(_prev: unknown, formData: FormData) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
    if (error) return { error: error.message };
    if (!data.session) {
      return { error: "Check your email to confirm the account, then sign in." };
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Sign up failed" };
  }
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
