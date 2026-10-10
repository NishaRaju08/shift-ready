export type Framework = {
  id: string;
  label: string;
  packages: string[];
  docsHost: string;
};

export const FRAMEWORKS: Framework[] = [
  { id: "nextjs", label: "Next.js", packages: ["next"], docsHost: "nextjs.org" },
  { id: "nuxt", label: "Nuxt", packages: ["nuxt"], docsHost: "nuxt.com" },
  { id: "sveltekit", label: "SvelteKit", packages: ["@sveltejs/kit"], docsHost: "svelte.dev" },
  { id: "remix", label: "Remix", packages: ["@remix-run/react"], docsHost: "remix.run" },
  { id: "nestjs", label: "NestJS", packages: ["@nestjs/core"], docsHost: "docs.nestjs.com" },
  { id: "angular", label: "Angular", packages: ["@angular/core"], docsHost: "angular.dev" },
  { id: "astro", label: "Astro", packages: ["astro"], docsHost: "docs.astro.build" },
  { id: "express", label: "Express", packages: ["express"], docsHost: "expressjs.com" },
  { id: "fastify", label: "Fastify", packages: ["fastify"], docsHost: "fastify.dev" },
  { id: "vue", label: "Vue", packages: ["vue"], docsHost: "vuejs.org" },
  { id: "svelte", label: "Svelte", packages: ["svelte"], docsHost: "svelte.dev" },
  { id: "solid", label: "Solid", packages: ["solid-js"], docsHost: "docs.solidjs.com" },
  { id: "react", label: "React", packages: ["react"], docsHost: "react.dev" },
];

export type DetectedStack = {
  framework: Framework;
  version: string;
};

type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

export function frameworkById(id: string) {
  return FRAMEWORKS.find((item) => item.id === id) ?? FRAMEWORKS[0];
}

export function parsePackageJson(raw: string): PackageJson {
  const parsed = JSON.parse(raw) as PackageJson;
  if (!parsed || typeof parsed !== "object") {
    throw new Error("package.json must be an object");
  }
  return parsed;
}

export function detectStack(pkg: PackageJson): DetectedStack | null {
  const deps = { ...pkg.devDependencies, ...pkg.dependencies };
  for (const framework of FRAMEWORKS) {
    const match = framework.packages.find((name) => deps[name]);
    if (match) {
      return { framework, version: cleanVersion(deps[match]) };
    }
  }
  return null;
}

export function cleanVersion(value: string) {
  return value.replace(/^[\^~>=<\s]+/, "").trim();
}

export function topicFromNeed(need: string) {
  return need
    .replace(/\b(libraries?|library|packages?|package|sdks?|plugin|plugins|component|components)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}
