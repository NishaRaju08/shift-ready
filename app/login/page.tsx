import { AuthForm } from "@/components/auth-form";
import { Logo } from "@/components/nav";
import { Card } from "@/components/ui";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const next = (await searchParams).next;
  const redirectTo = Array.isArray(next) ? next[0] : next;

  return (
    <main className="reveal mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-16">
      <Logo />
      <h1 className="mt-8 text-3xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Sign in to reopen saved upgrades, integrations, and alternatives.
      </p>
      <Card className="mt-8 p-6">
        <AuthForm mode="login" next={redirectTo} />
      </Card>
    </main>
  );
}
