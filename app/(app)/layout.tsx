import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await connection();
  const user = await requireUser();

  return <AppShell email={user.email}>{children}</AppShell>;
}
