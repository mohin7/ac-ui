<script setup lang="ts">
import ApiTables from "../../components/ApiTables.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = ["Keep one primary action in `right-controls`.", "Filter on the client for small lists, or listen to `search` and query the API for large ones."];
const donts = ["Don't nest a Content Table inside a Card — it is already a surface.", "Don't duplicate the page title here; name the list instead."];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use Content Table to frame a list: a title, a search box, filters and a Create button above a table, on one card. It passes the search text to its slot so you decide how to filter. <code class="prose-code">AcContentHeader</code> and <code class="prose-code">AcContentLayout</code> are the building blocks when you need the same frame around something other than a table.</p>
  <ComponentExample name="content-table/ContentTableBasic" />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="controls" :level="3">Filters and actions</DocHeading>
  <p><code class="prose-code">left-controls</code> sit before the search box (filters), <code class="prose-code">right-controls</code> after it (the primary action). <code class="prose-code">title-actions</code> sits next to the title.</p>
  <ComponentExample name="content-table/ContentTableControls" />
  <DocHeading id="layout" :level="3">Content Layout and Content Header</DocHeading>
  <p>Compose the frame yourself for non-table content.</p>
  <ComponentExample name="content-table/ContentLayoutCustom" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>The search box has an accessible name from its placeholder, and Escape clears it.</li>
  </ul>

  <ApiTables component="AcContentTable" heading="Content Table API" />

  <ApiTables component="AcContentHeader" heading="Content Header API" id-prefix="header-" />

  <ApiTables component="AcContentLayout" heading="Content Layout API" id-prefix="layout-" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">rounded-10 border-border bg-surface shadow-xs</code></td><td class="px-4 py-3">Surface</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">px-5 py-3.5 border-b border-border-light</code></td><td class="px-4 py-3">Header</td></tr>
      </tbody>
    </table>
  </div>
</template>
