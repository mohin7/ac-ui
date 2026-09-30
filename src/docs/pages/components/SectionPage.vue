<script setup lang="ts">
import ApiTables from "../../components/ApiTables.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = ["Use short noun titles: “Backup Configuration”, “Resource Limits”.", "Collapse optional or advanced settings by default."];
const donts = ["Don't collapse sections people need every time."];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use Section Content to group part of a settings or detail page under a heading, with optional actions, a back button, or a collapse toggle.</p>
  <ComponentExample name="section/SectionBasic" />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="collapsible" :level="3">Collapsible</DocHeading>
  <p><code class="prose-code">collapsible</code> adds a chevron; <code class="prose-code">v-model:open</code> controls it.</p>
  <ComponentExample name="section/SectionCollapsible" />
  <DocHeading id="back" :level="3">Back button</DocHeading>
  <p><code class="prose-code">back-button</code> emits <code class="prose-code">back</code> — for a sub-view inside a page.</p>
  <ComponentExample name="section/SectionBack" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>The collapse button has <code class="prose-code">aria-expanded</code> and <code class="prose-code">aria-controls</code> pointing at the body.</li>
  </ul>

  <ApiTables component="AcSectionContent" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">rounded-10 border-border shadow-xs</code></td><td class="px-4 py-3">Surface</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">px-5 py-3.5 / p-5</code></td><td class="px-4 py-3">Header / body</td></tr>
      </tbody>
    </table>
  </div>
</template>
