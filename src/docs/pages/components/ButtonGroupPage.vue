<script setup lang="ts">
import { AcSegmentedControl } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const script = "import { ref } from \"vue\";\n\nconst range = ref(\"24h\");\nconst ranges = [\n  { value: \"1h\", label: \"1h\" },\n  { value: \"24h\", label: \"24h\" },\n  { value: \"7d\", label: \"7d\" },\n];";

const dos = [
  "Put the primary action last in a right-aligned footer row: Cancel, then Create.",
  "Use `attached` only for buttons that act on the same thing, like Start / Restart / Stop.",
  "Use a segmented control to switch between 2–5 views of the same data: YAML / JSON, 1h / 24h / 7d.",
  "Give every group of icon-only buttons a `label`, and each button an `aria-label`.",
];
const donts = [
  "Don't use a segmented control to submit or trigger actions — its segments are radio buttons.",
  "Don't put more than five segments in one control; use a Select instead.",
  "Don't attach buttons of different colours; the shared border only reads with one colour.",
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>
    <code class="prose-code">AcButtons</code> lays out a row of related buttons: form footers, page-header actions and toolbars. With
    <code class="prose-code">attached</code> the buttons share their borders and read as one control.
    <code class="prose-code">AcSegmentedControl</code> is a single choice between a few views, like a set of radio buttons that look like a toggle.
  </p>
  <ComponentExample name="button-group/ButtonsBasic" />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="align" :level="3">Alignment</DocHeading>
  <p>
    <code class="prose-code">align</code> is <code class="prose-code">start</code>, <code class="prose-code">center</code>, <code class="prose-code">end</code>
    or <code class="prose-code">between</code>. The row wraps on narrow screens; <code class="prose-code">gap</code> sets the spacing and
    <code class="prose-code">inline</code> shrinks the group to its content.
  </p>
  <ComponentExample name="button-group/ButtonsAlign" />
  <DocHeading id="attached" :level="3">Attached</DocHeading>
  <p>
    <code class="prose-code">attached</code> joins the buttons: only the outer corners are rounded and neighbouring borders overlap. Any bordered element
    works as a child, like the replica count here.
  </p>
  <ComponentExample name="button-group/ButtonsAttached" center />

  <DocHeading id="segmented-control" :level="3">Segmented control</DocHeading>
  <p>
    Bind the chosen <code class="prose-code">value</code> with <code class="prose-code">v-model</code>. Options are
    <code class="prose-code">{ value, label, icon?, disabled? }</code> or plain strings.
  </p>
  <ComponentPlayground
    tag="AcSegmentedControl"
    :component="AcSegmentedControl"
    :controls="[{'prop': 'size', 'type': 'select', 'options': ['small', 'normal']}, {'prop': 'block', 'type': 'boolean'}, {'prop': 'disabled', 'type': 'boolean'}, {'prop': 'label', 'type': 'text'}]"
    :initial="{'size': 'normal', 'block': false, 'disabled': false, 'label': 'Metrics range'}"
    :defaults="{'size': 'normal', 'block': false, 'disabled': false, 'label': ''}"
    :extra="{'modelValue': '24h', 'options': [{'value': '1h', 'label': '1h'}, {'value': '24h', 'label': '24h'}, {'value': '7d', 'label': '7d'}]}"
    extra-code='v-model="range" :options="ranges"'
    :script="script"
  />
  <ComponentExample name="button-group/SegmentedBasic" />
  <DocHeading id="segmented-icons" :level="3">With icons</DocHeading>
  <p>
    Pass a Lucide component as <code class="prose-code">icon</code>. <code class="prose-code">icon-only</code> hides the text; each
    <code class="prose-code">label</code> becomes the segment's accessible name and hover title.
  </p>
  <ComponentExample name="button-group/SegmentedIcons" center />
  <DocHeading id="segmented-states" :level="3">Sizes, full width and disabled</DocHeading>
  <p>
    <code class="prose-code">size="small"</code> fits toolbars and cards, <code class="prose-code">block</code> gives equal-width segments across the row,
    and options can be <code class="prose-code">disabled</code> one at a time or all together.
  </p>
  <ComponentExample name="button-group/SegmentedStates" />
  <Callout type="tip">
    For choices inside a form that are submitted with it, use <RouterLink to="/components/check-radio">CheckRadio</RouterLink>. For switching between whole
    sections of a page, use <RouterLink to="/components/tabs">Tabs</RouterLink>.
  </Callout>

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li><code class="prose-code">AcButtons</code> renders <code class="prose-code">role="group"</code>, named by <code class="prose-code">label</code>. Each button keeps its own Tab stop.</li>
    <li>
      <code class="prose-code">AcSegmentedControl</code> is a <code class="prose-code">role="radiogroup"</code> of <code class="prose-code">role="radio"</code>
      buttons with <code class="prose-code">aria-checked</code>. Only the selected segment is in the Tab order.
    </li>
    <li>Keyboard: ← → (or ↑ ↓) move to the next segment and select it, Home and End jump to the first and last. Disabled segments are skipped.</li>
  </ul>

  <ApiTables component="AcButtons" heading="Buttons API" />
  <ApiTables component="AcSegmentedControl" heading="Segmented Control API" id-prefix="segmented-" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes these components use, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">gap-1 gap-2 gap-3</code></td><td class="px-4 py-3">Group spacing</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">rounded-l-6 rounded-r-6 -ml-px</code></td><td class="px-4 py-3">Attached buttons</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">rounded-8 border-border bg-surface-muted p-0.5</code></td><td class="px-4 py-3">Segmented track</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">bg-surface shadow-sm ring-1 ring-border</code></td><td class="px-4 py-3">Selected segment</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">text-muted hover:text-heading</code></td><td class="px-4 py-3">Other segments</td></tr>
      </tbody>
    </table>
  </div>
</template>
