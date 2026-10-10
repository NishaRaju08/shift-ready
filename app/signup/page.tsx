import { AuthForm } from "@/components/auth-form";
import { Logo } from "@/components/nav";
import { Card } from "@/components/ui";

export default function SignupPage() {
  return (
    <main className="reveal mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-16">
      <Logo />
      <h1 className="mt-8 text-3xl font-semibold tracking-tight">Create your workspace</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        History is stored per account so migration notes stay easy to find.
      </p>
      <Card className="mt-8 p-6">
        <AuthForm mode="signup" />
      </Card>
    </main>
  );
}
