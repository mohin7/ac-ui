<script setup lang="ts">
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = [
  "Name the field with the plural (“Quotas”) and `item-name` with the singular (“quota”); buttons and screen-reader text are built from them.",
  "Use `inline` mode for two or three short fields, such as key–value pairs, and `form` mode for anything larger.",
  "Return field errors from `validate` and show them with each field's `error-msg`.",
];
const donts = [
  "Don't use it for one or two fixed values — show the fields directly.",
  "Don't save to the API on every keystroke; use `before-save` so the list only changes when the save worked.",
  "Don't nest a form array inside another one's form.",
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use a form array for a field that holds a list of small objects: quotas, permissions, environment variables, ports, repositories. Items show as a compact table; one item at a time is added or edited in a form under its row, and the list is the <code class="prose-code">v-model</code>.</p>
  <ComponentExample name="form-array/FormArrayBasic" />
  <Callout type="note">The form edits a copy. <code class="prose-code">v-model</code> only changes on Save, as a new array, so Cancel and Escape leave the list untouched.</Callout>

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="inline" :level="3">Inline editing</DocHeading>
  <p><code class="prose-code">mode="inline"</code> edits in the row itself. Give each editable column a <code class="prose-code">#field-&lt;key&gt;</code> slot; Enter saves and Escape cancels. <code class="prose-code">#cell-&lt;key&gt;</code> customises how a column displays.</p>
  <ComponentExample name="form-array/FormArrayInline" />

  <DocHeading id="async" :level="3">Saving to the API and confirming removal</DocHeading>
  <p><code class="prose-code">before-save</code> runs after <code class="prose-code">validate</code>; while it's pending Save shows a spinner, and if it returns <code class="prose-code">false</code> or throws, the form stays open with the error. <code class="prose-code">before-remove</code> can open a <RouterLink to="/components/delete-modal">Delete Modal</RouterLink> and resolve with the answer. Saving for <em>dev-kind</em> fails on purpose here.</p>
  <ComponentExample name="form-array/FormArrayAsync" />

  <DocHeading id="states" :level="3">Empty, required, read-only, disabled</DocHeading>
  <p>The empty state replaces the table (or use the <code class="prose-code">empty</code> slot). <code class="prose-code">required</code> only adds the asterisk; pass <code class="prose-code">error-msg</code> when the list is empty on submit. <code class="prose-code">readonly</code> hides the actions, <code class="prose-code">collapsible</code> folds the field to its header, and a <code class="prose-code">details</code> slot adds a toggle to each row. Columns take an AcCellValue <code class="prose-code">type</code>, here <code class="prose-code">date</code>.</p>
  <ComponentExample name="form-array/FormArrayStates" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>The field is a <code class="prose-code">role="group"</code> labelled by its label and described by its error or hint. The table has the label as its caption.</li>
    <li>Row buttons are labelled with the item: “Edit quota Postgres”, “Remove quota MongoDB”.</li>
    <li>Opening a form moves focus to its first field; Save, Cancel and Escape return focus to the row's Edit button (or Add); removing moves it to the next row.</li>
    <li>Adds, updates and removals are announced in a polite live region. Errors from <code class="prose-code">before-save</code> use <code class="prose-code">role="alert"</code>, and failed validation focuses the first invalid field.</li>
    <li>The collapse button and detail toggles expose <code class="prose-code">aria-expanded</code>.</li>
  </ul>

  <ApiTables
    component="AcFormArray"
    :extra-slots="[
      { name: 'field-<key>', type: '{ item: T; index: number; error: string; errors: Record<string, string> }', description: 'The field for column `key` in `inline` mode.' },
      { name: 'cell-<key>', type: '{ item: T; index: number; value: unknown }', description: 'Custom display of column `key`.' },
    ]"
  />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">rounded-10 border-border shadow-xs</code></td><td class="px-4 py-3">Item table</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">bg-surface-muted</code></td><td class="px-4 py-3">Header row, open form, details</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">border-dashed border-border-dark</code></td><td class="px-4 py-3">Empty state</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">border-red-60 text-red-30</code></td><td class="px-4 py-3">Field error</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">hover:bg-red-95 hover:text-red-30</code></td><td class="px-4 py-3">Remove button</td></tr>
      </tbody>
    </table>
  </div>
</template>
