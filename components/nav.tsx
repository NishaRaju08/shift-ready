"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui";

const LINKS = [
  { href: "/dashboard", label: "History" },
  { href: "/upgrade", label: "Upgrade" },
  { href: "/integrations", label: "Integrations" },
  { href: "/alternatives", label: "Alternatives" },
];

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="group flex items-center gap-2 font-semibold tracking-tight">
      <img
        src="/logo.png"
        alt="Shift Ready"
        width={40}
        height={40}
        className="h-10 w-10 rounded-lg transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105"
      />
      Shift Ready
    </Link>
  );
}

export function AppNav({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-20 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--background)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Logo href="/dashboard" />
        <nav className="flex flex-wrap items-center gap-1 text-sm text-[var(--muted)]">
          {LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-1.5 ${active ? "bg-[var(--surface)] text-[var(--foreground)]" : "hover:text-[var(--foreground)]"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-[var(--muted)] sm:inline">{email}</span>
          <form action={signOut}>
            <Button variant="ghost" type="submit">
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function MarketingNav() {
  return (
    <div className="border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--background)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo />
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="shine inline-flex h-10 items-center rounded-lg bg-[var(--accent)] px-4 text-sm font-medium text-[#1a1308]"
          >
            Get started
          </Link>
        </div>
      </div>
    </div>
  );
}
