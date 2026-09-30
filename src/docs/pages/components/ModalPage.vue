<script setup lang="ts">
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = ["Title the modal with the action: “Invite Member”, “Delete Database”.", "Put Cancel before the primary action in the footer.", "Use `autofocus` on the first field."];
const donts = ["Don't open a modal from inside a modal.", "Don't use a modal for information that could be inline.", "Don't make people scroll a modal to find its primary button — the footer stays visible for that reason."];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use a modal for a short, focused task that needs an answer before people continue — invite a member, confirm an upgrade, edit one setting. Longer flows belong on their own page.</p>
  <ComponentExample name="modal/ModalBasic" center />
  <Callout type="note">Open it with <code class="prose-code">v-model:open</code>. Focus moves into the dialog (to an <code class="prose-code">autofocus</code> field if there is one), Tab stays inside, Escape and the backdrop close it, and focus returns to the button that opened it.</Callout>

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="sizes" :level="3">Sizes</DocHeading>
  <p><code class="prose-code">small</code> for confirmations, <code class="prose-code">normal</code> for short forms, <code class="prose-code">medium</code> and <code class="prose-code">large</code> for tables or side-by-side content.</p>
  <ComponentExample name="modal/ModalSizes" center />
  <DocHeading id="persistent" :level="3">Blocking while working</DocHeading>
  <p>Set <code class="prose-code">:closable="false"</code> while a request runs so the dialog can't be dismissed halfway, and <code class="prose-code">close-on-outside-click="false"</code> for anything that would lose input.</p>
  <ComponentExample name="modal/ModalPersistent" center />
  <DocHeading id="scrolling" :level="3">Long content</DocHeading>
  <p>The body scrolls; the header and footer stay put. Use <code class="prose-code">footer-left</code> for secondary information.</p>
  <ComponentExample name="modal/ModalScroll" center />
  <DocHeading id="delete" :level="3">Delete confirmation</DocHeading>
  <p>For destructive actions use <RouterLink to="/components/delete-modal">Delete Modal</RouterLink>, which is built on this component.</p>

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li><code class="prose-code">role="dialog"</code> with <code class="prose-code">aria-modal</code>, labelled by the title and described by <code class="prose-code">description</code>.</li>
    <li>Focus is trapped while open and returned to the opener on close.</li>
    <li>The page behind stops scrolling; multiple modals share one scroll lock.</li>
  </ul>

  <ApiTables component="AcModal" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-white shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">rounded-12 border-border shadow-xl</code></td><td class="px-4 py-3">Panel</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">bg-slate-10/40 backdrop-blur-[2px]</code></td><td class="px-4 py-3">Backdrop</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">bg-surface-muted border-t</code></td><td class="px-4 py-3">Footer</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">max-w-110 … max-w-250</code></td><td class="px-4 py-3">Sizes</td></tr>
      </tbody>
    </table>
  </div>
</template>
