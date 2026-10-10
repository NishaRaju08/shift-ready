import Link from "next/link";

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
