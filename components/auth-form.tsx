"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, signUp } from "@/app/actions/auth";
import { Button, ErrorText, Field, fieldClass } from "@/components/ui";

export function AuthForm({
  mode,
  next = "/dashboard",
}: {
  mode: "login" | "signup";
  next?: string;
}) {
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="next" value={next} />
      <Field label="Email">
        <input className={fieldClass} type="email" name="email" autoComplete="email" required />
      </Field>
      <Field label="Password">
        <input
          className={fieldClass}
          type="password"
          name="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={6}
          required
        />
      </Field>
      <ErrorText>{state?.error}</ErrorText>
      <Button type="submit" disabled={pending}>
        {pending ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
      </Button>
      <p className="text-sm text-[var(--muted)]">
        {mode === "login" ? (
          <>
            No account?{" "}
            <Link className="text-[var(--accent)]" href="/signup">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have one?{" "}
            <Link className="text-[var(--accent)]" href="/login">
              Sign in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
