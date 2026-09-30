<script setup lang="ts">
import { AcTabs } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const script = "import { ref } from \"vue\";\n\nconst tab = ref(\"overview\");\nconst items = [\n  { key: \"overview\", label: \"Overview\" },\n  { key: \"backups\", label: \"Backups\", count: 12 },\n  { key: \"yaml\", label: \"YAML\" },\n];";

const dos = ["Keep labels to one or two words.", "Keep the active tab in the URL when people may share or refresh the view."];
const donts = ["Don't use tabs for sequential steps — use Steps.", "Don't hide critical information behind a non-default tab."];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use tabs to switch between sibling views of one resource: Overview, Backups, Monitoring, YAML. For moving between app sections, use the sidebar.</p>
  <ComponentPlayground
    tag="AcTabs"
    :component="AcTabs"
    :controls="[]"
    :initial="{}"
    :defaults="{}"
    :extra="{'items': [{'key': 'overview', 'label': 'Overview'}, {'key': 'backups', 'label': 'Backups', 'count': 12}, {'key': 'yaml', 'label': 'YAML'}], 'modelValue': 'overview'}"
    extra-code='v-model="tab" :items="items"'
    :script="script"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="basic" :level="3">Basic</DocHeading>
  <p><code class="prose-code">v-model</code> holds the active tab's <code class="prose-code">key</code>.</p>
  <ComponentExample name="tabs/TabsBasic" />
  <DocHeading id="panels" :level="3">Panels, counts and disabled</DocHeading>
  <p>The default slot receives <code class="prose-code">active</code> so you can render the panel. <code class="prose-code">count</code> adds a pill; <code class="prose-code">disabled</code> blocks a tab.</p>
  <ComponentExample name="tabs/TabsPanels" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>Uses <code class="prose-code">role="tablist"</code>, <code class="prose-code">role="tab"</code> with <code class="prose-code">aria-selected</code>, and <code class="prose-code">role="tabpanel"</code>.</li>
  </ul>

  <ApiTables component="AcTabs" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-white shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">border-primary text-heading</code></td><td class="px-4 py-3">Active tab</td></tr>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">border-b border-border</code></td><td class="px-4 py-3">Baseline</td></tr>
      </tbody>
    </table>
  </div>
</template>
