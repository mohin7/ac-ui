<script setup lang="ts">
import Callout from "../../components/Callout.vue";
import CodeBlock from "../../components/CodeBlock.vue";
import DocHeading from "../../components/DocHeading.vue";

const mapping = [
  ["Colour scales", "bg-primary-95, text-red-10, border-blue-50", "$primary-95, $red-10, $blue-50"],
  ["Brand", "bg-primary, bg-secondary", "$ac-primary, $ac-secondary"],
  ["Status", "text-success, bg-info, border-warning, text-danger", "$success, $info, $warning, $danger"],
  ["Text", "text-heading, text-body, text-label, text-muted, text-link", "$color-heading, $color-text, $color-label, —, $color-link"],
  ["Surfaces", "bg-surface, bg-surface-muted, bg-surface-sunken, ring-ring", "— (new in v0.2)"],
  ["Borders", "border-border, border-border-light, border-border-dark", "$color-border, …-light, …-dark"],
  ["Spacing", "p-4 (16px), gap-2 (8px), mt-6 (24px)", ".p-16, .gap-8, .mt-24"],
  ["Radius", "rounded-6 (controls), rounded-10 (surfaces), rounded-50", ".is-rounded-4, .is-rounded-50"],
  ["Shadow", "shadow-xs, shadow-sm, shadow-md, shadow-lg, shadow-xl", "$shadow-sm, $shadow-lg, $shadow-xl"],
  ["Type", "text-base (13px), text-xs (12px), text-code", ".text-base, .text-xs, .text-code"],
];

const hue = `// Re-hue every primary step at runtime, e.g. for a white-label customer
const root = document.documentElement.style;
root.setProperty("--primary-hue", "208");
root.setProperty("--primary-saturation", "77%");
root.setProperty("--primary-light", "40%");`;

const override = `@import "tailwindcss";
@import "./lib/theme.css";

/* Change the default brand for this app */
:root {
  --primary-hue: 208;
  --primary-saturation: 77%;
  --primary-light: 40%;
}

/* Add an app-specific token */
@theme {
  --color-chart-cpu: hsl(286 66% 40%);
}`;

const themeSnippet = `@theme {
  --color-*: initial;   /* no Tailwind default palette */
  --color-primary: hsl(var(--primary-hue) var(--primary-saturation) var(--primary-light));
  --color-primary-95: hsl(var(--primary-hue) var(--primary-saturation) 95%);
  --color-heading: var(--color-slate-5);
  --spacing: 4px;
  --radius-4: 4px;
  --text-base: 13px;
  /* … */
}`;
</script>

<template>
  <DocHeading id="how-it-works">How it works</DocHeading>
  <p>
    <code class="prose-code">src/lib/theme.css</code> declares every AppsCode token inside Tailwind's
    <code class="prose-code">@theme</code>. Tailwind's default colours, radii and shadows are cleared first, so every
    utility you write is an AppsCode value and off-brand colours such as <code class="prose-code">bg-indigo-500</code>
    don't exist.
  </p>
  <CodeBlock :code="themeSnippet" lang="css" filename="src/lib/theme.css (excerpt)" />

  <DocHeading id="token-mapping">Token → utility mapping</DocHeading>
  <div class="my-4 overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr>
          <th class="h-9 px-4 font-medium">Family</th>
          <th class="h-9 px-4 font-medium">Tailwind classes</th>
          <th class="h-9 px-4 font-medium">Old SCSS / class</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="[f, tw, old] in mapping" :key="f" class="border-t border-border-light">
          <td class="h-9 px-4 font-medium text-heading">{{ f }}</td>
          <td class="px-4 py-2"><code class="font-mono text-[13px] text-primary-20">{{ tw }}</code></td>
          <td class="px-4 py-2"><code class="font-mono text-[13px] text-label">{{ old }}</code></td>
        </tr>
      </tbody>
    </table>
  </div>
  <Callout type="warning">
    Two naming quirks are kept from the source so old classes keep their meaning: <code class="prose-code">text-sm</code>
    is 11px and <code class="prose-code">text-xs</code> is 12px, and <code class="prose-code">slate-50</code> is a mid
    gray (#64748b), not Tailwind's near-white.
  </Callout>

  <DocHeading id="brand-hue">Runtime brand hue</DocHeading>
  <p>
    Every primary step is built from three CSS variables, exactly as in the Bulma version. Change them on
    <code class="prose-code">&lt;html&gt;</code> and the whole UI re-hues — try the colour dot in the header.
    Status colours don't change.
  </p>
  <CodeBlock :code="hue" lang="typescript" />

  <DocHeading id="customizing">Customising in an app</DocHeading>
  <p>Override the hue variables or add tokens after importing the theme. Don't edit component files for one app's needs.</p>
  <CodeBlock :code="override" lang="css" filename="src/main.css" />
</template>
