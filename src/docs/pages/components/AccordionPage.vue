<script setup lang="ts">
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = [
  "Use it to tuck away optional or advanced settings so the main path stays short.",
  "Put a summary of what's inside in `description`, so people needn't open each item to check.",
  "Open the item people most likely need by default.",
];
const donts = [
  "Don't hide required fields in a closed item — people will miss them.",
  "Don't nest accordions more than one level deep.",
  "Don't use an accordion to switch between alternative views; use Tabs.",
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use an accordion for stacked sections people open one at a time: advanced configuration, grouped details, FAQs. Wrap AcAccordionItems in an AcAccordion and bind <code class="prose-code">v-model</code> to the open item's <code class="prose-code">value</code>.</p>
  <ComponentExample name="accordion/AccordionBasic" />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="multiple" :level="3">Multiple open, separated</DocHeading>
  <p>With <code class="prose-code">multiple</code>, <code class="prose-code">v-model</code> is an array and items open independently. <code class="prose-code">variant="separated"</code> gives each item its own card. The <code class="prose-code">description</code> line summarises the settings inside; <code class="prose-code">disabled</code> items can't be toggled.</p>
  <ComponentExample name="accordion/AccordionMultiple" />
  <DocHeading id="flush" :level="3">Flush, with icons</DocHeading>
  <p><code class="prose-code">variant="flush"</code> drops the outer border for use inside a card or form. The <code class="prose-code">icon</code> slot adds a 16px icon before the title, and <code class="prose-code">heading-level</code> keeps the page outline right.</p>
  <ComponentExample name="accordion/AccordionFlush" />
  <DocHeading id="standalone" :level="3">A single item</DocHeading>
  <p>An AcAccordionItem also works on its own with <code class="prose-code">v-model:open</code> — the replacement for the old <code class="prose-code">&lt;Accordion :is-active @on-click&gt;</code> in forms.</p>
  <ComponentExample name="accordion/AccordionStandalone" />
  <Callout type="note">Height changes animate by transitioning the panel's grid rows, so content of any height opens smoothly. With reduced motion turned on, items open instantly.</Callout>

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>Follows the WAI-ARIA accordion pattern: each title is a <code class="prose-code">&lt;button&gt;</code> inside a heading, with <code class="prose-code">aria-expanded</code> and <code class="prose-code">aria-controls</code>; each panel is a <code class="prose-code">role="region"</code> labelled by its button.</li>
    <li>Keyboard: Tab moves between headers, Enter or Space toggles, ↑ ↓ move to the previous or next header and Home / End jump to the first or last.</li>
    <li>Closed panels are <code class="prose-code">inert</code>, so their fields can't be focused or read until opened.</li>
  </ul>

  <ApiTables component="AcAccordion" heading="Accordion API" />
  <ApiTables component="AcAccordionItem" heading="Accordion Item API" id-prefix="item-" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes these components use, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">rounded-10 border-border divide-border-light shadow-xs</code></td><td class="px-4 py-3"><code class="prose-code">bordered</code> and <code class="prose-code">separated</code> cards</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">hover:bg-surface-muted</code></td><td class="px-4 py-3">Header hover</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">ring-ring ring-inset</code></td><td class="px-4 py-3">Header focus</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">grid-rows-[0fr] → grid-rows-[1fr]</code></td><td class="px-4 py-3">Open / close animation</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">text-lg font-medium · text-xs text-muted</code></td><td class="px-4 py-3">Title and description</td></tr>
      </tbody>
    </table>
  </div>
</template>
