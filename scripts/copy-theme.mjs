// Ships theme.css next to the built components. Its `@source "./components"` then points at
// dist/lib/components, so the consumer's Tailwind picks up the classes the components use.
import { copyFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
copyFileSync(join(root, "src/lib/theme.css"), join(root, "dist/lib/theme.css"));
console.log("theme.css copied to dist/lib");
