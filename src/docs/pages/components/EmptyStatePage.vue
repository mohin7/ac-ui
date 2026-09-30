<script setup lang="ts">
import { AcEmptyState } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = [
  "Say what's missing in the title: “No databases yet”, “No results for ‘redis’”.",
  "Offer the next step as a button: create the first item, clear the filters, try again.",
  "Say why it failed in an error state, when you know.",
];
const donts = [
  "Don't show an empty state while data is still loading — show a skeleton or spinner.",
  "Don't blame people (“You have no…”); describe the state.",
  "Don't use the large size inside a card or table; use `small`.",
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use an empty state wherever a list or page can have nothing to show: a namespace with no databases, a search with no matches, a request that failed. Tell people what happened and give them a way forward.</p>
  <ComponentPlayground
    tag="AcEmptyState"
    :component="AcEmptyState"
    :controls="[{'prop': 'variant', 'type': 'select', 'options': ['empty', 'search', 'error']}, {'prop': 'size', 'type': 'select', 'options': ['small', 'normal', 'large']}, {'prop': 'title', 'type': 'text'}, {'prop': 'description', 'type': 'text'}, {'prop': 'query', 'type': 'text'}]"
    :initial="{'variant': 'empty', 'size': 'normal', 'title': '', 'description': 'Backups will appear here after the first scheduled run.', 'query': ''}"
    :defaults="{'variant': 'empty', 'size': 'normal', 'title': '', 'description': '', 'query': ''}"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="empty" :level="3">Empty list</DocHeading>
  <p>Pass a Lucide icon with <code class="prose-code">icon</code>, and the next steps in the <code class="prose-code">actions</code> slot — the main one first.</p>
  <ComponentExample name="empty-state/EmptyStateBasic" />
  <DocHeading id="search" :level="3">No search results</DocHeading>
  <p><code class="prose-code">variant="search"</code> with a <code class="prose-code">query</code> titles itself “No results for ‘pg-staging’”. Offer to clear the search or filters.</p>
  <ComponentExample name="empty-state/EmptyStateSearch" />
  <DocHeading id="error" :level="3">Error</DocHeading>
  <p><code class="prose-code">variant="error"</code> uses a red icon and is announced as an alert. Put the reason in <code class="prose-code">description</code> and a retry button in <code class="prose-code">actions</code>.</p>
  <ComponentExample name="empty-state/EmptyStateError" />
  <DocHeading id="sizes" :level="3">Sizes</DocHeading>
  <p><code class="prose-code">small</code> fits inside a table or card, <code class="prose-code">normal</code> fills a list area, and <code class="prose-code">large</code> is for a whole page.</p>
  <ComponentExample name="empty-state/EmptyStateSizes" />
  <Callout type="tip">For a full page with 404, loading and error states, see the <RouterLink to="/examples/states">Empty &amp; error states</RouterLink> example.</Callout>

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>The icon is decorative and hidden from screen readers; the title carries the meaning.</li>
    <li>The <code class="prose-code">error</code> variant is <code class="prose-code">role="alert"</code>, so a failure that replaces a list is announced.</li>
    <li>When a search clears to an empty state, keep focus in the search field so people can keep typing.</li>
  </ul>

  <ApiTables component="AcEmptyState" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">rounded-10 border-border bg-surface-muted text-muted shadow-xs</code></td><td class="px-4 py-3">Icon tile</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">border-red-90 bg-red-97 text-red-40</code></td><td class="px-4 py-3">Error icon tile</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">font-semibold text-heading · text-muted</code></td><td class="px-4 py-3">Title and description</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">py-6 · py-12 · py-20</code></td><td class="px-4 py-3">Sizes</td></tr>
      </tbody>
    </table>
  </div>
</template>
