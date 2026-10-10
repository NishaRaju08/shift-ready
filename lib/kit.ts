import { frameworkById } from "@/lib/frameworks";
import type { ProjectType, ShiftScore } from "@/lib/types";
import { parseVersion } from "@/lib/version";

export function shiftScore(current: string, target: string): ShiftScore {
  const from = parseVersion(current);
  const to = parseVersion(target);
  if (!from || !to) {
    return { score: 50, label: "Unknown jump", reasons: ["Could not parse versions"] };
  }

  const major = Math.max(0, to.major - from.major);
  const minor = Math.max(0, to.minor - from.minor);
  let score = 100 - major * 28 - (major === 0 ? minor * 8 : 0);
  const reasons: string[] = [];

  if (major >= 2) reasons.push(`${major} major versions — expect breaking APIs`);
  else if (major === 1) reasons.push("One major bump — read the official upgrade guide first");
  else if (minor > 0) reasons.push("Minor bump — usually additive, still check deprecations");
  else reasons.push("Patch bump — low risk");

  score = Math.min(100, Math.max(8, score));
  const label = score >= 75 ? "Smooth shift" : score >= 45 ? "Plan a weekend" : "Treat as a rewrite";
  return { score, label, reasons };
}

export function kitCommands(type: ProjectType, input: {
  framework: string;
  targetVersion?: string;
  currentVersion?: string;
  library?: string;
  need?: string;
}) {
  const stack = frameworkById(input.framework);
  const pkg = stack.packages[0];
  const target = input.targetVersion?.trim();

  if (type === "upgrade" && target) {
    const install = `npm install ${pkg}@${target}`;
    if (stack.id === "nextjs") {
      return [
        install,
        `npx @next/codemod@canary upgrade ${target}`,
        "Read the official upgrade guide from Exact links, then run the app.",
      ];
    }
    return [install, `npx npm-check-updates -u`, "Install, run tests, then follow the docs links."];
  }

  if (type === "integration" && input.library) {
    return [
      `npm install ${input.library}`,
      `Open the Docs / GitHub link and copy the ${stack.label} setup section.`,
    ];
  }

  return [
    "Shortlist one free GitHub/npm option and one paid SDK.",
    `Install the winner with npm install <package> in your ${stack.label} app.`,
  ];
}
