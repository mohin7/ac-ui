// Builds dist/lib/compat.css: the library's styles, precompiled and fenced in, for apps that still load the
// old Bulma/SCSS library. Those apps can't run the normal Tailwind setup because both stylesheets define the
// same class names with different meanings (old `mt-4` is `4px !important`, new `mt-4` is 16px), so here:
//   - utilities apply only inside new components and are `!important` in a cascade layer, which beats the old
//     unlayered `!important` rules;
//   - Tailwind's base styles (preflight) apply only inside new components, so old pages are untouched;
//   - outermost component roots get the Geist font and 20px line height, and a few old element rules are reset;
//   - keyframes are renamed `ac-*`, because the old CSS has its own `spin` and `pulse`.
// Components must follow the compat.css rules in CLAUDE.md (marked roots, no rem, no v-show with display utilities).
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { compile } from "@tailwindcss/node";
import { Scanner } from "@tailwindcss/oxide";
import postcss from "postcss";
import selectorParser from "postcss-selector-parser";

const root = resolve(import.meta.dirname, "..");
const lib = join(root, "src/lib");

// Every component root (and every teleported panel) carries data-ac-ds. Not data-testid: the old library uses
// "ac-…" test ids too, and an app's own data-testid would replace the component's.
const SCOPE = "[data-ac-ds], [data-ac-ds] *";
// Outermost component roots stand in for <html>/<body>; nested roots keep inheriting from their parent.
const OUTER_ROOT = "[data-ac-ds]:not([data-ac-ds] *)";
const PAGE_ELEMENTS = new Set(["html", "body", ":host"]);
// From the page rules, only the font and the 20px line height. Colour and size keep inheriting from the app.
const ROOT_PROPS = new Set([
  "font-family",
  "line-height",
  "font-feature-settings",
  "font-variation-settings",
  "-webkit-font-smoothing",
  "-moz-osx-font-smoothing",
  "text-rendering",
  "-webkit-text-size-adjust",
  "tab-size",
  "-webkit-tap-highlight-color",
]);
// The old stylesheet's body colour is a fixed #334155, the same as --color-body in light mode, so inheriting it is
// right there. It never changes for dark mode, so in dark the outermost roots take the token instead.
const DARK_ROOT = `:where(.dark, .is-dark-theme) ${OUTER_ROOT} { color: var(--color-body); }`;
// The old library styles some elements globally; inside components they go back to browser defaults.
// Bulma's `.block:not(:last-child)` margin hits Tailwind's `block` class; the same selector plus the scope outranks it.
const LEGACY_RESETS = `
.block:not(:last-child), .table:not(:last-child) { margin-bottom: 0; }
p { line-height: inherit; }
td, th { vertical-align: inherit; }
th, b, strong { color: inherit; }
code, kbd, samp, pre { background-color: transparent; color: inherit; }
`;

const input = `@import "tailwindcss" source(none) important;\n@import "./src/lib/theme.css";\n`;
const compiler = await compile(input, { base: root, onDependency() {} });
const scanner = new Scanner({ sources: [{ base: lib, pattern: "**/*", negated: false }] });
const tailwindCss = compiler.build(scanner.scan());

/** Appends `condition` to the subject (last compound) of every selector, before any pseudo-element. */
function fence(selector, condition) {
  return selectorParser((selectors) => {
    selectors.each((sel) => {
      if (sel.length === 1 && PAGE_ELEMENTS.has(String(sel.first).trim())) {
        sel.replaceWith(selectorParser().astSync(OUTER_ROOT).first);
        return;
      }
      const nodes = sel.nodes;
      let start = nodes.length;
      while (start > 0 && nodes[start - 1].type !== "combinator") start--;
      const compound = nodes.slice(start);
      const pseudoElement = compound.find((n) => n.type === "pseudo" && n.value.startsWith("::"));
      const fenceNode = selectorParser.pseudo({ value: condition.name, nodes: [selectorParser().astSync(condition.scope)] });
      if (pseudoElement) {
        // The pseudo-element's leading space would otherwise sit between it and the fence: a descendant combinator.
        fenceNode.spaces.before = pseudoElement.spaces.before;
        pseudoElement.spaces.before = "";
        sel.insertBefore(pseudoElement, fenceNode);
      } else sel.append(fenceNode);
    });
  }).processSync(selector);
}

const ast = postcss.parse(tailwindCss);
const renamed = new Map();

ast.walkAtRules((rule) => {
  if (rule.name === "layer" && !rule.nodes) {
    rule.remove(); // the `@layer theme, base, …` order statement
    return;
  }
  if (rule.name === "keyframes" && !rule.params.startsWith("ac-")) {
    renamed.set(rule.params, `ac-${rule.params}`);
    rule.params = `ac-${rule.params}`;
  }
});

ast.walkAtRules("layer", (layer) => {
  if (layer.params === "theme" || layer.params === "properties") {
    layer.replaceWith(layer.nodes); // custom properties stay global
  } else if (layer.params === "base") {
    layer.walkRules((rule) => {
      const isPage = rule.selector.split(",").every((part) => PAGE_ELEMENTS.has(part.trim()));
      rule.selector = fence(rule.selector, { name: ":is", scope: SCOPE });
      if (!isPage) return;
      rule.walkDecls((d) => {
        if (!ROOT_PROPS.has(d.prop)) d.remove();
      });
      if (!rule.nodes.length) rule.remove();
    });
    layer.replaceWith(layer.nodes);
  } else if (layer.params === "utilities") {
    layer.walkRules((rule) => {
      rule.selector = fence(rule.selector, { name: ":where", scope: SCOPE });
    });
    layer.params = "ac-compat";
  }
});

const resets = postcss.parse(LEGACY_RESETS);
resets.walkRules((rule) => {
  rule.selector = fence(rule.selector, { name: ":is", scope: SCOPE });
});
ast.prepend(resets.nodes);
ast.append(postcss.parse(DARK_ROOT).nodes);

if (renamed.size) {
  // Whole words only, so `var(--animate-spin)` keeps its name and only the keyframe reference changes.
  const names = new RegExp(`(?<![\\w-])(${[...renamed.keys()].join("|")})(?![\\w-])`, "g");
  ast.walkDecls(/^(animation(-name)?|--animate-.+)$/, (d) => {
    d.value = d.value.replace(names, (m) => renamed.get(m));
  });
}

const banner = `/*
 * @appscode/design-system compat.css
 * For apps that still load the old Bulma/SCSS design system. Import it after the old styles:
 *   import "@appscode/design-system/compat.css";   (or the name the app installed it under)
 * Styles apply only inside new components (elements marked data-ac-ds), so old pages don't change.
 * Apps that no longer load the old styles should use theme.css with Tailwind instead (see the README).
 */
`;
const out = join(root, "dist/lib/compat.css");
writeFileSync(out, banner + ast.toString());
console.log(`compat.css: ${(readFileSync(out).length / 1024).toFixed(0)} KB, keyframes renamed: ${[...renamed.keys()].join(", ") || "none"}`);
