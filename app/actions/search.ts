"use server";

import { detectStack, frameworkById, parsePackageJson } from "@/lib/frameworks";
import { requireUser } from "@/lib/auth";
import { kitCommands, shiftScore } from "@/lib/kit";
import { upgradeTargets } from "@/lib/npm";
import { buildSearchQuery, searchDocs } from "@/lib/serpapi";
import type { ActionState, ProjectType, SearchPayload } from "@/lib/types";
import type { SearchInput } from "@/lib/serpapi";
import { compareVersions, parseVersion } from "@/lib/version";

export async function listUpgradeTargets(pkg: string, current?: string) {
  try {
    return { ok: true as const, ...(await upgradeTargets(pkg, current)) };
  } catch (error) {
    return { ok: false as const, error: error instanceof Error ? error.message : "npm lookup failed" };
  }
}

export async function searchUpgrade(input: {
  packageJson: string;
  framework: string;
  targetVersion: string;
}): Promise<ActionState> {
  await requireUser();

  try {
    const pkg = parsePackageJson(input.packageJson);
    const detected = detectStack(pkg);
    const framework = input.framework || detected?.framework.id || "react";
    const currentVersion = detected?.version ?? "";
    const targetVersion = await assertPublishedVersion(framework, currentVersion, input.targetVersion);
    return runSearch("upgrade", framework, { targetVersion, currentVersion });
  } catch (error) {
    return { ok: false, error: toError(error) };
  }
}

export async function searchIntegration(input: {
  framework: string;
  library: string;
}): Promise<ActionState> {
  await requireUser();
  return runSearch("integration", input.framework, { library: input.library });
}

export async function searchAlternatives(input: {
  framework: string;
  need: string;
}): Promise<ActionState> {
  await requireUser();
  return runSearch("alternatives", input.framework, { need: input.need });
}

async function assertPublishedVersion(frameworkId: string, current: string, targetRaw: string) {
  const target = parseVersion(targetRaw);
  if (!target) {
    throw new Error("Target version must look like 15.0.0");
  }

  const currentParsed = current ? parseVersion(current) : null;
  if (currentParsed && compareVersions(target, currentParsed) <= 0) {
    throw new Error(`Target must be newer than the installed ${currentParsed.raw}`);
  }

  const pkg = frameworkById(frameworkId).packages[0];
  const { latest, options } = await upgradeTargets(pkg, current);
  if (!options.includes(target.raw) && latest !== target.raw) {
    const hint = options.slice(0, 5).join(", ") || latest;
    throw new Error(
      `${pkg}@${target.raw} is not a published release. Latest is ${latest || "unknown"}. Try ${hint}.`,
    );
  }

  return target.raw;
}

async function runSearch(
  type: ProjectType,
  framework: string,
  input: Omit<SearchInput, "framework">,
): Promise<ActionState<SearchPayload>> {
  const payload = { ...input, framework };
  try {
    const query = buildSearchQuery(type, payload);
    const result = await searchDocs(type, payload);
    result.commands = kitCommands(type, payload);
    result.score =
      type === "upgrade" && payload.currentVersion && payload.targetVersion
        ? shiftScore(payload.currentVersion, payload.targetVersion)
        : null;
    return { ok: true, data: { result, query, framework, input: payload } };
  } catch (error) {
    console.error("[search] failed", error);
    return { ok: false, error: toError(error) };
  }
}

function toError(error: unknown) {
  return error instanceof Error ? error.message : "Search failed";
}
