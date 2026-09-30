<script setup lang="ts">
import { AcDivider } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = ["Use a divider between groups that would otherwise run together, e.g. two sets of fields in one card.", "Use a labelled divider for “OR” between two ways of doing the same thing.", "Set the spacing around it with margin or gap classes where you use it."];
const donts = ["Don't put a divider between every row — use spacing, or a table's row borders.", "Don't use a divider under a heading as decoration; headings already separate content.", "Don't add a divider at the edge of a card; the card's border is already there."];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use a divider to separate groups of content in a card, a form or a toolbar. It is a 1px line in the border colour, optionally with a short label.</p>
  <ComponentPlayground
    tag="AcDivider"
    :component="AcDivider"
    :controls="[{'prop': 'label', 'type': 'text'}, {'prop': 'align', 'type': 'select', 'options': ['center', 'left']}]"
    :initial="{'label': 'OR', 'align': 'center'}"
    :defaults="{'label': '', 'align': 'center'}"
  />
  <Callout type="note">The divider has no margin of its own, so it fits flex and grid gaps. Add <code class="prose-code">class="my-4"</code> (the old default) where you need space.</Callout>

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="basic" :level="3">Horizontal</DocHeading>
  <p>The default is a full-width horizontal line.</p>
  <ComponentExample name="divider/DividerBasic" />
  <DocHeading id="label" :level="3">With a label</DocHeading>
  <p><code class="prose-code">label</code> puts short text in the line, centred or, with <code class="prose-code">align="left"</code>, at the start like a section heading.</p>
  <ComponentExample name="divider/DividerLabel" />
  <DocHeading id="vertical" :level="3">Vertical</DocHeading>
  <p><code class="prose-code">orientation="vertical"</code> separates items in a row. It stretches to the row's height, at least 16px.</p>
  <ComponentExample name="divider/DividerVertical" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>A plain divider is <code class="prose-code">role="separator"</code> with <code class="prose-code">aria-orientation</code>.</li>
    <li>A labelled divider is ordinary text between two hidden lines, so the label (“OR”) is read in order.</li>
  </ul>

  <ApiTables component="AcDivider" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">h-px bg-border</code></td><td class="px-4 py-3">Horizontal line</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">w-px self-stretch min-h-4</code></td><td class="px-4 py-3">Vertical line</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">text-xs font-medium text-muted gap-3</code></td><td class="px-4 py-3">Label</td></tr>
      </tbody>
    </table>
  </div>
</template>
