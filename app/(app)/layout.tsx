import { connection } from "next/server";
import { AppNav } from "@/components/nav";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await connection();
  const user = await requireUser();

  return (
    <div className="flex min-h-full flex-col">
      <AppNav email={user.email} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">{children}</main>
    </div>
  );
}
