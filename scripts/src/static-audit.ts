import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..", "..");
const sourceDir = path.join(root, "artifacts", "kawalees", "src");
const docsDir = path.join(root, "docs");

const forbiddenPatterns = [
  "/api/",
  "/login",
  "/register",
  "/dashboard",
  "/admin",
  "AuthProvider",
  "useAuth",
  "@tanstack/react-query",
  "@workspace/db",
  "api-server",
];

const ignoredDirs = new Set(["node_modules", ".git"]);
const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".md",
  ".svg",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);

async function collectFiles(dir: string): Promise<string[]> {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (ignoredDirs.has(entry.name)) return [];
          return collectFiles(fullPath);
        }
        if (!entry.isFile()) return [];
        return [fullPath];
      }),
    );
    return files.flat();
  } catch {
    return [];
  }
}

async function auditFile(filePath: string) {
  const ext = path.extname(filePath);
  if (!textExtensions.has(ext)) return [];

  const fileStat = await stat(filePath);
  if (fileStat.size > 2_000_000) return [];

  const content = await readFile(filePath, "utf8");
  return forbiddenPatterns
    .filter((pattern) => content.includes(pattern))
    .map((pattern) => ({
      pattern,
      file: path.relative(root, filePath),
    }));
}

const files = [...(await collectFiles(sourceDir)), ...(await collectFiles(docsDir))];
const findings = (await Promise.all(files.map(auditFile))).flat();

if (findings.length > 0) {
  console.error("Static audit failed. Remove API/auth/dashboard references:");
  for (const finding of findings) {
    console.error(`- ${finding.file}: ${finding.pattern}`);
  }
  process.exit(1);
}

console.log("Static audit passed.");
