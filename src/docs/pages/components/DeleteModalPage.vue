<script setup lang="ts">
import ApiTables from "../../components/ApiTables.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = ["Name the exact item: `item-name=\"demo-postgres\"`.", "Say what's lost and what's kept in `detail`.", "Use `confirm-by-typing` for databases, clusters and anything without undo."];
const donts = ["Don't use “Yes” / “No” as button labels — say “Delete Database”.", "Don't close the dialog before the delete request succeeds."];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use this to confirm a destructive action. It names the item, explains the consequence and, for irreversible deletes, asks people to type the name. Also exported as <code class="prose-code">AcDeleteConfirmationModal</code>, the old library's name.</p>
  <ComponentExample name="delete-modal/DeleteBasic" center />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="typing" :level="3">Type to confirm, with loading</DocHeading>
  <p><code class="prose-code">confirm-by-typing</code> keeps the delete button disabled until the name matches. Set <code class="prose-code">loading</code> while the request runs — the dialog can't be closed until it finishes.</p>
  <ComponentExample name="delete-modal/DeleteTyping" center />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>Built on AcModal, so it has the same focus trap and Escape handling (Escape is ignored while <code class="prose-code">loading</code>).</li>
    <li>The icon is decorative; the message carries the meaning.</li>
  </ul>

  <ApiTables component="AcDeleteModal" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">bg-red-95 text-red-40 ring-red-97</code></td><td class="px-4 py-3">Warning icon</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">color="danger"</code></td><td class="px-4 py-3">Confirm button</td></tr>
      </tbody>
    </table>
  </div>
</template>
