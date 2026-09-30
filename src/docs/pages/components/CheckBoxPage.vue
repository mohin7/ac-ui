<script setup lang="ts">
import { AcCheckBox } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const script = "import { ref } from \"vue\";\n\nconst selected = ref([\"monitoring\"]);\nconst options = [\n  { value: \"monitoring\", label: \"Monitoring\" },\n  { value: \"backup\", label: \"Backups\" },\n  { value: \"ingress\", label: \"Ingress\" },\n];";

const dos = ["Phrase each option positively: “Enable monitoring”.", "List options in a logical order."];
const donts = ["Don't use a checkbox group for mutually exclusive choices — use CheckRadio.", "Don't use a checkbox for an instant toggle — use Switch."];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use checkboxes for independent choices in a list, submitted with a form. For a single setting that applies immediately, use a Switch.</p>
  <ComponentPlayground
    tag="AcCheckBox"
    :component="AcCheckBox"
    :controls="[{'prop': 'errorMsg', 'type': 'text'}]"
    :initial="{'errorMsg': ''}"
    :defaults="{'errorMsg': ''}"
    :extra="{'modelValue':['monitoring'],'options': [{'value': 'monitoring', 'label': 'Monitoring'}, {'value': 'backup', 'label': 'Backups'}, {'value': 'ingress', 'label': 'Ingress'}]}"
    extra-code='v-model="selected" :options="options"'
    :script="script"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="basic" :level="3">Basic</DocHeading>
  <p><code class="prose-code">v-model</code> is an array of the checked values.</p>
  <ComponentExample name="checkbox/CheckBoxBasic" />
  <DocHeading id="disabled" :level="3">Disabled option</DocHeading>
  <p>Set <code class="prose-code">disabled</code> on an option that isn't available.</p>
  <ComponentExample name="checkbox/CheckBoxDisabled" />
  <DocHeading id="error" :level="3">Error</DocHeading>
  <p>Show <code class="prose-code">error-msg</code> under the group.</p>
  <ComponentExample name="checkbox/CheckBoxError" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>Each option is a native checkbox inside its <code class="prose-code">&lt;label&gt;</code>.</li>
    <li>The check mark is drawn with CSS and hidden from assistive tech.</li>
  </ul>

  <ApiTables component="AcCheckBox" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">checked:bg-primary checked:border-primary</code></td><td class="px-4 py-3">Checked</td></tr>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">rounded-4 border-border-dark shadow-xs</code></td><td class="px-4 py-3">Box</td></tr>
      </tbody>
    </table>
  </div>
</template>
