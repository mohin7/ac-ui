<script setup lang="ts">
import { AcCheckRadio } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const script = "import { ref } from \"vue\";\n\nconst mode = ref(\"cluster\");\nconst options = [\n  { value: \"standalone\", label: \"Standalone\", description: \"One pod. For development.\" },\n  { value: \"cluster\", label: \"Cluster\", description: \"Three replicas with automatic failover.\" },\n];";

const dos = ["Pre-select the recommended option.", "Use cards when options need a sentence of explanation."];
const donts = ["Don't use radios for more than about six options.", "Don't leave a group with no default unless the choice must be deliberate."];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use radios when people must pick exactly one of a few visible options. More than about six options: use a select.</p>
  <ComponentPlayground
    tag="AcCheckRadio"
    :component="AcCheckRadio"
    :controls="[{'prop': 'row', 'type': 'boolean'}, {'prop': 'cards', 'type': 'boolean'}]"
    :initial="{'row': true, 'cards': false}"
    :defaults="{'row': false, 'cards': false}"
    :extra="{'options': [{'value': 'standalone', 'label': 'Standalone', 'description': 'One pod. For development.'}, {'value': 'cluster', 'label': 'Cluster', 'description': 'Three replicas with automatic failover.'}], 'modelValue': 'cluster'}"
    extra-code='v-model="mode" :options="options"'
    :script="script"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="basic" :level="3">Basic</DocHeading>
  <p>Stacked radios; <code class="prose-code">v-model</code> holds the selected value.</p>
  <ComponentExample name="check-radio/CheckRadioBasic" />
  <DocHeading id="row" :level="3">Row</DocHeading>
  <p><code class="prose-code">row</code> lays short options side by side.</p>
  <ComponentExample name="check-radio/CheckRadioRow" />
  <DocHeading id="cards" :level="3">Cards</DocHeading>
  <p><code class="prose-code">cards</code> turns each option into a selectable card with its <code class="prose-code">description</code>.</p>
  <ComponentExample name="check-radio/CheckRadioCards" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>Wrapped in <code class="prose-code">role="radiogroup"</code>; arrow keys move between options natively.</li>
    <li>Each group gets a unique <code class="prose-code">name</code>, so several groups on a page don't collide.</li>
  </ul>

  <ApiTables component="AcCheckRadio" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">checked:border-[5px] checked:border-primary</code></td><td class="px-4 py-3">Selected dot</td></tr>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">has-checked:border-primary has-checked:bg-primary-97</code></td><td class="px-4 py-3">Selected card</td></tr>
      </tbody>
    </table>
  </div>
</template>
