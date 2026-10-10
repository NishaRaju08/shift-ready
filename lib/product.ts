import type { ProjectType } from "@/lib/types";

export const TOOLS = [
  {
    href: "/upgrade",
    type: "upgrade" as const,
    title: "Upgrade guide",
    body: "Paste package.json, lock a published version, get a shift score.",
    cue: "package.json → npm version → docs",
    sample: "Next 14 → 15 · score 74",
  },
  {
    href: "/integrations",
    type: "integration" as const,
    title: "Integration docs",
    body: "Stripe, Clerk, Prisma — official setup for your framework.",
    cue: "library + stack → GitHub / npm / docs",
    sample: "Stripe · Clerk · Prisma",
  },
  {
    href: "/alternatives",
    type: "alternatives" as const,
    title: "Alternatives",
    body: "Chat UI, auth, forms — free OSS vs paid SDKs, with exact URLs.",
    cue: "need → ranked libraries",
    sample: "OSS vs paid SDK",
  },
];

export const STEPS = [
  { n: "01", title: "Paste the stack", body: "Drop package.json or name the library you need." },
  { n: "02", title: "Lock a real target", body: "We only search published npm versions, not typos." },
  { n: "03", title: "Leave with a kit", body: "Score, commands, and GitHub/npm/docs you can share." },
];

export const PREVIEWS: Record<
  ProjectType,
  { score?: number; label: string; lines: string[]; links: { name: string; kind: string }[] }
> = {
  upgrade: {
    score: 74,
    label: "Plan a weekend",
    lines: ["npm install next@15.5.0", "npx @next/codemod upgrade 15"],
    links: [
      { name: "nextjs.org/docs/app/guides/upgrading", kind: "Docs" },
      { name: "github.com/vercel/next.js/releases", kind: "GitHub" },
    ],
  },
  integration: {
    label: "Stripe on Next.js",
    lines: ["npm install stripe @stripe/stripe-js"],
    links: [
      { name: "docs.stripe.com/payments/checkout", kind: "Docs" },
      { name: "github.com/stripe/stripe-node", kind: "GitHub" },
    ],
  },
  alternatives: {
    label: "Chat libraries for Next.js",
    lines: ["Shortlist one OSS repo and one paid SDK."],
    links: [
      { name: "github.com/streamich/react-chat", kind: "GitHub" },
      { name: "npmjs.com/package/stream-chat-react", kind: "npm" },
    ],
  },
};
