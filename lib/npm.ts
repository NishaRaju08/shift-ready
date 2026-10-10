import { nextVersions, parseVersion } from "@/lib/version";

type NpmPackument = {
  "dist-tags"?: { latest?: string };
  versions?: Record<string, unknown>;
};

export async function npmPackument(pkg: string) {
  const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(pkg)}`, {
    headers: { accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Could not load npm versions for ${pkg}`);
  }
  const data = (await response.json()) as NpmPackument;
  const latest = data["dist-tags"]?.latest ?? "";
  const versions = Object.keys(data.versions ?? {});
  return { latest, versions };
}

export async function upgradeTargets(pkg: string, current?: string) {
  const { latest, versions } = await npmPackument(pkg);
  return {
    latest,
    options: nextVersions(versions, current, latest),
    latestParsed: parseVersion(latest),
  };
}
