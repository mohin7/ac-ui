<script setup lang="ts">
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = [
  "Use a side panel to edit or inspect one item while keeping the list behind it in view.",
  "Title it with the item or the action: “Edit demo-postgres”, “Issuing a License”.",
  "Keep Cancel before the primary action in the footer.",
  "Use `autofocus` on the first field.",
];
const donts = [
  "Don't open a side panel from a modal, or a modal from a side panel.",
  "Don't use one for a quick yes/no question — that's a Modal.",
  "Don't turn off `closable` unless a request is running.",
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>
    Use a side panel for details and edit forms that are too long for a modal but don't deserve their own page — editing a database, reviewing an
    alert, reading license instructions. It shares <RouterLink to="/components/modal">Modal</RouterLink>'s API and behaviour.
  </p>
  <ComponentExample name="side-panel/SidePanelBasic" center />
  <Callout type="note">
    Open it with <code class="prose-code">v-model:open</code>. Focus moves into the panel (to an <code class="prose-code">autofocus</code> field if there is one),
    Tab stays inside, Escape and the backdrop close it, and focus returns to the button that opened it. The page behind stops scrolling, sharing one lock
    with any open modal.
  </Callout>

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="sizes" :level="3">Sizes and side</DocHeading>
  <p>
    <code class="prose-code">size</code> is <code class="prose-code">small</code> 400px, <code class="prose-code">normal</code> 520px,
    <code class="prose-code">large</code> 800px or <code class="prose-code">full</code>. On phones the panel always takes the full width.
    <code class="prose-code">side="left"</code> slides it in from the left.
  </p>
  <ComponentExample name="side-panel/SidePanelSizes" center />
  <DocHeading id="details" :level="3">Details view</DocHeading>
  <p>
    <code class="prose-code">hide-footer</code> drops the footer for read-only content. <code class="prose-code">#header-actions</code> adds buttons next to
    the close button.
  </p>
  <ComponentExample name="side-panel/SidePanelDetails" center />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li><code class="prose-code">role="dialog"</code> with <code class="prose-code">aria-modal</code>, labelled by the title and described by <code class="prose-code">description</code>.</li>
    <li>Focus is trapped while open and returned to the opener on close. An open select or menu inside handles Escape before the panel does.</li>
    <li>The slide respects <code class="prose-code">prefers-reduced-motion</code>: with reduced motion the panel only fades.</li>
  </ul>

  <ApiTables component="AcSidePanel" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">bg-surface border-l border-border shadow-xl</code></td><td class="px-4 py-3">Panel</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">bg-overlay backdrop-blur-[2px] z-[80]</code></td><td class="px-4 py-3">Backdrop</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">bg-surface-muted border-t</code></td><td class="px-4 py-3">Footer</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">sm:max-w-100 … sm:max-w-200</code></td><td class="px-4 py-3">Sizes</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">transition-transform ease-out-soft motion-reduce:transition-none</code></td><td class="px-4 py-3">Slide</td></tr>
      </tbody>
    </table>
  </div>
</template>
