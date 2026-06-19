import { execFileSync } from "node:child_process";
import { copyFile, cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..", "..");
const frontendDir = path.join(root, "artifacts", "kawalees");
const distDir = path.join(frontendDir, "dist");
const docsDir = path.join(root, "docs");

function run(command: string, args: string[]) {
  const executable = process.platform === "win32" ? "cmd.exe" : command;
  const executableArgs = process.platform === "win32" ? ["/d", "/c", command, ...args] : args;
  execFileSync(executable, executableArgs, {
    cwd: root,
    stdio: "inherit",
  });
}

async function importData<T>(relativePath: string, exportName: string): Promise<T[]> {
  const moduleUrl = pathToFileURL(path.join(frontendDir, "src", relativePath)).href;
  const dataModule = await import(moduleUrl);
  return dataModule[exportName] as T[];
}

async function copyIndexToRoute(route: string) {
  const targetDir = path.join(docsDir, route);
  await mkdir(targetDir, { recursive: true });
  await copyFile(path.join(docsDir, "index.html"), path.join(targetDir, "index.html"));
}

run("pnpm", ["--filter", "kawalees-frontend", "build"]);

await rm(docsDir, { recursive: true, force: true });
await mkdir(docsDir, { recursive: true });
await cp(distDir, docsDir, { recursive: true });

await copyFile(path.join(docsDir, "index.html"), path.join(docsDir, "404.html"));

const artists = await importData<{ id: string }>("data/artists.ts", "artists");
const projects = await importData<{ id: string }>("data/projects.ts", "projects");

const routes = new Set([
  "join",
  "contact",
  "projects",
  "pricing",
  ...artists.map((artist) => `artist/${artist.id}`),
  ...projects.map((project) => `projects/${project.id}`),
]);

for (const route of routes) {
  await copyIndexToRoute(route);
}

await rm(distDir, { recursive: true, force: true });

run("pnpm", ["--filter", "@workspace/scripts", "audit-static"]);

console.log(`Published static site to ${path.relative(root, docsDir)}.`);
