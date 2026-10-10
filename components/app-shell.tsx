"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions/auth";
import { Logo } from "@/components/nav";

const LINKS = [
  { href: "/dashboard", label: "Workspace" },
  { href: "/upgrade", label: "Upgrade" },
  { href: "/integrations", label: "Integrations" },
  { href: "/alternatives", label: "Alternatives" },
  { href: "/history", label: "History" },
];

function NavLinks({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="grid gap-1 text-sm">
      {LINKS.map((link) => {
        const active =
          link.href === "/history"
            ? pathname.startsWith("/history")
            : pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClick}
            className={`rounded-lg px-3 py-2 ${active ? "bg-[var(--surface)] text-[var(--foreground)]" : "text-[var(--muted)] hover:bg-[var(--surface)]/50 hover:text-[var(--foreground)]"}`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Account({ email }: { email: string }) {
  return (
    <div className="flex min-w-0 items-center gap-4">
      <p className="hidden truncate text-sm text-[var(--muted)] sm:block">{email}</p>
      <form action={signOut}>
        <button
          type="submit"
          className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-sm hover:border-[var(--accent)]"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}

export function AppShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-full flex-col md:flex-row">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[var(--line)] bg-[#0c0a07]/90 p-5 md:flex">
        <Logo href="/dashboard" />
        <div className="mt-8">
          <NavLinks />
        </div>
      </aside>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-black/55 md:hidden"
            onClick={() => setOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--line)] bg-[#0c0a07] p-5 md:hidden">
            <Logo href="/dashboard" />
            <div className="mt-8">
              <NavLinks onClick={() => setOpen(false)} />
            </div>
          </aside>
        </>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--background)_88%,transparent)] px-4 py-3 backdrop-blur-md md:px-8">
          <button
            type="button"
            className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-sm md:hidden"
            onClick={() => setOpen(true)}
          >
            Menu
          </button>
          <div className="hidden md:block" />
          <Account email={email} />
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
