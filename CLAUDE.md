# CLAUDE.md

The guide to this codebase for coding agents and for people. Read it before changing anything.

## Context

- **What this is:** the AppsCode design system, rebuilt on **Tailwind CSS v4 + Vue 3.5 + TypeScript 5.9**. It's a library of Vue components and a Tailwind theme, plus a documentation site that renders every component live.
- **What it replaces:** the old Bulma/SCSS library at `/home/mohin/go/src/go.bytebuilders.dev/design-system` (`@appscode/design-system` 2.x). The old components are in `src/components/vue-components/v3/` there, and the old styles in `.../styles/`.
- **Who uses it:** the AppsCode consoles in `/home/mohin/go/src/go.bytebuilders.dev/`: `cluster-ui`, `kubedb-ui`, `platform-ui`, `ui-modules` and `ui-wizards`. They import from the old library today.
  - Before changing or adding an API, grep their real usage, e.g. `grep -rn "SingleStepFormArray" cluster-ui/src`.
  - Read the old repo and the apps, but **never modify** them.
- **Package:** `@appscode/design-system` 3.0.0-alpha, `"private": true`. It has three entries:
  - `.`: components, composables and types.
  - `./editor`: `AcCodeEditor` and `AcFileEditor`, which pull in CodeMirror.
  - `./theme.css`: tokens for apps that run Tailwind v4.
  - `./compat.css`: precompiled, fenced-in styles for apps that still load the old Bulma/SCSS library. See "compat.css" below.
- **Status:** every component the apps import from the old library has a replacement. The docs' Migration page (`src/docs/pages/getting-started/MigrationPage.vue`) holds the old → new mapping, about 115 rows.
  - Not ported, on purpose: MachineProfile, ScalingRules, NodeSelection, Inbox, ConfigSecret, and the recovery timeline charts.

## Commands

```sh
npm run dev          # gen API data, then docs at http://localhost:5173 (.claude/launch.json "dev")
npm run type-check   # vue-tsc --build --force — must be clean
npm run meta         # regenerate src/docs/generated/component-meta.json (API tables)
npm run build        # meta + type-check + docs build into dist/
npm run build:lib    # library into dist/lib (ES modules, .d.ts, theme.css, compat.css)
```

There are no tests, ESLint or Prettier config yet. The bar for every change:

- type-check is clean;
- `npm run build` and `npm run build:lib` pass;
- the change looks right in **light, dark, and a 375px phone width**, with no console errors.

## Layout

```
src/lib/                      published library: only this goes into dist/lib
  theme.css                   Tailwind @theme tokens, the dark block, @utility rules, keyframes
  index.ts                    main entry: export * from components, composables, and public types
  components/AcX.vue          one component per file (sub-parts too: AcDropdownItem, AcSidebarItem…)
  components/index.ts         `export { default as AcX } from "./AcX.vue"`, sorted; NOT the editor components
  components/types.ts         shared types: Tone, Variant, Option, SelectOption
  editor/index.ts             the /editor entry (AcCodeEditor, AcFileEditor, their types)
  editor/theme.ts, validate.ts CodeMirror theme and YAML/JSON Schema checks
  composables/                useColorMode, useToast, useBrandColor
src/docs/                     the docs site (never published)
  nav.ts                      every page: { path, title, description, section, group?, component?, importFrom?, load }
  pages/<section>/XPage.vue   one page per nav entry
  examples/<slug>/Name.vue    one runnable example per file; the docs render it and show its source
  snippets/<page>/*.txt       code samples shown on pages, imported with ?raw
  components/                 ComponentPlayground, ComponentExample, ApiTables, DoDont, Callout, DocHeading, CodeBlock, InlineMd
  layout/                     header, sidebar, TOC, search, page header
  generated/component-meta.json   written by scripts/gen-meta.mjs — never edit by hand
scripts/gen-meta.mjs          vue-component-meta over src/lib/components/*.vue → API tables
scripts/build-compat.mjs      builds dist/lib/compat.css (see "compat.css")
vite.lib.config.ts            library build: entries index + editor/index, preserveModules, externals
```

## Architecture decisions

- **Tokens:** they live in `theme.css` as a Tailwind `@theme` with the defaults cleared (`--color-*: initial`), so only AppsCode values exist. Utilities come from them: `bg-surface`, `text-muted`, `rounded-10`, `shadow-md`.
- **Dark mode:** an unlayered `.dark, .is-dark-theme { … }` block redefines the tokens.
  - Steps 5–70 of each scale are mirrored, and 80–97 become translucent washes.
  - Semantic aliases are redeclared so a `.dark` subtree works too.
  - The variant is `@custom-variant dark (&:where(.dark, .dark *, .is-dark-theme, .is-dark-theme *))`.
  - Components get dark mode for free; `dark:` is rarely needed.
- **Brand hue:** set at runtime by `--primary-hue`, `--primary-saturation` and `--primary-light` on `:root`. `useBrandColor()` writes them. The logo's `brand-navy` and `brand-green` are fixed and never re-hued.
- **Tailwind only emits theme variables it finds in the source.** A var built at runtime, like `` `var(--color-${x})` ``, is stripped. Write the full name, `"var(--color-blue-40)"`. That's why `editor/theme.ts` spells out every variable.
- **`@source "./components"` and `@source "./editor"`** in theme.css make the app's Tailwind scan the shipped component files. The library build uses `preserveModules` so the class names stay greppable.
- **No vue-router dependency.** Components that take `to` look up `RouterLink` at runtime: `getCurrentInstance()?.appContext.components.RouterLink`. See `AcBreadcrumb.vue`.
- **CodeMirror stays out of the main entry:**
  - Only `editor/index.ts` imports `AcCodeEditor` and `AcFileEditor`.
  - Others load it with `import("../editor")` inside `defineAsyncComponent`, as `AcCellValue` does.
  - Heavy parts load on first use: the diff (`@codemirror/merge`), the YAML parser and Ajv.
  - Docs example folders named `*-editor/` are lazy-loaded by `ComponentExample.vue`.
- **Externals** in the library build: `vue`, `vue-router`, `lucide-vue-next`, `ajv`, `yaml`, `@codemirror/*` and `@lezer/*`. Two copies of `@codemirror/state` break CodeMirror.
- **Old-library compatibility where it's cheap:**
  - the `.is-dark-theme` class and the `themeMode` localStorage key;
  - the `themeColor` key and the `HexToHSL` / `setThemeHSL` / `getThemeHSL` names;
  - `AcDeleteConfirmationModal` as an alias;
  - old prop names where they're reasonable.

## compat.css

The AppsCode apps load the old Bulma/SCSS library globally, and it defines the same class names with other meanings: `mt-4` is `4px !important` there. `scripts/build-compat.mjs` compiles the library's Tailwind CSS and fences it in:

- **Scope:** every utility and base rule only matches elements under a `[data-testid^="ac-"]` root.
- **Specificity:** utilities are `!important` inside `@layer ac-compat`, which beats the old unlayered `!important`.
- **Roots:** outermost roots get the Geist font and the 20px line height, plus the body colour in dark mode only.
- **Resets:** a few old element rules (`p`, `td`/`th`, `strong`, `code`, Bulma's `.block` margin) are reset inside components.
- **Keyframes:** renamed `ac-*`, so they don't clash with the old `spin` and `pulse`.

It was checked in kubedb-ui: old markup is pixel-identical with and without it. The docs page `getting-started/existing-apps` is the user guide.

Every component must keep these rules, or it breaks inside the old apps:

- **Mark every root**, including each element that is the first child of a `<Teleport>`, with `data-testid="ac-…"`. That marker is the scope.
- **No `rem` in component styles.** Use px, and arbitrary values like `max-w-[320px]`. The old apps set `html { font-size: 13px }`, so rem values shrink by a fifth there. Container sizes are already px in theme.css.
- **No `v-show` on an element with a display utility** (`flex`, `grid`, `block`…). Under compat the `!important` utility beats `v-show`'s inline `display: none`. Toggle classes instead: `:class="open ? 'flex' : 'hidden'"`.
- **No inline `:style` for a property a utility on the same element also sets** (e.g. `w-full` with a `width` style). The `!important` utility would win.
- **State alignment explicitly** on `th` (`text-left`) and other elements where the old CSS changes the browser default.

## Component pattern

Every component is `src/lib/components/AcX.vue`, written as `<script setup lang="ts">`. Never use the Options API.

**Script order:**

1. Imports: `vue`, then third-party (`lucide-vue-next`, `@codemirror/*`), then local components, then composables, with `import type` last.
2. Local types.
3. `export interface Props`.
4. `withDefaults(defineProps<Props>(), {…})`.
5. `defineModel`.
6. `defineEmits<{ name: [payload] }>()`.
7. `defineSlots<{…}>()`.
8. Constants, composables, state, computed, functions (as `function` declarations), watchers, lifecycle hooks, `defineExpose`.

```vue
<script setup lang="ts">
import { computed, useId } from "vue";
import { X } from "lucide-vue-next";

export interface Props {
  /** Text shown above the field. Doubles as the accessible name. */
  label?: string;
  /** Height: `small` 28px or `normal` 32px. */
  size?: "small" | "normal";
}

const props = withDefaults(defineProps<Props>(), { label: "", size: "normal" });
const model = defineModel<string>({ default: "" });
const emit = defineEmits<{
  /** Fires when the viewer clears the value. */
  clear: [];
}>();
defineSlots<{
  /** Content after the value, e.g. a unit. */
  suffix?: () => unknown;
}>();
</script>

<template>
  <div data-testid="ac-thing">…</div>
</template>
```

**Rules:**

- **Props:**
  - Every prop gets a one-line JSDoc written for app developers. It becomes the API table, so say what the prop does and give its values.
  - Name the old library's prop when it's renamed, e.g. "Old `is-loader-active`."
- **Types:** put public data shapes in the component file as `export interface` (e.g. `BreadcrumbItem`, `SideTabItem`), then re-export them as types from `src/lib/index.ts`.
- **v-model:** use `defineModel`, including named models: `v-model:open`, `v-model:view`, `v-model:files`.
- **Root element:** every component's root carries `data-testid="ac-<kebab-name>"`.
- **Form controls:**
  - Use `defineOptions({ inheritAttrs: false })`.
  - Split `useAttrs()`: `class` and `style` go on the wrapper, everything else on the real `<input>` or `<button>`.
  - Expose `focus()`.
  - See `AcInput.vue`.
- **Overlays:**
  - Render with `<Teleport to="body">`.
  - Position with `position: fixed`, computed from the trigger's `getBoundingClientRect()`, and flip when there's no room. See `AcSelect.vue`.
  - Z-index scale: menus and popovers `z-[90]`; modals and side panels `z-[80]`; toasts and tooltips `z-[100]`. Don't invent new levels.
- **Escape:** a child that handles Escape (a select, menu or editor) calls `preventDefault()`. `AcModal` and `AcSidePanel` ignore an Escape whose `defaultPrevented` is set.
- **Icons:**
  - Use `lucide-vue-next` only, with an icon prop typed as `Component`.
  - Size icons with `class="size-4"`, and add `aria-hidden="true"` when they're decorative.
  - Fallback order is Lucide, then Phosphor (via unplugin-icons), then simple-icons for brands. Never add a fourth icon set.
  - Never hand-draw SVG icons; `AcLogo` is the only inline SVG, because it's a brand asset.
- **Accessibility:**
  - Follow the WAI-ARIA pattern for the widget: listbox, combobox, menu, dialog, slider or grid.
  - Support the full keyboard, keep focus visible, and return focus after a popover closes.
  - Icon-only buttons need an `aria-label`.
  - Honour `prefers-reduced-motion` with `motion-reduce:transition-none` on anything bigger than a fade.
- **No app-only dependencies:** no router, store or HTTP client.
- **Comments:** only for the *why*, in one short line. See Code comments below.

## Styling rules

- **Use theme tokens only:**
  - Text: `text-heading`, `text-body`, `text-label`, `text-muted`.
  - Borders: `border-border`, `border-border-light`, `border-border-dark`.
  - Surfaces: `bg-surface`, `bg-surface-muted`, `bg-surface-sunken`.
  - Backdrops: `bg-overlay`.
  - Scales: `primary`, `secondary`, `green`, `blue`, `yellow`, `red`, `purple`, `gray` and `slate`, each `-5` to `-97`.
  - Status: `success`, `info`, `warning`, `danger`, plus `-hover` and `text-on-warning`.
- **Type scale** (note that `sm` is smaller than `xs`):

  | class | size |
  | --- | --- |
  | `text-xm` | 10px |
  | `text-sm` | 11px |
  | `text-xs` | 12px |
  | `text-base` | 13px (body) |
  | `text-lg` | 14px |
  | `text-xl` | 16px |
  | `text-2xl` | 18px |
  | `text-3xl` | 24px |

- **Shape and space:**
  - Controls get `rounded-6`, surfaces `rounded-10`, pills `rounded-50` or `rounded-full`.
  - Shadows run `shadow-xs` to `shadow-xl`, plus `shadow-button`.
  - The spacing unit is 4px (`p-4` = 16px).
- **Focus:** fields use `focus:focus-ring` (or `focus-within:focus-ring` on a wrapper). Buttons use `focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring`.
- **Utilities:** `focus-ring`, `text-code` and `ac-scrollbar`, all defined in theme.css.
- **Fonts:** Geist for the interface, and Geist Mono (`font-mono`) for code, IDs, versions and resource names.
- **Status fills:** solid fills keep white text, except warning, which uses `text-on-warning`.

## Docs pattern

Each component page is `src/docs/pages/components/XPage.vue`, registered in `nav.ts`. The layout renders the title, description and import chip, so the page starts at Usage.

**Section order:**

1. **Usage:** one or two sentences on when to use it, then a `ComponentPlayground` (`tag`, `component`, `controls`, `initial`, `defaults`, `extra`).
2. **Examples:** an `<DocHeading id :level="3">` subsection for each, with `<ComponentExample name="<slug>/<Name>" />`.
3. **Guidelines:** `<DoDont :dos :donts>`. Its strings render `` `code` ``.
4. **Accessibility:** a list, plus a keyboard table when there are keys.
5. **Migration** (when it replaces an old component): an old → new table.
6. **API:** `<ApiTables component="AcX" />`, which comes from `component-meta.json`.
7. **Theme:** a table of the key classes and what they're used for.

**Pages:**

- **Imports:** a component outside the main entry sets `importFrom` in `nav.ts` and `import-from` on the playground, e.g. `"@/lib/editor"`.
- **Inline code:** in prose, use `<code class="prose-code">`, and escape `<` as `&lt;`.
- **Code samples:** a sample with `import` lines or a `<script>` tag goes in `src/docs/snippets/<page>/<name>.txt`, imported with `?raw`. Vite's dependency scanner reads those lines inside a JS string as real imports, and a failed scan makes the dev server reload pages.
- **Heading ids:** keep them unique on a page, or the table of contents breaks.

**Examples:**

- Examples are real SFCs that import from `"@/lib"` (or `"@/lib/editor"`).
- The file is exactly what readers copy, so keep it short and idiomatic.
- Use realistic AppsCode data: Postgres/MongoDB/Redis databases, clusters such as `demo-cluster`, namespaces like `demo`, Stash backups, KubeDB versions.

**New nav groups:** they appear in the order of first use in `nav.ts`. Current groups are Element, Feedback, Form, Overlay, Layout, Navigation, Data and Cards.

## Writing style

Docs, JSDoc, labels and messages all use this voice:

- **Plain and short.**
  - One idea per sentence. Lead with what the reader can do or what happens.
  - Use second person or the imperative: "Pass the saved version as `original`…", "Use it for…".
- **Precise:**
  - Name the prop and the real value.
  - Give numbers: "320px", "about 135 KB gzipped", "below 640px".
  - Don't say "various", "seamless", "robust", "powerful" or "simply".
- **Sentence case** for headings, buttons and labels: "Reviewing changes", "Import cluster", "Delete database".
- **JSDoc** says what the prop does for the app, not how it's implemented. One line: "Shows only the icons; each option's `label` becomes its accessible name."
- **Guidelines:** each Do/Don't is one actionable sentence with the reason.
- **UI copy:**
  - Error messages say what's wrong and how to fix it: "spec.replicas: must be integer", not "Invalid input".
  - Empty states say what's missing and what to do next.
- **Spelling:** code and props use US spelling (`color`). Prose so far uses British spelling (colour, organisation); keep a page consistent.
- **Formatting:**
  - Don't use emoji in UI or docs.
  - Don't stack marketing adjectives.
  - Don't nest bullets more than once.

## Adding a component, step by step

1. Grep the old component and its usage in the apps. Keep old prop names where they're reasonable, and note each rename.
2. Write `src/lib/components/AcX.vue`, following the component pattern above.
3. Export the component from `src/lib/components/index.ts` (sorted) and its public types from `src/lib/index.ts`. Editor components go in `src/lib/editor/index.ts` instead.
4. Add examples in `src/docs/examples/<slug>/`, the page in `src/docs/pages/components/`, and the entry in `nav.ts`.
5. Add Migration page rows (`["AcX", 'old usage', 'new usage']`) in `MigrationPage.vue`.
6. Run `npm run meta && npm run type-check`.
7. Check the page in light, dark and at 375px with no console errors. Check the component against the compat.css rules too. Drive interactive states: open menus, keyboard, focus return.
8. Run `npm run build && npm run build:lib`. On a component-API change, bump `version` in `package.json`, because the apps pin versions.

Browser checks can use headless Chrome when the browser pane isn't visible:

```sh
google-chrome --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=4000 \
  --window-size=1440,2600 --screenshot=/tmp/shot.png "http://localhost:5173/#/components/<slug>"
```

Add `--force-dark-mode` for dark (the docs follow the system theme), or use `--window-size=375,2400` for a phone. For interactions, drive the page over the Chrome DevTools protocol.

## Don't

- **Colours:**
  - Don't use `bg-white`, hex colours, `rgb()` or Tailwind's default palette names in components. Use tokens.
  - The only fixed colours are `brand-navy` and `brand-green`, used only by the logo.
- **Dark mode:**
  - Don't add `dark:` variants to fix contrast; fix the token, or use the semantic one.
  - Don't remount components on theme change (`:key="theme"`).
- **Tokens:** don't rename or remove theme tokens or utilities; the apps depend on them. Add new ones in `theme.css`, with dark values, when truly needed.
- **Dependencies and imports:**
  - Don't add npm dependencies without a strong reason; dates use native `Date` and `Intl`.
  - Never import `vue-router` in `src/lib`.
  - Don't import `AcCodeEditor`, `AcFileEditor` or `@codemirror/*` statically from anything the main entry exports.
  - Don't put docs-only packages (shiki and the like) in `dependencies`.
- **Generated files:**
  - Don't edit `src/docs/generated/component-meta.json`; run `npm run meta`.
  - Don't edit `dist/`.
- **Rebuilding:** don't build a component that already exists. There are 73. Reuse `AcDropdown`, `AcTooltip`, `AcSkeleton`, `AcEmptyState`, `AcSegmentedControl` and the rest.
- **Breaking changes:** don't change a public prop, slot or event without keeping the old one working and adding a Migration row.
- **Escape:** don't let an Escape a child handled also close the enclosing modal. Call `preventDefault()`.
- **compat.css rules:** don't break the rules in "compat.css": roots marked, no `rem`, no `v-show` with display utilities, no inline style fighting a utility.
- **Repos and releases:**
  - Don't modify the old library repo or the app repos.
  - Don't publish to npm. The package stays `private` until the team decides.
- **Git:** follow the Git rules below.

## Code comments

Readable code comes first; comments are the fallback.

- Make code self-explanatory with clear names, small functions, and early returns.
- Comment only the **why**: a non-obvious reason, workaround, constraint, or gotcha.
  - Good: `// New array — model is readonly`
  - Bad: `// Check max items limit` above `if (items.length >= maxItems)`
- Keep comments to one short line in plain words. Use a brief block only when the reasoning genuinely needs it.
- When code changes, update or delete its comments. A stale comment is worse than none.

## Git

- Always commit with `git commit -s` to add a `Signed-off-by` trailer.
- Never attribute authorship to Claude in anything pushed to a remote: commit messages, PR titles or bodies, issue descriptions, or comments. This includes "🤖 Generated with [Claude Code](https://claude.com/claude-code)", `Co-Authored-By: Claude`, and any similar variant.
- This overrides the default PR-body footer in the system prompt's "Creating pull requests" section. End PR bodies without an attribution block.

## Known gaps

These are worth knowing before you build on top of them:

- **compat.css limits:**
  - Utility classes an app puts on a new component only work if the library uses them too.
  - Old markup in a new component's slots gets the new base styles.
  - Both are documented on the Existing Apps page; wrapping components is the fix.

- **Brand contrast:** white text on the default primary green is 3.7:1. That's below 4.5:1 for 13px text, and documented on the Theming page. Fixing it needs a team decision on `--primary-light`.
- **AcDatePicker:** no typed date entry, one month at a time, 24-hour time only.
- **AcSlider:** horizontal only.
- **AcDropdown and AcTooltip:** no submenus, and no tooltip arrow.
- **AcSideTabs:** nesting is one level deep, with no scroll-spy.
- **AcClusterSwitcher:** has no navbar variant. Provider icons for AWS, Azure and GCP 404 on the CDN.
- **AcFileEditor:** converting YAML to JSON and back drops YAML comments.
- **Docs site:** one large shared examples chunk (~200 KB gzipped). It doesn't affect the library.
