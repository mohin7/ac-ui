# AppsCode Design System — Tailwind

The AppsCode design system as a Tailwind CSS v4 theme and Vue 3 components, with a documentation site.

```sh
npm install
npm run dev          # docs site at http://localhost:5173
npm run build        # regenerate API data, type-check, build the docs site into dist/
npm run build:lib    # build the publishable library into dist/lib (JS, .d.ts, theme.css)
```

## What's in it

- **58 components** (counting sub-parts), grouped as Element, Feedback, Form, Overlay, Layout, Navigation and Data. The docs sidebar lists them all.
- **Code editor:** `AcCodeEditor` (CodeMirror 6) for YAML, JSON and scripts, with syntax and JSON Schema checks and a changes view. It has its own entry, `@appscode/design-system/editor`, so apps that don't use it don't bundle CodeMirror.
- **Composables:** `useColorMode()` for light/dark/system, `useToast()` for notifications (mount `<AcToaster />` once).
- **Dark mode:** class-based. Put `.dark` on `<html>`; the old library's `.is-dark-theme` works too. Every token has a dark value, so components need no dark-specific code.
- **Icons:** `lucide-vue-next` first, Phosphor through unplugin-icons as fallback, simple-icons for brands. Components don't draw their own SVGs.

## Look and feel

Geist + Geist Mono (self-hosted via `@fontsource-variable/*`), AppsCode green brand scale, slate neutrals, 6px controls on 10px surfaces, soft layered shadows (`shadow-xs` … `shadow-xl`, `shadow-button`) and a `focus-ring` utility (primary border + soft halo) for form controls.

## Layout

```
src/
  lib/                      ← the design system
    theme.css               tokens as a Tailwind @theme, plus the dark theme
    components/             AcButton.vue, AcInput.vue, AcTable.vue, …
    editor/                 the editor entry, its CodeMirror theme and YAML/JSON Schema checks
    composables/            useColorMode.ts, useToast.ts
    index.ts                import { AcButton, useToast } from "@/lib"
  docs/                     ← the documentation site
    nav.ts                  every page: path, title, description, section
    pages/                  getting-started/, foundations/, components/, examples/
    examples/               one runnable .vue file per example (shown + copyable)
    components/             doc building blocks: ComponentPlayground, ComponentExample, ApiTables, CodeBlock…
    generated/              component-meta.json (written by scripts/gen-meta.mjs)
scripts/gen-meta.mjs        reads component types with vue-component-meta → API tables
scripts/copy-theme.mjs      ships theme.css with the library build
```

## Using the library build

`npm run build:lib` writes `dist/lib`. The package is `@appscode/design-system` 3.0.0-alpha, still `private` so it can't be published by accident. An app imports:

```ts
import { AcButton } from "@appscode/design-system";
import { AcCodeEditor } from "@appscode/design-system/editor";
```

```css
@import "tailwindcss";
@import "@appscode/design-system/theme.css";
```

`vue` and `lucide-vue-next` are peer dependencies. CodeMirror, Ajv and `yaml` are regular dependencies; they're only bundled by apps that import the editor.

## Adding or changing a component

1. Write it in `src/lib/components/AcThing.vue` with `<script setup lang="ts">`, typed props with a `/** JSDoc */` line each, and `defineSlots` / `defineEmits` types. Use theme tokens only (`bg-surface`, not `bg-white`) so it works in dark mode. Export it from `src/lib/components/index.ts`.
2. Add examples as files in `src/docs/examples/thing/*.vue`. Import from `@/lib`. The file is what the docs render and what readers copy.
3. Add `src/docs/pages/components/ThingPage.vue` (copy an existing page: Usage playground → Examples → Guidelines → Accessibility → `<ApiTables component="AcThing" />` → Theme) and register it in `src/docs/nav.ts`.
4. `npm run dev` regenerates the Props / Slots / Emits tables from your types.

See the site's Getting Started pages (Installation, Theming, Dark Mode, Migration) for using the library in an app.
