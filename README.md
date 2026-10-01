# AppsCode Design System

The design system for every AppsCode console (cluster-ui, kubedb-ui, platform-ui, billing, marketplace…): a **Tailwind CSS v4 theme** and **Vue 3 components**, with a documentation site that shows every component live.

It replaces the old Bulma/SCSS library (`@appscode/design-system` 2.x). Every component the apps import from the old library has a replacement here, and the docs' Migration page maps the old props to the new ones.

```sh
npm install
npm run dev          # docs site at http://localhost:5173
```

## What's in it

| | |
| --- | --- |
| **Theme** | `src/lib/theme.css`: colour scales, semantic tokens (text, borders, surfaces), type scale, radii, shadows and a full dark theme, as a Tailwind `@theme`. |
| **Components** | 73 Vue components (counting sub-parts) in eight groups, listed below. |
| **Editors** | `AcCodeEditor` and `AcFileEditor` on CodeMirror 6, in a separate entry so other apps don't bundle CodeMirror. |
| **Composables** | `useColorMode()` (light/dark/system), `useToast()` (notifications), `useBrandColor()` (re-hue the brand at runtime). |
| **Logo** | `AcLogo`: the AppsCode logo and mark as inline SVG that follows dark mode. |
| **Docs site** | Getting started, foundations, a page per component (live playground, examples, guidelines, accessibility, API tables) and full example pages. |

### Components

| Group | Components |
| --- | --- |
| Element | Button, Button Group, Badge, Tag, Avatar, Alert, Banner, Card, Divider, Kbd |
| Feedback | Spinner, Preloader, Skeleton, Progress, Toast, Empty State |
| Form | Input, Textarea, Code Editor, File Editor, Select, CheckBox, CheckRadio, Switch, Search Bar, File Upload, Slider, Date Picker, Form, Form Array, Theme Mode |
| Overlay | Modal, Delete Modal, Side Panel, Dropdown, Tooltip |
| Layout | Sidebar, Navbar, Header, Content Table, Section, Accordion, Status Bar |
| Navigation | Breadcrumb, Tabs, Steps, Pagination, Side Tabs, App Switcher, Cluster Switcher, Notifications |
| Data | Table, Info Table, Cell Value |
| Cards | Stat Card, Feature Card, Resource Card, Usage Card |

Example pages put them together: a database list, a database detail page, a create wizard, settings, empty and error states, and a full app shell.

## Look and feel

- **Type:** Geist for the interface and Geist Mono for code and resource names, on a 13px base.
- **Colour:** the AppsCode green brand scale and slate neutrals. Status colours are green, blue, yellow and red.
- **Shape:** 6px radius on controls and 10px on surfaces, with soft layered shadows from `shadow-xs` to `shadow-xl`.
- **Focus:** a `focus-ring` utility (primary border and a soft halo) on form fields.
- **Dark mode:** class-based. Every token has a dark value, so components need no dark-specific code.
- **Icons:** [Lucide](https://lucide.dev) (`lucide-vue-next`). Components never draw their own SVG icons.

## Using it in an app

The package is `@appscode/design-system` **3.0.0-alpha**, still marked `private` so it can't be published by accident. `npm run build:lib` writes it to `dist/lib`, and `npm pack` makes an installable tarball.

There are two ways to load the styles:

| The app… | Load | Tailwind in the app |
| --- | --- | --- |
| still loads the old Bulma/SCSS design system (cluster-ui, kubedb-ui, platform-ui…) | `compat.css` | No |
| doesn't load the old styles (new apps, or after migrating) | `theme.css` with Tailwind v4 | Yes |

### In an app that still loads the old styles

The docs page **Getting Started → Existing Apps** has the full guide. In short:

```sh
# installed next to the old 2.x package, under a second name
npm install @appscode/ds-next@npm:@appscode/design-system@3.0.0-alpha.2 lucide-vue-next
```

```ts
// main.ts (Vite), or the `css` list in nuxt.config.ts: after the old styles
import "./assets/styles/scss/main.scss";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "@appscode/ds-next/compat.css";
```

- **`compat.css`** is the library's styles, precompiled and fenced in: they apply only inside new components, and win over the old `!important` utilities there. Old pages don't change; this was checked pixel by pixel in kubedb-ui.
- **Don't put utility classes on new components** while both are loaded. Wrap the component in your own element for spacing.

### In an app without the old styles

```ts
// main.ts: fonts once
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
```

```css
/* your main CSS file */
@import "tailwindcss";
@import "@appscode/design-system/theme.css";
```

### Either way

```ts
import { AcButton, AcInput, useToast } from "@appscode/design-system";
import { AcCodeEditor, AcFileEditor } from "@appscode/design-system/editor";
```

- **Requirements:** Vue 3.5+, Vite 5+ or Nuxt 3+, and TypeScript with `moduleResolution: "bundler"`. Every component renders on the server, so Nuxt SSR works.
- **Peer dependencies:** `vue` ^3.5 and `lucide-vue-next` ^1.0. CodeMirror, Ajv and `yaml` are regular dependencies, bundled only by apps that import from `/editor`.
- **Dark mode:** put `.dark` on `<html>` (the old `.is-dark-theme` class works too), or call `useColorMode().setMode("dark" | "light" | "system")`. The user's choice is saved under the old `themeMode` localStorage key.
- **Toasts:** mount `<AcToaster />` once near the root, then call `useToast().success("Saved")` anywhere.
- **Brand colour:** `useBrandColor().setColor("#0066cc")` re-hues the primary scale. The old `HexToHSL`, `setThemeHSL` and `getThemeHSL` helpers are exported under the same names.
- **Router links:** components with `to` props use vue-router's `RouterLink` when the app registers it. The library itself doesn't depend on vue-router.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Regenerates the API data, then starts the docs site at http://localhost:5173 |
| `npm run build` | Regenerates the API data, type-checks, and builds the docs site into `dist/` |
| `npm run build:lib` | Builds the library into `dist/lib`: ES modules, `.d.ts` files, `theme.css` and `compat.css` |
| `npm run type-check` | `vue-tsc` over the whole project |
| `npm run meta` | Regenerates `src/docs/generated/component-meta.json` (the API tables) from the components' types |

There is no test runner, ESLint or Prettier config yet. Type-check and both builds must pass, and changes are checked in the browser in light, dark and phone widths.

## Project layout

```
src/
  lib/                        the design system (what gets published)
    theme.css                 tokens as a Tailwind @theme, the dark theme, utilities and keyframes
    index.ts                  main entry: every component, composable and public type
    components/               AcButton.vue, AcInput.vue, … one file per component (sub-parts too)
      index.ts                component exports, sorted
      types.ts                shared types (Tone, Variant, Option, SelectOption)
    editor/                   the /editor entry: index.ts, CodeMirror theme, YAML/JSON Schema checks
    composables/              useColorMode.ts, useToast.ts, useBrandColor.ts
  docs/                       the documentation site
    nav.ts                    every page: path, title, description, section, group, component
    router.ts                 hash router built from nav.ts
    pages/                    getting-started/, foundations/, components/, examples/
    examples/<slug>/*.vue     one runnable file per example, shown live with its source
    snippets/<page>/*.txt     code samples shown on pages, loaded with ?raw
    components/               doc building blocks: ComponentPlayground, ComponentExample, ApiTables, DoDont…
    layout/                   header, sidebar, table of contents, search
    generated/                component-meta.json, written by scripts/gen-meta.mjs (don't edit)
scripts/
  gen-meta.mjs                reads component types with vue-component-meta → API tables
  copy-theme.mjs              ships theme.css with the library build
  build-compat.mjs            builds compat.css for apps that still load the old styles
public/                       favicon, logos
vite.config.ts                docs site
vite.lib.config.ts            library build (two entries: index and editor/index)
```

## Contributing

Read [CLAUDE.md](CLAUDE.md) first. It's the full guide to the codebase, written for people and coding agents alike: context, structure, component and docs patterns, the writing style, and what not to do.

The short version for a new component:

1. Write `src/lib/components/AcThing.vue` with `<script setup lang="ts">`, a JSDoc line on every prop, and theme tokens only. Export it from `src/lib/components/index.ts`, and its public types from `src/lib/index.ts`.
2. Add examples as files in `src/docs/examples/thing/`, importing from `@/lib`.
3. Add `src/docs/pages/components/ThingPage.vue` and register it in `src/docs/nav.ts`.
4. Run `npm run dev`. The API tables regenerate from your types.
5. Add old → new rows to the Migration page if it replaces something from the old library.
6. Check light, dark and a 375px phone width, then run `npm run build` and `npm run build:lib`.

Commit with `git commit -s`.
