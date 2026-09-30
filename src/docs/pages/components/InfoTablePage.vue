<script setup lang="ts">
import { AcInfoTable } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const script =
  'const items = [\n  { label: "Name", value: "pg-prod", mono: true },\n  { label: "Namespace", value: "demo" },\n  { label: "Version", value: "16.1" },\n  { label: "Endpoint", value: "pg-prod.demo.svc:5432", mono: true, copyable: true },\n];';
const items = [
  { label: "Name", value: "pg-prod", mono: true },
  { label: "Namespace", value: "demo" },
  { label: "Version", value: "16.1" },
  { label: "Endpoint", value: "pg-prod.demo.svc:5432", mono: true, copyable: true },
];

const dynamicSlots = [
  { name: "value-<key>", type: "{ item: InfoItem }", description: "Custom value for the row whose `key` (or `label`) matches, e.g. `#value-status` for a badge." },
  { name: "label-<key>", type: "{ item: InfoItem }", description: "Custom label for that row, e.g. with an icon or tooltip." },
];

const dos = [
  "Order rows by what people look for first: name, status, version, then the rest.",
  "Use `mono` and `copyable` for things people paste elsewhere: endpoints, UIDs, image digests.",
  "Show a dash for empty values rather than hiding the row, so the layout stays predictable.",
];
const donts = [
  "Don't use an info table for many resources — that's a Table.",
  "Don't put long paragraphs in values; link to a detail view instead.",
  "Don't put editable fields in the rows; open an edit form from the `actions` slot.",
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use an info table for the details of one resource: a database's endpoint and version, a node's zone and instance type, a backup's schedule. Pass <code class="prose-code">items</code> as <code class="prose-code">{ label, value, copyable?, mono? }</code> and use slots for badges and links.</p>
  <ComponentPlayground
    tag="AcInfoTable"
    :component="AcInfoTable"
    :controls="[{'prop': 'title', 'type': 'text'}, {'prop': 'columns', 'type': 'select', 'options': [1, 2]}, {'prop': 'layout', 'type': 'select', 'options': ['horizontal', 'stacked']}, {'prop': 'bordered', 'type': 'boolean'}, {'prop': 'loading', 'type': 'boolean'}]"
    :initial="{'title': 'Details', 'columns': 1, 'layout': 'horizontal', 'bordered': true, 'loading': false}"
    :defaults="{'title': '', 'columns': 1, 'layout': 'horizontal', 'bordered': true, 'loading': false}"
    :extra="{'items': items, 'class': 'w-full max-w-160'}"
    extra-code=':items="items"'
    :script="script"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="basic" :level="3">Basic</DocHeading>
  <p><code class="prose-code">mono</code> shows the value in Geist Mono; <code class="prose-code">copyable</code> adds a copy button. Empty values show a dash.</p>
  <ComponentExample name="info-table/InfoTableBasic" />
  <DocHeading id="value-slots" :level="3">Two columns, badges and links</DocHeading>
  <p><code class="prose-code">:columns="2"</code> splits the rows into two columns from 768px up. Give a row a <code class="prose-code">key</code> and fill <code class="prose-code">#value-&lt;key&gt;</code> for a badge, link or list of tags. The <code class="prose-code">actions</code> slot sits next to the title.</p>
  <ComponentExample name="info-table/InfoTableSlots" />
  <DocHeading id="stacked" :level="3">Stacked, inside a card</DocHeading>
  <p><code class="prose-code">layout="stacked"</code> puts labels above values for narrow cards, and <code class="prose-code">:bordered="false"</code> drops the table's own card.</p>
  <ComponentExample name="info-table/InfoTableStacked" />
  <DocHeading id="loading" :level="3">Loading and empty</DocHeading>
  <p><code class="prose-code">loading</code> shows placeholder bars — in place of the values if you already know the labels, or six placeholder rows if not. With no items, <code class="prose-code">empty-text</code> is shown.</p>
  <ComponentExample name="info-table/InfoTableLoading" />
  <Callout type="note">Slot names come from the row's <code class="prose-code">key</code>, falling back to its <code class="prose-code">label</code>. Set a <code class="prose-code">key</code> whenever you use a slot, so renaming a label doesn't break it.</Callout>

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>Rows are a description list (<code class="prose-code">&lt;dl&gt;</code>, <code class="prose-code">&lt;dt&gt;</code>, <code class="prose-code">&lt;dd&gt;</code>), so screen readers pair each label with its value.</li>
    <li>Copy buttons are labelled “Copy Endpoint” and change to “Endpoint copied” after a click.</li>
    <li>While loading, the list is <code class="prose-code">aria-busy</code>.</li>
  </ul>

  <ApiTables component="AcInfoTable" :extra-slots="dynamicSlots" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">rounded-10 border-border shadow-xs</code></td><td class="px-4 py-3">Card (<code class="prose-code">bordered</code>)</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">border-t border-border-light</code></td><td class="px-4 py-3">Row dividers</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">text-muted · text-heading</code></td><td class="px-4 py-3">Label and value</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">font-mono text-xs</code></td><td class="px-4 py-3"><code class="prose-code">mono</code> values</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">animate-pulse bg-surface-sunken</code></td><td class="px-4 py-3">Loading bars</td></tr>
      </tbody>
    </table>
  </div>
</template>
