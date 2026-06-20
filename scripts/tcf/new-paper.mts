/**
 * Create a full TCF paper (all 4 modules) in one command.
 *
 *   npm run tcf:new-paper -- --paper=6 --theme="Immigration au Canada"
 *   npm run tcf:new-paper -- --paper=6 --theme="..." --dry-run
 *   npm run tcf:new-paper -- --paper=6 --from-manifest
 */

import { spawn } from "node:child_process";
import path from "node:path";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    paper: { type: "string" },
    theme: { type: "string" },
    "dry-run": { type: "boolean" },
    "from-manifest": { type: "boolean" },
    "skip-upload": { type: "boolean" },
  },
});

const paper = values.paper;
const theme = values.theme;
const dryRun = values["dry-run"] ?? false;
const fromManifest = values["from-manifest"] ?? false;
const skipUpload = values["skip-upload"] ?? false;

if (!paper) {
  console.error(`Usage:
  npm run tcf:new-paper -- --paper=N --theme="..."
  npm run tcf:new-paper -- --paper=N --theme="..." --dry-run
  npm run tcf:new-paper -- --paper=N --from-manifest`);
  process.exit(1);
}

function run(cmd: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`\n>> ${cmd} ${args.join(" ")}`);
    const child = spawn(cmd, args, {
      stdio: "inherit",
      cwd: process.cwd(),
      shell: process.platform === "win32",
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited ${code}`));
    });
  });
}

const tsx = path.join(process.cwd(), "node_modules/.bin/tsx");
const tsxCmd = tsx;

async function main() {
  if (!fromManifest) {
    if (!theme) {
      console.error("--theme is required unless --from-manifest");
      process.exit(1);
    }
    await run(tsxCmd, [
      "scripts/tcf/generate-content.mts",
      `--paper=${paper}`,
      `--theme=${theme}`,
    ]);
    if (dryRun) {
      console.log("\nDry run complete — review content/tcf/manifests/ then re-run with --from-manifest");
      return;
    }
  }

  await run(tsxCmd, ["scripts/tcf/emit-typescript.mts", `--paper=${paper}`]);
  await run(tsxCmd, ["scripts/tcf/register-paper.mts", `--paper=${paper}`]);
  await run("npm", ["run", "generate:tcf-audio", "--", `--paper=${paper}`]);

  if (!skipUpload) {
    await run("npm", ["run", "upload:tcf-audio:server", "--", `--paper=${paper}`]);
  }

  console.log(`\nPaper ${paper} ready. Redeploy ailearn-app if TypeScript content changed.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
