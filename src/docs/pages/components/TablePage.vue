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
  <DocHeading id="selectable" :level="3">Selectable rows</DocHeading>
  <p><code class="prose-code">selectable</code> adds a checkbox column for bulk actions. Bind the chosen rows' <code class="prose-code">rowKey</code> values with <code class="prose-code">v-model:selected</code>. The header checkbox chooses every row in view; choices on other pages are kept.</p>
  <ComponentExample name="table/TableSelectable" />
  <DocHeading id="expandable" :level="3">Expandable rows</DocHeading>
  <p><code class="prose-code">expandable</code> adds an arrow column. Opening a row shows the <code class="prose-code">expanded</code> slot under it, across the full width of the table. Bind the open rows' <code class="prose-code">rowKey</code> values with <code class="prose-code">v-model:expanded</code>, or leave it unbound to let the table keep track. Use <code class="prose-code">can-expand</code> to give an arrow only to rows that have details. The arrow doesn't trigger <code class="prose-code">@row-click</code>.</p>
  <ComponentExample name="table/TableExpandable" />
  <DocHeading id="row-states" :level="3">Active and disabled rows</DocHeading>
  <p><code class="prose-code">row-active</code> takes a function that marks the current row, such as the one chosen in a picker: it gets a tint, a primary outline and <code class="prose-code">aria-current</code>. <code class="prose-code">row-disabled</code> greys a row out so it ignores clicks, and its checkbox (with <code class="prose-code">selectable</code>) is disabled and skipped by the header checkbox. Neither is the checkbox selection.</p>
  <ComponentExample name="table/TableRowStates" />
  <DocHeading id="manual-sort" :level="3">Sorting across pages</DocHeading>
  <p>By default the table sorts the rows it is given, which is right when it holds the whole list. When the list is paged, that only reorders the page in view. Set <code class="prose-code">manual-sort</code> and the table stops reordering: sort the whole list yourself when <code class="prose-code">@sort</code> fires, or bind <code class="prose-code">v-model:sort-by</code> (<code class="prose-code">{ key, mode }</code> or <code class="prose-code">null</code>), which also lets you set or keep the sort from outside, such as in the URL. The header arrows still show.</p>
  <ComponentExample name="table/TableManualSort" />
  <DocHeading id="flat" :level="3">Inside a card</DocHeading>
  <p>A table draws its own border, rounded corners and shadow. Put it in a card or section that already has a frame and that makes a box inside a box. <code class="prose-code">flat</code> removes the table's frame and softens the header rule, so the card is the only edge. Use <code class="prose-code">AcCard</code> with <code class="prose-code">:padded="false"</code>: it clips the table to its rounded corners.</p>
  <ComponentExample name="table/TableFlat" />

  <DocHeading id="loading" :level="3">Loading</DocHeading>
  <p><code class="prose-code">loading</code> shows skeleton rows while data loads.</p>
  <ComponentExample name="table/TableLoading" />
  <DocHeading id="empty" :level="3">Empty state</DocHeading>
  <p>Use the <code class="prose-code">empty</code> slot to explain and offer the next action.</p>
  <ComponentExample name="table/TableEmpty" />
  <DocHeading id="value-types" :level="3">Kubernetes values and server tables</DocHeading>
  <p>Give a column a <code class="prose-code">type</code> (<code class="prose-code">auto</code>, <code class="prose-code">date</code>, <code class="prose-code">labels</code>, <code class="prose-code">status</code>…) to show its values with <RouterLink to="/components/cell-value">Cell Value</RouterLink>: dashes for empty values, relative ages, label chips, status badges. For a resource table from the API, pass the server's column as <code class="prose-code">descriptor</code> and the cells as row values; sorting uses each cell's <code class="prose-code">sort</code>.</p>
  <ComponentExample name="cell-value/CellValueResourceTable" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>Native <code class="prose-code">&lt;table&gt;</code> with <code class="prose-code">scope="col"</code> headers.</li>
    <li>Sorted columns expose <code class="prose-code">aria-sort</code>.</li>
    <li>The expand arrow is a button with <code class="prose-code">aria-expanded</code> and <code class="prose-code">aria-controls</code>, labelled "Expand" or "Collapse" with the row's first value. The detail area is a labelled region.</li>
  </ul>

  <ApiTables component="AcTable" :extra-slots="[{'name': 'cell-<key>', 'type': '{ row: Row; value: unknown }', 'description': 'Custom content for the cell of column `key`, e.g. `#cell-status`.'}, {'name': 'header-<key>', 'type': '{ column: Column }', 'description': 'Custom content for the header of column `key`, e.g. `#header-status`. Replaces the label; the sort arrow stays.'}]" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
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
