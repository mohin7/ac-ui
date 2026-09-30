// Reads every component in src/lib/components with vue-component-meta and writes
// src/docs/generated/component-meta.json — the source of the docs' Props/Slots/Emits tables.
import { createChecker } from "vue-component-meta";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dir = join(root, "src/lib/components");
const checker = createChecker(join(root, "tsconfig.app.json"), { forceUseTs: true, printer: { newLine: 1 } });

// Expand simple aliases from types.ts (Tone, Variant) so the tables show the real values.
const aliases = Object.fromEntries(
  [...readFileSync(join(dir, "types.ts"), "utf8").matchAll(/export type (\w+) = ([^;]+);/g)].map((m) => [m[1], m[2].trim()]),
);
const expand = (t) => t.replace(/\b([A-Z]\w*)\b/g, (name) => aliases[name] ?? name);
const clean = (t) => expand((t ?? "").replace(/\s+/g, " ").trim());
const out = {};

for (const file of readdirSync(dir).filter((f) => f.endsWith(".vue")).sort()) {
  const meta = checker.getComponentMeta(join(dir, file));
  const name = file.replace(/\.vue$/, "");
  out[name] = {
    props: meta.props
      .filter((p) => !p.global)
      .map((p) => ({
        name: p.name,
        type: clean(p.type),
        default: p.default ? clean(p.default) : undefined,
        required: p.required,
        description: p.description,
      })),
    events: meta.events.map((e) => ({ name: e.name, type: clean(e.type), signature: clean(e.signature) })),
    slots: meta.slots.map((s) => ({ name: s.name, type: clean(s.type), description: s.description })),
  };
}

writeFileSync(join(root, "src/docs/generated/component-meta.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`component-meta: ${Object.keys(out).length} components`);
