<script setup lang="ts">
import { Database } from "@lucide/vue";
import { AcAlert, AcBadge, AcButton, AcInput, AcSwitch } from "@/lib";
import Callout from "../../components/Callout.vue";
import CodeBlock from "../../components/CodeBlock.vue";
import DocHeading from "../../components/DocHeading.vue";
import DoDont from "../../components/DoDont.vue";
import setup from "../../snippets/dark-mode/setup.txt?raw";
import composable from "../../snippets/dark-mode/composable.txt?raw";

const noFlash = `<!-- index.html, inside <head>: apply the saved theme before the first paint -->
<script>
  try {
    const m = localStorage.getItem("themeMode");
    const dark = m === "dark" || (m === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
    if (dark) document.documentElement.classList.add("dark", "is-dark-theme");
  } catch {}
<\/script>`;

const variant = `<!-- Only for things tokens can't express, such as swapping a logo -->
<img src="/logo.svg" class="dark:hidden" alt="AppsCode" />
<img src="/logo-white.svg" class="hidden dark:block" alt="AppsCode" />`;

const rows = [
  ["text-heading · text-body · text-muted", "Slate 5 / 30 / 50", "Mirrored: near-white, light and mid slate"],
  ["bg-surface · bg-surface-muted", "White · slate 95", "#0c1220 · #111827"],
  ["border-border · border-border-light", "Slate 80 · 90", "Dark slate hairlines"],
  ["bg-primary · bg-danger …", "Brand and status fills", "Unchanged, so white text on them stays readable"],
  ["text-*-10 … -70", "Dark → light steps", "Mirrored: -10 is light text, -70 is dark"],
  ["bg-*-80 … -97", "Pale tints", "Translucent washes of the hue over the dark surface"],
  ["shadow-*", "Slate-tinted", "Deeper black shadows; shadow-xl adds a faint outline"],
  ["bg-overlay", "Slate at 40%", "Black at 60%"],
];

const dos = [
  "Build with tokens (bg-surface, text-heading, border-border) and dark mode comes for free.",
  "Check new screens in both themes before shipping.",
];
const donts = [
  "Don't use bg-white or hex colours: they stay light in dark mode. Use bg-surface.",
  "Don't reach for dark: overrides to fix a colour; pick the right token instead.",
];
</script>

<template>
  <DocHeading id="how-it-works">How it works</DocHeading>
  <p>
    Dark mode is a class on <code class="prose-code">&lt;html&gt;</code>. When <code class="prose-code">.dark</code> is present,
    the theme swaps the values behind every colour token, so the same classes — <code class="prose-code">bg-surface</code>,
    <code class="prose-code">text-heading</code>, <code class="prose-code">bg-red-95</code> — render correctly in both themes.
    Components have no dark-specific code.
  </p>
  <p>
    The old library's class, <code class="prose-code">.is-dark-theme</code>, works too and is set alongside
    <code class="prose-code">.dark</code>, so pages that still use old styles follow the same switch during migration.
  </p>

  <div class="dark my-6 rounded-12 border border-border bg-surface p-5 shadow-xs">
    <p class="mb-4 text-xs font-medium tracking-wide text-muted uppercase">Always-dark preview</p>
    <div class="grid gap-4 sm:grid-cols-2">
      <div class="space-y-3">
        <AcAlert color="warning">cache-redis has no recent backup.</AcAlert>
        <div class="flex flex-wrap items-center gap-2">
          <AcBadge color="success" variant="light" dot label="Ready" />
          <AcBadge color="warning" variant="light" dot label="Provisioning" />
          <AcBadge color="danger" variant="light" dot label="Failed" />
        </div>
      </div>
      <div class="space-y-3 rounded-10 border border-border bg-surface-muted p-4">
        <p class="flex items-center gap-2 font-medium text-heading"><Database class="size-4 text-primary" aria-hidden="true" />demo-postgres</p>
        <AcInput label="Namespace" model-value="demo" />
        <div class="flex items-center justify-between">
          <AcSwitch :model-value="true" label="Monitoring" />
          <AcButton title="Save" size="small" />
        </div>
      </div>
    </div>
  </div>

  <DocHeading id="setup">Add it to an app</DocHeading>
  <p><strong>1. Add the switch.</strong> <RouterLink to="/components/theme-mode">AcThemeMode</RouterLink> handles the class, the saved choice and following the system setting.</p>
  <CodeBlock :code="setup" lang="vue" />
  <p class="mt-4"><strong>2. Stop the white flash.</strong> Without this, the page paints light for a moment before Vue starts.</p>
  <CodeBlock :code="noFlash" lang="html" />
  <p class="mt-4"><strong>3. Read or change it from code</strong> with <code class="prose-code">useColorMode()</code>. The state is shared, so every switch stays in sync.</p>
  <CodeBlock :code="composable" lang="typescript" />
  <Callout type="note">
    The choice is saved under the <code class="prose-code">themeMode</code> key in localStorage — the same key the old ThemeMode used,
    so people keep their setting after an app migrates.
  </Callout>

  <DocHeading id="tokens">What changes</DocHeading>
  <div class="my-5 overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Tokens</th><th class="h-9 px-4 font-medium">Light</th><th class="h-9 px-4 font-medium">Dark</th></tr>
      </thead>
      <tbody>
        <tr v-for="r in rows" :key="r[0]" class="border-t border-border-light first:border-0">
          <td class="px-4 py-3"><code class="prose-code">{{ r[0] }}</code></td>
          <td class="px-4 py-3 text-body">{{ r[1] }}</td>
          <td class="px-4 py-3 text-body">{{ r[2] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p>
    Mirroring means pairs like “<code class="prose-code">text-red-20</code> on <code class="prose-code">bg-red-97</code>” keep their contrast:
    dark text on a pale tint in light mode becomes light text on a dark wash in dark mode.
  </p>

  <DocHeading id="exceptions">When tokens aren't enough</DocHeading>
  <p>Use Tailwind's <code class="prose-code">dark:</code> variant for the rare thing a token can't express, like a logo:</p>
  <CodeBlock :code="variant" lang="html" />
  <p class="mt-4">
    A <code class="prose-code">.dark</code> class on any element makes just that part dark, like the preview above.
  </p>

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />
</template>
