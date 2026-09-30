<script setup lang="ts">
import { AcProgress } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = ["Label every bar with what is progressing: “Backup demo-postgres”, “Storage”.", "Use `color=\"auto\"` for quotas and limits so people see trouble before it happens.", "Give real units with `value-text`: “26 of 32 GiB” says more than 81%."];
const donts = ["Don't use a progress bar for a status that can't be measured — use `indeterminate` or a Spinner.", "Don't let a bar go backwards; start a new one for a new phase.", "Don't pick `danger` for a bar that is simply nearly done."];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use a progress bar for work you can measure — a backup, a restore, an upgrade across nodes — and for how much of a quota is used. For work of unknown length, use <code class="prose-code">indeterminate</code> or a <RouterLink to="/components/spinner">Spinner</RouterLink>.</p>
  <ComponentPlayground
    tag="AcProgress"
    :component="AcProgress"
    :controls="[{'prop': 'value', 'type': 'select', 'options': [0, 25, 64, 82, 97, 100]}, {'prop': 'label', 'type': 'text'}, {'prop': 'showValue', 'type': 'boolean'}, {'prop': 'color', 'type': 'select', 'options': ['primary', 'info', 'success', 'warning', 'danger', 'auto']}, {'prop': 'size', 'type': 'select', 'options': ['small', 'normal', 'large']}, {'prop': 'indeterminate', 'type': 'boolean'}]"
    :initial="{'value': 64, 'label': 'Backup demo-postgres', 'showValue': true, 'color': 'primary', 'size': 'normal', 'indeterminate': false}"
    :defaults="{'value': 0, 'label': '', 'showValue': false, 'color': 'primary', 'size': 'normal', 'indeterminate': false}"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="basic" :level="3">Label and value</DocHeading>
  <p><code class="prose-code">value</code> runs from 0 to <code class="prose-code">max</code> (100 by default). <code class="prose-code">show-value</code> prints the percentage, or <code class="prose-code">value-text</code> when you set it.</p>
  <ComponentExample name="progress/ProgressBasic" />
  <DocHeading id="quota" :level="3">Quotas</DocHeading>
  <p><code class="prose-code">color="auto"</code> is primary below 80%, warning from 80% and danger from 95%, and colours the value text to match.</p>
  <ComponentExample name="progress/ProgressQuota" />
  <DocHeading id="colors" :level="3">Colors</DocHeading>
  <p>Set a tone yourself when the colour carries meaning, e.g. success once a task completes.</p>
  <ComponentExample name="progress/ProgressColors" />
  <DocHeading id="sizes" :level="3">Sizes</DocHeading>
  <p><code class="prose-code">small</code> 4px for table cells and cards, <code class="prose-code">normal</code> 6px, <code class="prose-code">large</code> 10px for the main task on a page.</p>
  <ComponentExample name="progress/ProgressSizes" />
  <DocHeading id="indeterminate" :level="3">Indeterminate</DocHeading>
  <p>A sliding bar for work that has started but can't report how far it has got.</p>
  <ComponentExample name="progress/ProgressIndeterminate" />
  <DocHeading id="live" :level="3">Live updates</DocHeading>
  <p>Changes to <code class="prose-code">value</code> animate the width. Switch to <code class="prose-code">success</code> when the task finishes.</p>
  <ComponentExample name="progress/ProgressLive" />
  <Callout type="note">The old <code class="prose-code">UsageThreshold</code> was a range input for setting a threshold, not a progress bar. Use a native <code class="prose-code">&lt;input type="range"&gt;</code> for setting a value, and AcProgress for showing one.</Callout>

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>The bar is <code class="prose-code">role="progressbar"</code> with <code class="prose-code">aria-valuemin</code>, <code class="prose-code">aria-valuemax</code>, <code class="prose-code">aria-valuenow</code> and <code class="prose-code">aria-valuetext</code> (the percentage or <code class="prose-code">value-text</code>).</li>
    <li>It is named by <code class="prose-code">label</code> through <code class="prose-code">aria-labelledby</code>. Without a label it is just “Progress”, so always pass one.</li>
    <li>Indeterminate bars leave out the value and set <code class="prose-code">aria-busy</code>. With reduced motion they stop sliding and show a faint full-width bar.</li>
    <li>Colour is never the only signal: pair <code class="prose-code">auto</code> with <code class="prose-code">show-value</code> so the number is visible.</li>
  </ul>

  <ApiTables component="AcProgress" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">rounded-full bg-slate-90</code></td><td class="px-4 py-3">Track</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">bg-primary bg-info bg-success bg-warning bg-danger</code></td><td class="px-4 py-3">Fill</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">h-1 h-1.5 h-2.5</code></td><td class="px-4 py-3">Sizes</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">text-xs font-medium text-label</code> / <code class="prose-code">text-muted tabular-nums</code></td><td class="px-4 py-3">Label / value</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">text-yellow-20 text-red-30</code></td><td class="px-4 py-3">Value text in <code class="prose-code">auto</code> warning / danger</td></tr>
      </tbody>
    </table>
  </div>
</template>
