# AppsCode Design System — Tailwind

The AppsCode design system as a Tailwind CSS v4 theme and Vue 3 components, with a documentation site.

```sh
npm install
npm run dev        # docs site at http://localhost:5173
npm run build      # regenerate API data, type-check, build dist/
```

## Look and feel (v0.2)

Geist + Geist Mono (self-hosted via `@fontsource-variable/*`), AppsCode green brand scale, slate neutrals, 6px controls on 10px surfaces, soft layered shadows (`shadow-xs` … `shadow-xl`, `shadow-button`) and a `focus-ring` utility (primary border + soft halo) for form controls.

## Layout

```
src/
  lib/                      ← the design system (copy this into apps)
    theme.css               tokens as a Tailwind @theme
    components/             AcButton.vue, AcInput.vue, AcTable.vue, …
    index.ts                import { AcButton } from "@/lib"
  docs/                     ← the documentation site
    nav.ts                  every page: path, title, description, section
    pages/                  getting-started/, foundations/, components/, examples/
    examples/               one runnable .vue file per example (shown + copyable)
    components/             doc building blocks: ComponentPlayground, ComponentExample, ApiTables, CodeBlock…
    generated/              component-meta.json (written by scripts/gen-meta.mjs)
scripts/gen-meta.mjs        reads component types with vue-component-meta → API tables
```

## Adding or changing a component

1. Write it in `src/lib/components/AcThing.vue` with `<script setup lang="ts">`, typed props with a `/** JSDoc */` line each, and `defineSlots` / `defineEmits` types. Export it from `src/lib/components/index.ts`.
2. Add examples as files in `src/docs/examples/thing/*.vue`. Import from `@/lib` — the file is what the docs render and what readers copy.
3. Add `src/docs/pages/components/ThingPage.vue` (copy an existing page: Usage playground → Examples → Guidelines → Accessibility → `<ApiTables component="AcThing" />` → Theme) and register it in `src/docs/nav.ts`.
4. `npm run dev` regenerates the Props / Slots / Emits tables from your types.

See the site's Getting Started → Installation, Theming and Migration pages for using the library in an app.
