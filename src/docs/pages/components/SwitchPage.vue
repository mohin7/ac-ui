<script setup lang="ts">
import { AcSwitch } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const script = "import { ref } from \"vue\";\n\nconst enabled = ref(true);";

const dos = ["Label the setting, not the action: “Enable TLS”, not “Click to enable”.", "Apply the change immediately and show its result."];
const donts = ["Don't use a switch inside a form with a Save button.", "Don't use a switch for choices that aren't on/off."];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use a switch for one setting that takes effect immediately, like enabling TLS. In a form that is submitted later, use a checkbox.</p>
  <ComponentPlayground
    tag="AcSwitch"
    :component="AcSwitch"
    :controls="[{'prop': 'label', 'type': 'text'}, {'prop': 'disabled', 'type': 'boolean'}]"
    :initial="{'label': 'Enable TLS', 'disabled': false}"
    :defaults="{'label': '', 'disabled': false}"
    :extra="{'modelValue': true}"
    extra-code='v-model="enabled"'
    :script="script"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="basic" :level="3">Basic</DocHeading>
  <p>Bind a boolean with <code class="prose-code">v-model</code>.</p>
  <ComponentExample name="switch/SwitchBasic" />
  <DocHeading id="slots" :level="3">Slots</DocHeading>
  <p>Use <code class="prose-code">left</code>, <code class="prose-code">middle</code> and <code class="prose-code">right</code> for extra content such as a status badge.</p>
  <ComponentExample name="switch/SwitchSlots" />
  <DocHeading id="settings-list" :level="3">Settings list</DocHeading>
  <p>A common pattern: title and description on the left, switch on the right.</p>
  <ComponentExample name="switch/SwitchList" />
  <DocHeading id="disabled" :level="3">Disabled</DocHeading>
  <p>For settings managed elsewhere.</p>
  <ComponentExample name="switch/SwitchDisabled" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>A <code class="prose-code">&lt;button role="switch"&gt;</code> with <code class="prose-code">aria-checked</code>; Space and Enter toggle it.</li>
    <li>The visible label is linked with <code class="prose-code">for</code>/<code class="prose-code">id</code>.</li>
  </ul>

  <ApiTables component="AcSwitch" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-white shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">bg-primary</code></td><td class="px-4 py-3">On</td></tr>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">bg-slate-70</code></td><td class="px-4 py-3">Off</td></tr>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">rounded-50</code></td><td class="px-4 py-3">Track</td></tr>
      </tbody>
    </table>
  </div>
</template>
