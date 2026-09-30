<script setup lang="ts">
import { AcTag } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = ["Use tags for things people typed, picked or filter by: labels, annotations, regions, active filters.", "Use `key-label` and `value-label` for Kubernetes labels so keys line up and read as code.", "Keep most tags `neutral`; use a tone only when it groups tags by kind, the same way every time."];
const donts = ["Don't use a tag for a resource's status — that is a Badge (Ready, Failed).", "Don't make a tag a link or a button; only its remove button is interactive.", "Don't wrap long label values yourself: the tag truncates to its container. Add a `title` with the full text."];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use a tag for a label, a filter or a key–value pair such as a Kubernetes label. Tags are bordered chips that can be removed. For status, counts, plan tiers and versions, use a <RouterLink to="/components/badge">Badge</RouterLink>.</p>
  <ComponentPlayground
    tag="AcTag"
    :component="AcTag"
    :controls="[{'prop': 'label', 'type': 'text'}, {'prop': 'color', 'type': 'select', 'options': ['neutral', 'primary', 'info', 'success', 'warning', 'danger']}, {'prop': 'rounded', 'type': 'boolean'}, {'prop': 'removable', 'type': 'boolean'}, {'prop': 'keyLabel', 'type': 'text'}, {'prop': 'valueLabel', 'type': 'text'}]"
    :initial="{'label': 'us-east-1', 'color': 'neutral', 'rounded': false, 'removable': true, 'keyLabel': '', 'valueLabel': ''}"
    :defaults="{'label': '', 'color': 'neutral', 'rounded': false, 'removable': false, 'keyLabel': '', 'valueLabel': ''}"
  />
  <Callout type="note">
    <strong>Tag or Badge?</strong> A badge says what state something is in (Ready, 3 alerts, Enterprise) and is filled. A tag says what something is labelled with (<code class="prose-code">env=prod</code>, us-east-1) or what a list is filtered by, is outlined, and can be removed.
  </Callout>

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="colors" :level="3">Colors</DocHeading>
  <p><code class="prose-code">neutral</code> is the default. A tone tints the border, fill and text; <code class="prose-code">rounded</code> gives a pill.</p>
  <ComponentExample name="tag/TagBasic" center />
  <DocHeading id="removable" :level="3">Removable filters</DocHeading>
  <p><code class="prose-code">removable</code> adds a remove button that emits <code class="prose-code">remove</code>; drop the tag from your list in the handler.</p>
  <ComponentExample name="tag/TagRemovable" center />
  <DocHeading id="key-value" :level="3">Key–value labels</DocHeading>
  <p>Set <code class="prose-code">key-label</code> and <code class="prose-code">value-label</code> for labels, annotations and selectors. The key sits on a muted segment in monospace; <code class="prose-code">color</code> tints the value.</p>
  <ComponentExample name="tag/TagKeyValue" center />
  <DocHeading id="icon" :level="3">With an icon</DocHeading>
  <p>The <code class="prose-code">icon</code> slot takes a Lucide icon, sized to 14px for you.</p>
  <ComponentExample name="tag/TagIcon" center />
  <DocHeading id="truncate" :level="3">Long text</DocHeading>
  <p>A tag never grows wider than its container. Long text ends in an ellipsis, so add a <code class="prose-code">title</code> with the full value.</p>
  <ComponentExample name="tag/TagTruncate" />
  <Callout type="tip">The old <code class="prose-code">Tags</code> wrapper is just a flex row: use <code class="prose-code">&lt;div class="flex flex-wrap gap-1.5"&gt;</code>.</Callout>

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>The remove button is labelled with the tag's text, e.g. “Remove kind: Postgres” or “Remove env=prod”, and shows a focus ring.</li>
    <li>In key–value mode a visually hidden <code class="prose-code">=</code> sits between the key and the value, so screen readers read “env = prod”.</li>
    <li>Icons in the <code class="prose-code">icon</code> slot are hidden from assistive tech; put the meaning in the text.</li>
    <li>After removing a tag, move focus somewhere sensible (the next tag or the filter input) if the removed button had focus.</li>
  </ul>

  <ApiTables component="AcTag" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">h-6 rounded-6 border-border bg-surface text-xs</code></td><td class="px-4 py-3">Neutral tag</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">bg-{hue}-97 border-{hue}-80 text-{hue}-20</code></td><td class="px-4 py-3">Toned tag</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">font-mono bg-surface-muted text-label</code></td><td class="px-4 py-3">Key segment</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">bg-{hue}-95 text-{hue}-10</code></td><td class="px-4 py-3">Toned value segment</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">rounded-50</code></td><td class="px-4 py-3"><code class="prose-code">rounded</code></td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">hover:bg-current/10 focus-visible:ring-ring</code></td><td class="px-4 py-3">Remove button</td></tr>
      </tbody>
    </table>
  </div>
</template>
