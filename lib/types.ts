export const PROJECT_TYPES = ["upgrade", "integration", "alternatives"] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

export const PROJECT_LABELS: Record<ProjectType, string> = {
  upgrade: "Upgrade",
  integration: "Integration",
  alternatives: "Alternatives",
};

export type SourceKind = "github" | "npm" | "docs" | "article";

export type Source = {
  title: string;
  url: string;
  snippet: string;
  kind: SourceKind;
  host: string;
};

export type Alternative = {
  name: string;
  description: string;
  pricing: "free" | "paid" | "freemium" | "unknown";
  url: string;
  kind: SourceKind;
  host: string;
};

export type ShiftScore = {
  score: number;
  label: string;
  reasons: string[];
};

export type SearchResult = {
  title: string;
  summary: string;
  steps: string[];
  sources: Source[];
  alternatives: Alternative[];
  query?: string;
  score?: ShiftScore | null;
  commands?: string[];
};

export type Project = {
  id: string;
  user_id: string;
  name: string;
  type: ProjectType;
  framework: string;
  query: string;
  input: Record<string, unknown>;
  result: SearchResult;
  sources: Source[];
  created_at: string;
  is_public?: boolean;
  share_id?: string | null;
};

export type SearchPayload = {
  result: SearchResult;
  query: string;
  framework: string;
  input: Record<string, unknown>;
};

export type ActionState<T = SearchPayload> =
  | { ok: true; data: T }
  | { ok: false; error: string };
