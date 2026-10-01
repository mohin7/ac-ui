<script setup lang="ts">
import { AcSlider } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const script = 'import { ref } from "vue";\n\nconst diff = ref(30);';

const dos = [
  "Pair the slider with `show-input` when people may need an exact value, like a threshold copied from a runbook.",
  "Add `marks` at meaningful points — 0 / 50 / 100%, 1 week, 2 weeks — rather than every step.",
  "Use `@change` for API calls; `v-model` updates on every pixel of a drag.",
];
const donts = [
  "Don't use a slider for a range wider than about 200 steps without an input; people can't land on a value.",
  "Don't use a slider where the order of values means nothing — use a Select.",
  "Don't hide the label; it also names the thumbs for screen readers.",
];
const theme: [string, string][] = [
  ["bg-slate-90 rounded-full", "Track"],
  ["bg-primary", "Filled part of the track"],
  ["border-primary bg-surface shadow-sm", "Thumb"],
  ["ring-[3px] ring-ring", "Focused or dragged thumb"],
  ["bg-slate-10 text-slate-95", "Value bubble (inverted in dark mode)"],
  ["bg-red-90 / bg-danger", "Track with an error"],
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use a slider to pick a number within known bounds where the rough position matters more than the exact digit: autoscaler thresholds, retention periods, replica bounds. Turn on <code class="prose-code">show-input</code> to type exact values, and <code class="prose-code">range</code> for a lower and upper bound.</p>
  <ComponentPlayground
    tag="AcSlider"
    :component="AcSlider"
    :controls="[
      { prop: 'label', type: 'text' },
      { prop: 'unit', type: 'text' },
      { prop: 'tooltip', type: 'select', options: ['auto', 'always', 'never'] },
      { prop: 'showInput', type: 'boolean' },
      { prop: 'disabled', type: 'boolean' },
      { prop: 'errorMsg', type: 'text' },
    ]"
    :initial="{ label: 'Scale Up Diff Percentage', unit: '%', tooltip: 'auto', showInput: true, disabled: false, errorMsg: '' }"
    :defaults="{ label: '', unit: '', tooltip: 'auto', showInput: false, disabled: false, errorMsg: '' }"
    :extra="{ modelValue: 30, marks: [0, 50, 100], class: 'max-w-md' }"
    extra-code='v-model="diff" :marks="[0, 50, 100]"'
    :script="script"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="basic" :level="3">With an input</DocHeading>
  <p>This is the old form-builder <code class="prose-code">threshold-input</code>: a percentage slider with a number box beside it. Typed values are snapped to <code class="prose-code">step</code> and clamped to <code class="prose-code">min</code>/<code class="prose-code">max</code> when the box loses focus.</p>
  <ComponentExample name="slider/SliderBasic" />
  <DocHeading id="range" :level="3">Range</DocHeading>
  <p><code class="prose-code">range</code> adds a second thumb and makes <code class="prose-code">v-model</code> a <code class="prose-code">[from, to]</code> pair. The thumbs can meet but not cross. <code class="prose-code">change</code> fires when a drag ends or a key is pressed.</p>
  <ComponentExample name="slider/SliderRange" />
  <DocHeading id="marks" :level="3">Marks and formatting</DocHeading>
  <p>Marks can be plain numbers or <code class="prose-code">{ value, label }</code>; clicking a label jumps to it. <code class="prose-code">format-value</code> controls every piece of text, including what screen readers hear. <code class="prose-code">tooltip="always"</code> keeps the bubble visible.</p>
  <ComponentExample name="slider/SliderMarks" />
  <DocHeading id="states" :level="3">Error, hint, decimals and disabled</DocHeading>
  <p>Error and hint text work like <RouterLink to="/components/input">Input</RouterLink>. Decimal steps such as <code class="prose-code">0.05</code> are rounded cleanly.</p>
  <ComponentExample name="slider/SliderStates" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>Each thumb is a <code class="prose-code">role="slider"</code> with <code class="prose-code">aria-valuemin</code>, <code class="prose-code">aria-valuemax</code>, <code class="prose-code">aria-valuenow</code> and an <code class="prose-code">aria-valuetext</code> that includes the unit (“30%”, “7 days”).</li>
    <li>Keyboard: ← ↓ and → ↑ move one step, Page Down / Page Up move a tenth of the range, Home and End jump to the ends.</li>
    <li>In a range the thumbs are named “minimum” and “maximum”, and each one's bounds stop at the other thumb.</li>
    <li>Dragging works with mouse, pen and touch; the track captures the pointer so a drag can leave the slider. The paired inputs are labelled number fields.</li>
  </ul>
  <Callout type="note">The thumb grows slightly on hover only when the viewer hasn't asked for reduced motion.</Callout>

  <ApiTables component="AcSlider" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr v-for="[cls, use] in theme" :key="cls" class="border-t border-border-light first:border-0">
          <td class="px-4 py-3"><code class="prose-code">{{ cls }}</code></td>
          <td class="px-4 py-3">{{ use }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
