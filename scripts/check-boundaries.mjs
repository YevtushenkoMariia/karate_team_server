// Enforces the modular-monolith rules:
//   1. A module imports another module only through its public index.ts.
//   2. `shared/` never imports from `modules/`.
//   3. A module queries only the database tables it owns.
// Run: npm run check:boundaries
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..");
const srcDir = join(root, "src");
const modulesDir = join(srcDir, "modules");
const sharedDir = join(srcDir, "shared");

// Which module owns which Prisma model. Add new tables here when you add them.
const TABLE_OWNERS = {
  identity: ["users"],
  members: ["sportsmen", "coaches", "coach_sportsman"],
  groups: ["groups", "users_groups"],
  locations: ["cities", "clubs", "countries"],
};

function listFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? listFiles(path) : path.endsWith(".ts") ? [path] : [];
  });
}

function moduleOf(path) {
  const rel = relative(modulesDir, path);
  return rel.startsWith("..") ? null : rel.split(sep)[0];
}

const importPattern = /(?:import|export)[^'"]*?from\s*["']([^"']+)["']/g;
const tablePattern = /\b(?:db|tx)\.(\w+)\./g;
const errors = [];

for (const file of listFiles(srcDir)) {
  const source = readFileSync(file, "utf8");
  const fileModule = moduleOf(file);
  const where = relative(root, file);

  for (const [, specifier] of source.matchAll(importPattern)) {
    if (!specifier.startsWith(".")) continue;

    const target = resolve(dirname(file), specifier);
    const targetModule = moduleOf(target);

    if (file.startsWith(sharedDir) && targetModule) {
      errors.push(`${where}: shared code must not import from modules ("${specifier}")`);
    }

    if (targetModule && fileModule && targetModule !== fileModule) {
      const moduleRoot = join(modulesDir, targetModule);
      if (target !== moduleRoot && target !== join(moduleRoot, "index")) {
        errors.push(
          `${where}: import "${specifier}" reaches into module "${targetModule}" internals; import from "../${targetModule}" instead`,
        );
      }
    }
  }

  if (fileModule) {
    const owned = TABLE_OWNERS[fileModule] ?? [];
    for (const [, table] of source.matchAll(tablePattern)) {
      if (table.startsWith("$")) continue;
      if (!owned.includes(table)) {
        errors.push(
          `${where}: module "${fileModule}" queries table "${table}" it does not own; use the owning module's API`,
        );
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`Module boundary violations (${errors.length}):\n`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log("Module boundaries OK");
