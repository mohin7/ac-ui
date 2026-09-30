<script setup lang="ts">
import Callout from "../../components/Callout.vue";
import CodeBlock from "../../components/CodeBlock.vue";
import DocHeading from "../../components/DocHeading.vue";

const rows = [
  ["AcButton", 'modifier-classes="is-primary is-light"', 'variant="light"'],
  ["AcButton", 'modifier-classes="is-danger is-small"', 'color="danger" size="small"'],
  ["AcButton", 'is-loader-active', 'loading'],
  ["AcButton", 'icon-class="plus"', '#icon slot with an SVG'],
  ["AcBadge", 'modifier-classes="is-success is-light is-rounded"', 'color="success" variant="light" rounded'],
  ["AcAlert", 'modifier-classes="is-warning"', 'color="warning"'],
  ["AcInput", 'placeholder-text="Role Name"', 'label="Role Name"'],
  ["AcInput", 'show-star / is-disabled / is-read-only', 'required / disabled / readonly'],
  ["AcCheckRadio", 'has-description / is-row', 'cards / row'],
  ["AcTabs", '<AcTabItem :is-active> children', ':items + v-model'],
  ["AcTable", 'table-headers + AcTableRow / AcTableCell', ':columns + :rows + #cell-<key> slots'],
  ["AcSelect", 'show-by / track-by (vue-multiselect)', ':options="[{ value, label }]"'],
  ["AcSelect", 'is-multi-select / allow-empty', 'multiple / clearable'],
  ["AcSelect", 'group-label + group-values', 'group on each option'],
  ["AcSelect", 'has-refresh-btn / is-loader-active / @refresh-btn-click', 'refreshable / loading / @refresh'],
  ["AcModal", ':open + @closemodal', 'v-model:open + @close'],
  ["AcModal", 'is-close-option-disabled / ignore-outside-click', ':closable="false" / :close-on-outside-click="false"'],
  ["AcModal", 'modifier-classes="is-small|is-normal|is-large"', 'size="small|normal|large"'],
  ["AcModal", '#modal-footer-controls / #modal-header-controls', '#footer / #header-actions'],
  ["AcDeleteConfirmationModal", 'is-delete-active / @delete-confirmation-modal$confirm', 'loading / @confirm'],
  ["AcHeader", 'top-value="87px" / #header-left-controls', 'sticky top="87px" / #title-extra'],
  ["AcContentTable", 'table-title / table-sub-title / #content="{ searchText }"', 'title / subtitle / #default="{ searchText }"'],
  ["AcContentTable", '#content-left-controls / #content-right-controls', '#left-controls / #right-controls'],
  ["AcContentHeader", 'header-title / header-sub-title / remove-border-bottom', 'title / subtitle / :bordered="false"'],
  ["AcSectionContent", 'is-expandable / has-back-button / #header-buttons', 'collapsible / back-button / #actions'],
];

const before = `<AcButton
  title="Delete"
  modifier-classes="is-danger is-light is-small"
  :is-loader-active="deleting"
  @click="remove"
/>`;
const after = `<AcButton
  title="Delete"
  color="danger"
  variant="light"
  size="small"
  :loading="deleting"
  @click="remove"
/>`;
const utils = `<!-- before (Bulma + AppsCode utilities) -->
<div class="is-flex is-align-items-center gap-8 p-16 b-1 is-rounded-4">

<!-- after (Tailwind + AppsCode theme) -->
<div class="flex items-center gap-2 p-4 border border-border rounded-10">`;
</script>

<template>
  <DocHeading id="overview">Overview</DocHeading>
  <p>
    Component names stay the same (<code class="prose-code">AcButton</code>, <code class="prose-code">AcInput</code>…).
    What changes is how variants are passed: typed props instead of Bulma class strings.
  </p>
  <div class="my-4 grid gap-4 md:grid-cols-2">
    <CodeBlock :code="before" filename="Before — @appscode/design-system" />
    <CodeBlock :code="after" filename="After — Tailwind" />
  </div>

  <DocHeading id="props">Prop changes</DocHeading>
  <div class="my-4 overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr>
          <th class="h-9 px-4 font-medium">Component</th>
          <th class="h-9 px-4 font-medium">Before</th>
          <th class="h-9 px-4 font-medium">After</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, i) in rows" :key="i" class="border-t border-border-light">
          <td class="h-9 px-4 font-medium text-heading">{{ r[0] }}</td>
          <td class="px-4 py-2"><code class="font-mono text-[13px] text-red-30">{{ r[1] }}</code></td>
          <td class="px-4 py-2"><code class="font-mono text-[13px] text-green-20">{{ r[2] }}</code></td>
        </tr>
      </tbody>
    </table>
  </div>

  <DocHeading id="utilities">Utility classes</DocHeading>
  <p>
    Pixel utilities become 4px units: <code class="prose-code">.p-16</code> → <code class="prose-code">p-4</code>,
    <code class="prose-code">.mt-24</code> → <code class="prose-code">mt-6</code>. Bulma helpers become Tailwind's.
  </p>
  <CodeBlock :code="utils" lang="html" />

  <DocHeading id="other">Other changes</DocHeading>
  <ul>
    <li>No Bulma or Font Awesome CSS is loaded. Pass icons as inline SVG or icon components.</li>
    <li>Focus is visible: a 2px primary outline on keyboard focus (the old CSS removed button outlines).</li>
    <li>Fonts change from Roboto + Inconsolata to Geist + Geist Mono.</li>
    <li>Controls use a 6px radius and surfaces 10px (was 4px everywhere); <code class="prose-code">rounded-4</code> still exists.</li>
    <li>Shadows are softer and slate-tinted; <code class="prose-code">shadow-sm</code>/<code class="prose-code">lg</code>/<code class="prose-code">xl</code> keep their names.</li>
    <li>Light theme only, as before — the old package had no dark palette either.</li>
  </ul>
  <Callout type="note">
    22 components are ported so far. Components not listed in the sidebar still come from
    <code class="prose-code">@appscode/design-system</code>.
  </Callout>
</template>
