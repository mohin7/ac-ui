<script setup lang="ts">
import { AcHeader } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = ["Keep the title short; put the context (cluster, namespace) in `subtitle` or the breadcrumb.", "Show at most three actions; move the rest into a menu."];
const donts = ["Don't use more than one solid primary button in the header.", "Don't put filters in the page header — they belong to the table (Content Table)."];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use the header at the top of a page: the page title, an optional back button and breadcrumb, and the page's actions on the right. Set <code class="prose-code">sticky</code> to keep it visible while the page scrolls.</p>
  <ComponentPlayground
    tag="AcHeader"
    :component="AcHeader"
    :controls="[{'prop': 'title', 'type': 'text'}, {'prop': 'subtitle', 'type': 'text'}, {'prop': 'backButton', 'type': 'boolean'}, {'prop': 'sticky', 'type': 'boolean'}]"
    :initial="{'title': 'Databases', 'subtitle': 'appscode / demo-cluster', 'backButton': false, 'sticky': false}"
    :defaults="{'title': '', 'subtitle': '', 'backButton': false, 'sticky': false}"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="actions" :level="3">With actions</DocHeading>
  <p>Actions go in the default slot. Put the primary action last.</p>
  <ComponentExample name="header/HeaderBasic" />
  <DocHeading id="detail" :level="3">Detail page</DocHeading>
  <p><code class="prose-code">back-button</code> emits <code class="prose-code">back</code>; the <code class="prose-code">breadcrumb</code> and <code class="prose-code">title-extra</code> slots add context and status.</p>
  <ComponentExample name="header/HeaderBack" />
  <DocHeading id="header-items" :level="3">AcHeaderItems and AcHeaderItem</DocHeading>
  <p>
    The old library wrapped header controls in <code class="prose-code">AcHeaderItems</code> / <code class="prose-code">AcHeaderItem</code>.
    Both still exist (a flex row with an 8px gap, and a flex cell) so existing markup keeps working, but new code can put buttons straight into the slot.
  </p>

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>Renders a <code class="prose-code">&lt;header&gt;</code> with an <code class="prose-code">&lt;h4&gt;</code> title.</li>
    <li>The back button has <code class="prose-code">aria-label="Back"</code>.</li>
  </ul>

  <ApiTables component="AcHeader" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">border-b border-border-light bg-surface/90 backdrop-blur-md</code></td><td class="px-4 py-3">Bar</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">px-6 py-4</code></td><td class="px-4 py-3">Padding</td></tr>
      </tbody>
    </table>
  </div>
</template>
