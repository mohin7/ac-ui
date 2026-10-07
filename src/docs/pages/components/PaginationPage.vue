<script setup lang="ts">
import { AcPagination } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const script = 'import { ref } from "vue";\n\nconst page = ref(1);';

const dos = [
  "Put pagination directly under the list it controls, inside the same card.",
  "Set `item-label` so the summary names the thing: “of 57 databases”.",
  "Keep the page in the URL for long lists, so a refresh or shared link lands on the same page.",
];
const donts = [
  "Don't paginate lists shorter than one page — hide the control or show everything.",
  "Don't offer page sizes above 100 for rows with heavy cells; the page gets slow.",
  "Don't combine pagination with infinite scroll in the same list.",
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use pagination under tables and lists that are too long for one screen: backups, events, audit logs. It shows where you are (“Showing 1–10 of 57”), lets people pick a page size and jump between pages.</p>
  <ComponentPlayground
    tag="AcPagination"
    :component="AcPagination"
    :controls="[{'prop': 'siblings', 'type': 'select', 'options': [0, 1, 2]}, {'prop': 'itemLabel', 'type': 'text'}, {'prop': 'hidePageSize', 'type': 'boolean'}, {'prop': 'compact', 'type': 'boolean'}, {'prop': 'size', 'type': 'select', 'options': ['normal', 'small']}, {'prop': 'disabled', 'type': 'boolean'}]"
    :initial="{'siblings': 1, 'itemLabel': 'databases', 'hidePageSize': false, 'compact': false, 'size': 'normal', 'disabled': false}"
    :defaults="{'siblings': 1, 'itemLabel': '', 'hidePageSize': false, 'compact': false, 'size': 'normal', 'disabled': false}"
    :extra="{'total': 240, 'class': 'w-full'}"
    extra-code='v-model:page="page" :total="240"'
    :script="script"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="basic" :level="3">With a list</DocHeading>
  <p>Bind <code class="prose-code">v-model:page</code> and <code class="prose-code">v-model:page-size</code>, or just listen to <code class="prose-code">range</code>: it fires on mount and on every change with <code class="prose-code">{ start, end }</code>, ready for <code class="prose-code">list.slice(start, end)</code>. Changing the page size keeps the first visible row on screen.</p>
  <ComponentExample name="pagination/PaginationBasic" />
  <DocHeading id="many" :level="3">Many pages</DocHeading>
  <p>Long ranges collapse into ellipses around the current page. The number of buttons stays the same as you move, so the control doesn't jump. <code class="prose-code">siblings</code> sets how many neighbours of the current page are shown.</p>
  <ComponentExample name="pagination/PaginationMany" />
  <DocHeading id="size" :level="3">Small</DocHeading>
  <p>Use <code class="prose-code">size="small"</code> for 28px page buttons, inside cards and dense tables.</p>

  <DocHeading id="compact" :level="3">Compact</DocHeading>
  <p>Below 640px the page numbers are replaced by “3 / 6” between the arrows. <code class="prose-code">compact</code> forces that at every width, for side panels and cards.</p>
  <ComponentExample name="pagination/PaginationCompact" />
  <Callout type="tip">For server-side paging, watch <code class="prose-code">page</code> and <code class="prose-code">pageSize</code>, fetch that page, and pass the server's total count as <code class="prose-code">total</code>. Set <code class="prose-code">disabled</code> while the request runs.</Callout>

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>The page buttons are in a <code class="prose-code">&lt;nav aria-label="Pagination"&gt;</code>; the current one has <code class="prose-code">aria-current="page"</code> and each is labelled “Page 3”.</li>
    <li>Previous and next are labelled icon buttons and are disabled at the ends.</li>
    <li>The “Showing 11–20 of 57” summary is a polite live region, so the change is announced after each click.</li>
  </ul>

  <ApiTables component="AcPagination" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">border-primary bg-primary-95 text-primary-20</code></td><td class="px-4 py-3">Current page</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">hover:bg-surface-sunken</code></td><td class="px-4 py-3">Other pages on hover</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">rounded-6 border-border shadow-xs</code></td><td class="px-4 py-3">Previous / next</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">text-xs text-muted tabular-nums</code></td><td class="px-4 py-3">Summary</td></tr>
      </tbody>
    </table>
  </div>
</template>
