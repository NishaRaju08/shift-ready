import Link from "next/link";
import { HeroVisual } from "@/components/hero-visual";
import { MarketingNav } from "@/components/nav";

const FEATURES = [
  {
    kicker: "01",
    title: "Upgrade guides",
    body: "Paste package.json, lock a real npm version, and get a shift score plus the docs to survive it.",
  },
  {
    kicker: "02",
    title: "Integration docs",
    body: "Search Stripe, Clerk, Prisma, or any library against the framework you already use.",
  },
  {
    kicker: "03",
    title: "Library alternatives",
    body: "Ask for a chat UI or auth kit and leave with GitHub, npm, and paid SDK links.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <MarketingNav />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-24 px-6 py-16">
        <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="reveal text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
              For teams mid-migration
            </p>
            <h1 className="reveal reveal-d1 mt-5 text-5xl font-semibold tracking-tight sm:text-6xl">
              Know what changes before you <span className="glow-text">shift</span> the stack.
            </h1>
            <p className="reveal reveal-d2 mt-6 max-w-xl text-lg leading-8 text-[var(--muted)]">
              Live docs, a shift score, copy-paste commands, and shareable findings — so the
              next upgrade is a plan, not a guess.
            </p>
            <div className="reveal reveal-d3 mt-8 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="shine inline-flex h-11 items-center rounded-lg bg-[var(--accent)] px-5 text-sm font-medium text-[#1a1308] shadow-[0_0_32px_rgba(232,160,74,0.35)]"
              >
                Create an account
              </Link>
              <Link
                href="/login"
                className="inline-flex h-11 items-center rounded-lg border border-[var(--line)] px-5 text-sm hover:border-[var(--accent)]"
              >
                Sign in
              </Link>
            </div>
          </div>
          <div className="reveal reveal-d4">
            <HeroVisual />
          </div>
        </section>
        <section className="grid gap-4 md:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <article
              key={feature.title}
              className={`glass lift reveal rounded-2xl p-6 reveal-d${index + 1}`}
            >
              <p className="text-xs tracking-[0.2em] text-[var(--accent)]">{feature.kicker}</p>
              <h2 className="mt-3 text-lg font-semibold">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{feature.body}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
