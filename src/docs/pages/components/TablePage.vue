<script setup lang="ts">
import { AcTable } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const script = "const columns = [\n  { key: \"name\", label: \"Name\", sortable: true },\n  { key: \"type\", label: \"Type\" },\n  { key: \"age\", label: \"Age\", align: \"right\" as const },\n];\nconst rows = [\n  { id: 1, name: \"demo-postgres\", type: \"Postgres\", age: \"2d\" },\n  { id: 2, name: \"orders-mongo\", type: \"MongoDB\", age: \"14m\" },\n];";

const dos = ["Put the resource name first and bold it.", "Show status as a light, rounded badge with a dot.", "Right-align numbers and ages."];
const donts = ["Don't show a blank table — always provide an empty state.", "Don't put more than one or two actions in a row; use a menu."];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use a table to list resources — databases, clusters, invoices — with sortable columns, loading and empty states. Customise any cell with a <code class="prose-code">cell-&lt;key&gt;</code> slot.</p>
  <ComponentPlayground
    tag="AcTable"
    :component="AcTable"
    :controls="[{'prop': 'loading', 'type': 'boolean'}, {'prop': 'clickable', 'type': 'boolean'}]"
    :initial="{'loading': false, 'clickable': false}"
    :defaults="{'loading': false, 'clickable': false}"
    :extra="{'columns': [{'key': 'name', 'label': 'Name', 'sortable': true}, {'key': 'type', 'label': 'Type'}, {'key': 'age', 'label': 'Age', 'align': 'right'}], 'rows': [{'id': 1, 'name': 'demo-postgres', 'type': 'Postgres', 'age': '2d'}, {'id': 2, 'name': 'orders-mongo', 'type': 'MongoDB', 'age': '14m'}]}"
    extra-code=':columns="columns" :rows="rows"'
    :script="script"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="basic" :level="3">Basic</DocHeading>
  <p>Pass <code class="prose-code">columns</code> and <code class="prose-code">rows</code>. Sortable columns sort on click (↑ ascending, ↓ descending) and emit <code class="prose-code">sort</code>.</p>
  <ComponentExample name="table/TableBasic" />
  <DocHeading id="custom-cells" :level="3">Custom cells</DocHeading>
  <p>Use <code class="prose-code">#cell-&lt;key&gt;</code> slots — here a bold name and a status badge.</p>
  <ComponentExample name="table/TableCells" />
  <DocHeading id="clickable" :level="3">Clickable rows</DocHeading>
  <p><code class="prose-code">clickable</code> emits <code class="prose-code">row-click</code> with the row, e.g. to open a detail page.</p>
  <ComponentExample name="table/TableClickable" />
  <DocHeading id="loading" :level="3">Loading</DocHeading>
  <p><code class="prose-code">loading</code> shows skeleton rows while data loads.</p>
  <ComponentExample name="table/TableLoading" />
  <DocHeading id="empty" :level="3">Empty state</DocHeading>
  <p>Use the <code class="prose-code">empty</code> slot to explain and offer the next action.</p>
  <ComponentExample name="table/TableEmpty" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>Native <code class="prose-code">&lt;table&gt;</code> with <code class="prose-code">scope="col"</code> headers.</li>
    <li>Sorted columns expose <code class="prose-code">aria-sort</code>.</li>
  </ul>

  <ApiTables component="AcTable" :extra-slots="[{'name': 'cell-<key>', 'type': '{ row: Row; value: unknown }', 'description': 'Custom content for the cell of column `key`, e.g. `#cell-status`.'}]" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-white shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">bg-surface-muted text-xs text-label</code></td><td class="px-4 py-3">Header row</td></tr>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">hover:bg-surface-muted/70</code></td><td class="px-4 py-3">Row hover</td></tr>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">border-border-light</code></td><td class="px-4 py-3">Row dividers</td></tr>
      </tbody>
    </table>
  </div>
</template>
