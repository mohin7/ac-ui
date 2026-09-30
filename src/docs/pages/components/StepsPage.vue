<script setup lang="ts">
import { AcSteps } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const script = "const steps = [\n  { id: 1, title: \"Select Cluster\", description: \"Choose where to deploy\" },\n  { id: 2, title: \"Configure\", description: \"Version and storage\" },\n  { id: 3, title: \"Review\", description: \"Confirm and deploy\" },\n];";

const dos = ["Use 3–5 steps with short noun titles.", "Let people go back without losing input."];
const donts = ["Don't use Steps as navigation between unrelated pages."];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use steps to show progress through a multi-step flow such as Create Database or Import Cluster. You control <code class="prose-code">active</code> from your wizard state.</p>
  <ComponentPlayground
    tag="AcSteps"
    :component="AcSteps"
    :controls="[{'prop': 'active', 'type': 'select', 'options': [1, 2, 3, 4]}]"
    :initial="{'active': 2}"
    :defaults="{}"
    :extra="{'options': [{'id': 1, 'title': 'Select Cluster', 'description': 'Choose where to deploy'}, {'id': 2, 'title': 'Configure', 'description': 'Version and storage'}, {'id': 3, 'title': 'Review', 'description': 'Confirm and deploy'}]}"
    extra-code=':options="steps"'
    :script="script"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="basic" :level="3">Basic</DocHeading>
  <p>Steps with an id lower than <code class="prose-code">active</code> show a check mark.</p>
  <ComponentExample name="steps/StepsBasic" />
  <DocHeading id="wizard" :level="3">In a wizard</DocHeading>
  <p>Drive <code class="prose-code">active</code> with Back and Next buttons.</p>
  <ComponentExample name="steps/StepsWizard" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>Renders an ordered list; the current step has <code class="prose-code">aria-current="step"</code>.</li>
  </ul>

  <ApiTables component="AcSteps" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">bg-primary text-white / ring-2 ring-primary</code></td><td class="px-4 py-3">Completed / current</td></tr>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">bg-surface ring-1 ring-border-dark text-muted</code></td><td class="px-4 py-3">Upcoming</td></tr>
      </tbody>
    </table>
  </div>
</template>
