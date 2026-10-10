export type SemVer = { major: number; minor: number; patch: number; raw: string };

const SEMVER = /^(\d+)\.(\d+)\.(\d+)$/;

export function parseVersion(value: string): SemVer | null {
  const cleaned = value.trim().replace(/^[vV]/, "").replace(/^[\^~>=<\s]+/, "").split("-")[0] ?? "";
  const match = cleaned.match(SEMVER);
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    raw: `${match[1]}.${match[2]}.${match[3]}`,
  };
}

export function compareVersions(a: SemVer, b: SemVer) {
  return a.major - b.major || a.minor - b.minor || a.patch - b.patch;
}

export function isStableVersion(value: string) {
  return SEMVER.test(value);
}

export function nextVersions(all: string[], current?: string, latest?: string) {
  const currentParsed = current ? parseVersion(current) : null;
  const latestParsed = latest ? parseVersion(latest) : null;
  return all
    .filter(isStableVersion)
    .map((item) => parseVersion(item))
    .filter((item): item is SemVer => {
      if (!item) return false;
      if (currentParsed && compareVersions(item, currentParsed) <= 0) return false;
      if (latestParsed && compareVersions(item, latestParsed) > 0) return false;
      return true;
    })
    .sort((a, b) => compareVersions(b, a))
    .slice(0, 24)
    .map((item) => item.raw);
}
