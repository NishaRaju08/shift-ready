import { serpApiKey } from "@/lib/env";
import { frameworkById, topicFromNeed } from "@/lib/frameworks";
import type { Alternative, ProjectType, SearchResult, Source, SourceKind } from "@/lib/types";

type OrganicResult = {
  title?: string;
  link?: string;
  snippet?: string;
};

type SerpResponse = {
  error?: string;
  organic_results?: OrganicResult[];
};

const JUNK =
  /bestbuy|amazon\.|walmart|ebay|etsy|target\.com|pinterest|facebook|instagram|tiktok|ambest|insurance|yelp|tripadvisor|shopping|coupon|deal/i;

const PAID_HINT = /paid|premium|enterprise|pricing|subscription|saas|twilio|sendbird|stream\.io|talkjs|firebase|clerk|auth0/i;

export type SearchInput = {
  framework: string;
  targetVersion?: string;
  currentVersion?: string;
  library?: string;
  need?: string;
};

export function buildSearchQueries(type: ProjectType, input: SearchInput) {
  const stack = frameworkById(input.framework);
  const framework = stack.label;
  const docs = stack.docsHost;

  if (type === "upgrade") {
    const from = input.currentVersion ? ` ${input.currentVersion}` : "";
    const to = input.targetVersion ?? "latest";
    return [
      `site:${docs} ${framework} upgrading${from} to ${to} official guide`,
      `${framework} ${to} migration changelog documentation -shop`,
    ];
  }

  if (type === "integration") {
    const library = (input.library ?? "").trim();
    return [
      `${library} ${framework} official documentation install setup site:${docs} OR site:github.com`,
      `${library} ${framework} npm docs README`,
    ];
  }

  const topic = topicFromNeed(input.need ?? "") || (input.need ?? "").trim();
  return [
    `${framework} ${topic} library (site:github.com OR site:npmjs.com) README`,
    `${framework} ${topic} SDK comparison open source OR paid docs -shop -buy`,
  ];
}

export function buildSearchQuery(type: ProjectType, input: SearchInput) {
  return buildSearchQueries(type, input).join(" | ");
}

export async function searchWeb(query: string): Promise<SerpResponse> {
  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google");
  url.searchParams.set("q", query);
  url.searchParams.set("api_key", serpApiKey());
  url.searchParams.set("num", "10");
  url.searchParams.set("filter", "1");

  console.log("[serpapi] sending", { q: query });

  const response = await fetch(url.toString(), { cache: "no-store" });
  const data = (await response.json()) as SerpResponse;

  console.log("[serpapi] received", {
    status: response.status,
    error: data.error ?? null,
    titles: (data.organic_results ?? []).map((item) => item.title),
    links: (data.organic_results ?? []).map((item) => item.link),
  });

  if (!response.ok || data.error) {
    throw new Error(data.error || `SerpAPI request failed (${response.status})`);
  }

  return data;
}

export async function searchDocs(type: ProjectType, input: SearchInput): Promise<SearchResult> {
  const queries = buildSearchQueries(type, input);
  const pages = await Promise.all(queries.map(searchWeb));
  const merged = pages.flatMap((page) => page.organic_results ?? []);
  const topic = topicFromNeed(input.need ?? "") || input.library || "";
  const framework = frameworkById(input.framework).label;
  return toSearchResult(type, queries.join(" | "), merged, { topic, framework });
}

function toSearchResult(
  type: ProjectType,
  query: string,
  organics: OrganicResult[],
  ctx: { topic: string; framework: string },
): SearchResult {
  const ranked = uniqueByUrl(organics)
    .map(toSource)
    .filter((item): item is Source => Boolean(item))
    .map((source) => ({ source, score: scoreSource(source, ctx) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.source)
    .slice(0, 10);

  if (ranked.length === 0) {
    throw new Error("No GitHub, npm, or docs references found for this stack. Try a more specific name.");
  }

  const heading =
    type === "upgrade"
      ? `${ctx.framework} upgrade references`
      : type === "integration"
        ? `${ctx.topic} on ${ctx.framework}`
        : `${ctx.topic || "Library"} options for ${ctx.framework}`;

  return {
    title: heading,
    summary:
      type === "alternatives"
        ? `Use the GitHub, npm, and docs links below. Prefer official repos for install, then paid SDKs if you need hosted chat/infra.`
        : `Open these official docs, GitHub READMEs, and npm pages for ${ctx.framework}.`,
    steps: [],
    sources: ranked,
    alternatives: type === "alternatives" ? toAlternatives(ranked) : [],
    query,
  };
}

function toSource(item: OrganicResult): Source | null {
  if (!item.link || !item.title) return null;
  let url: URL;
  try {
    url = new URL(item.link);
  } catch {
    return null;
  }
  if (JUNK.test(url.hostname) || JUNK.test(item.title) || JUNK.test(item.snippet ?? "")) {
    return null;
  }
  return {
    title: item.title,
    url: item.link,
    snippet: item.snippet ?? "",
    kind: kindFor(url.hostname, item.link),
    host: url.hostname.replace(/^www\./, ""),
  };
}

function kindFor(host: string, href: string): SourceKind {
  if (host.includes("github.com")) return "github";
  if (host.includes("npmjs.com") || href.includes("/package/")) return "npm";
  if (host.startsWith("docs.") || host.includes("nextjs.org") || /docs|guide|reference/.test(href)) {
    return "docs";
  }
  return "article";
}

function scoreSource(source: Source, ctx: { topic: string; framework: string }) {
  const text = `${source.title} ${source.snippet} ${source.host}`.toLowerCase();
  const topic = ctx.topic.toLowerCase();
  const framework = ctx.framework.toLowerCase();
  let score = 0;
  if (source.kind === "github") score += 6;
  if (source.kind === "npm") score += 6;
  if (source.kind === "docs") score += 5;
  if (topic && text.includes(topic)) score += 4;
  if (framework && text.includes(framework.replace(".js", ""))) score += 2;
  if (source.kind === "article") score += 1;
  return score;
}

function uniqueByUrl(items: OrganicResult[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (!item.link || seen.has(item.link)) return false;
    seen.add(item.link);
    return true;
  });
}

function toAlternatives(sources: Source[]): Alternative[] {
  const seen = new Set<string>();
  return sources.flatMap((source) => {
    const name = libraryName(source);
    const key = name.toLowerCase();
    if (seen.has(key)) return [];
    seen.add(key);
    return [
      {
        name,
        description: source.snippet,
        pricing: detectPricing(source),
        url: source.url,
        kind: source.kind,
        host: source.host,
      },
    ];
  });
}

function libraryName(source: Source) {
  try {
    const url = new URL(source.url);
    if (url.hostname.includes("github.com")) {
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts[1]) return parts[1];
    }
    if (url.hostname.includes("npmjs.com")) {
      const parts = url.pathname.split("/").filter(Boolean);
      const pkg = parts.slice(parts.indexOf("package") + 1).join("/");
      if (pkg) return pkg;
    }
  } catch {}
  return source.title.split(/[-–|·:]/)[0]?.trim() || source.title;
}

function detectPricing(source: Source): Alternative["pricing"] {
  const value = `${source.title} ${source.snippet} ${source.host}`.toLowerCase();
  const paid = PAID_HINT.test(value);
  const free = source.kind === "github" || source.kind === "npm" || /open.?source|mit license|apache/.test(value);
  if (paid && free) return "freemium";
  if (paid) return "paid";
  if (free) return "free";
  return "unknown";
}
