<script setup lang="ts">
import { AcCellValue } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = [
  "Pass the raw value and let the cell format it: a dash for empty, “3d ago” for a timestamp, chips for labels.",
  "Pass the server's `column` and `cell` for resource tables, so colours, links and tooltips from the API show up.",
  "Use `type=\"status\"` (or a `color`) for phases, so they read as badges with a word, never colour alone.",
];
const donts = [
  "Don't stringify maps and lists yourself — the cell shows chips or a preview with a JSON viewer.",
  "Don't widen `max-width` to avoid truncation; the full value is one hover or focus away.",
  "Don't use it for editable values; it only displays.",
];

const typeRows = [
  ["string", "Text, cut with an ellipsis at `max-width`; the full text shows in a tooltip."],
  ["number / integer", "Grouped with `Intl.NumberFormat`, tabular figures, optional `unit`. Quantities such as `500Mi` also get tabular figures."],
  ["boolean", "A check or a dash icon with “true” / “false”."],
  ["date", "“3d ago” in a `<time>` element, the exact time in a tooltip. ISO strings, `Date`s and Unix times (s or ms). A server's ready-made age such as “3d5h” shows as is."],
  ["labels", "A map of plain values as `key=value` tags, then “+N more”."],
  ["array", "Items as tags (objects by their `name`), then “+N more”; lists of objects also get a JSON viewer."],
  ["object", "A one-line `key: value` preview and a button that opens the JSON in a modal."],
  ["status", "A light, rounded badge with a dot. The tone comes from `color`, or from words like Ready, Failed, Pending."],
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use a cell value to show one Kubernetes value in a table cell or a details row: names, versions, ages, labels, phases, nested specs. It picks a display from the value, or from the server's column descriptor, so resource lists driven by the API need no per-column code.</p>
  <ComponentPlayground
    tag="AcCellValue"
    :component="AcCellValue"
    :controls="[{'prop': 'type', 'type': 'select', 'options': ['auto', 'string', 'number', 'boolean', 'date', 'labels', 'array', 'object', 'status']}, {'prop': 'maxWidth', 'type': 'text'}, {'prop': 'bold', 'type': 'boolean'}, {'prop': 'mono', 'type': 'boolean'}, {'prop': 'loading', 'type': 'boolean'}]"
    :initial="{'type': 'auto', 'maxWidth': '280px', 'bold': false, 'mono': false, 'loading': false}"
    :defaults="{'type': 'auto', 'maxWidth': '280px', 'bold': false, 'mono': false, 'loading': false}"
    :extra="{'value': {'app': 'postgres', 'team': 'payments', 'tier': 'gold', 'env': 'prod'}, 'title': 'Labels'}"
    extra-code=':value="labels" title="Labels"'
    script="const labels = { app: &quot;postgres&quot;, team: &quot;payments&quot;, tier: &quot;gold&quot;, env: &quot;prod&quot; };"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="types" :level="3">Value types</DocHeading>
  <p>With the default <code class="prose-code">type="auto"</code> the value decides: numbers, booleans, ISO dates, maps of plain values (labels), lists and nested objects. <code class="prose-code">null</code>, empty text, empty lists and the server's <code class="prose-code">&lt;none&gt;</code> / <code class="prose-code">&lt;unknown&gt;</code> show a dash.</p>
  <ComponentExample name="cell-value/CellValueTypes" />
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">type</th><th class="h-9 px-4 font-medium">Shows</th></tr>
      </thead>
      <tbody>
        <tr v-for="[t, d] in typeRows" :key="t" class="border-t border-border-light first:border-0">
          <td class="px-4 py-3 whitespace-nowrap"><code class="prose-code">{{ t }}</code></td>
          <td class="px-4 py-3">{{ d }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <DocHeading id="resource-table" :level="3">Server-side resource tables</DocHeading>
  <p>The resource API returns column descriptors and rows of cells <code class="prose-code">{ data, link, color, tooltip, icon, sort }</code>. Map them to <RouterLink to="/components/table">Table</RouterLink> columns with a <code class="prose-code">descriptor</code> and every cell renders through this component. Outside a table, use <code class="prose-code">&lt;AcCellValue :column="col" :cell="cell" /&gt;</code>.</p>
  <ComponentExample name="cell-value/CellValueResourceTable" />

  <DocHeading id="status" :level="3">Status</DocHeading>
  <p><code class="prose-code">type="status"</code> picks a tone from common phases. A <code class="prose-code">color</code> (or a cell's <code class="prose-code">color</code>) sets it directly and accepts the old Bulma names: <code class="prose-code">is-success</code>, <code class="prose-code">light</code>, <code class="prose-code">dark</code>.</p>
  <ComponentExample name="cell-value/CellValueStatus" />

  <DocHeading id="truncation" :level="3">Truncation and tooltips</DocHeading>
  <p>Text longer than <code class="prose-code">max-width</code> ends in an ellipsis; hovering or tabbing to it shows the full value. A <code class="prose-code">tooltip</code> is shown even when nothing is cut.</p>
  <ComponentExample name="cell-value/CellValueTruncate" />

  <DocHeading id="links" :level="3">Links and icons</DocHeading>
  <p><code class="prose-code">http(s)</code> links open in a new tab. Paths starting with <code class="prose-code">/</code> use <code class="prose-code">RouterLink</code> when vue-router is installed; anything else is a plain link. Server links carry placeholders such as <code class="prose-code">${clustername}</code>; fill them with <code class="prose-code">resolve-link</code>.</p>
  <ComponentExample name="cell-value/CellValueLinks" />

  <DocHeading id="nested" :level="3">Objects and lists</DocHeading>
  <p>Nested values get a one-line preview and a <code class="prose-code">{ }</code> button that opens the JSON in a read-only <RouterLink to="/components/code-editor">Code Editor</RouterLink>. The editor loads on first open, so CodeMirror stays out of pages that never need it. “+N more” expands the chips in place.</p>
  <ComponentExample name="cell-value/CellValueNested" />

  <DocHeading id="status-modal" :level="3">Replacing StatusModal</DocHeading>
  <p>The old <code class="prose-code">StatusModal</code> has no direct replacement: it is a <RouterLink to="/components/modal">Modal</RouterLink> with one <RouterLink to="/components/alert">Alert</RouterLink> per status. <code class="prose-code">statusArray[].type</code> becomes the alert's <code class="prose-code">color</code>, <code class="prose-code">isModalOpen</code> becomes <code class="prose-code">v-model:open</code>, <code class="prose-code">ignoreOutsideClick</code> becomes <code class="prose-code">:close-on-outside-click="false"</code>, and <code class="prose-code">modifierClasses="is-large"</code> becomes <code class="prose-code">size</code>.</p>
  <ComponentExample name="cell-value/StatusModal" center />

  <Callout type="note">Dashboard and exec columns (<code class="prose-code">column.dashboard</code>, <code class="prose-code">column.exec</code>) open app-specific dialogs, so the app renders those buttons in a <code class="prose-code">#cell-&lt;key&gt;</code> slot of the table.</Callout>

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>Truncated text, dates and statuses with a tooltip are focusable, so keyboard users get the full value too; the tooltip is linked with <code class="prose-code">aria-describedby</code>.</li>
    <li>Dates render as <code class="prose-code">&lt;time datetime&gt;</code> with the exact time in the tooltip.</li>
    <li>“+N more” is a button with <code class="prose-code">aria-expanded</code> and a label such as “Show 3 more labels”. The JSON button is labelled “View Labels as JSON” and opens a focus-trapped dialog.</li>
    <li>Buttons inside the cell stop the click, so they don't also trigger a clickable table row.</li>
    <li>Status colour always comes with the status word.</li>
  </ul>

  <ApiTables component="AcCellValue" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">text-muted</code></td><td class="px-4 py-3">Empty dash, false booleans</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">truncate tabular-nums</code></td><td class="px-4 py-3">Text and numbers</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">text-primary-20 hover:underline</code></td><td class="px-4 py-3">Links</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">font-mono text-xs text-label</code></td><td class="px-4 py-3">Object preview</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">AcBadge variant="light" rounded dot</code></td><td class="px-4 py-3">Status</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">AcTag</code></td><td class="px-4 py-3">Label and list chips</td></tr>
      </tbody>
    </table>
  </div>
</template>
