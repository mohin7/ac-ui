<script setup lang="ts">
import { AcSkeleton } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = ["Match the shape of what's coming: a table skeleton for a table, cards for cards.", "Use a skeleton when the layout is known and the wait is short; use a Preloader when it isn't.", "Set `label=\"\"` on each piece and `aria-busy` on the region when you compose several."];
const donts = ["Don't show a skeleton for under about 300ms — it flashes. Delay it, or show nothing.", "Don't animate skeletons with anything stronger than the built-in shimmer.", "Don't leave a skeleton up after an error; replace it with the error message."];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use a skeleton in place of content that is loading when you know roughly what it will look like: table rows, cards, a paragraph. It keeps the layout steady and feels faster than a spinner. For a whole page or panel whose layout isn't known yet, use a <RouterLink to="/components/spinner">Preloader</RouterLink>.</p>
  <ComponentPlayground
    tag="AcSkeleton"
    :component="AcSkeleton"
    :controls="[{'prop': 'shape', 'type': 'select', 'options': ['text', 'circle', 'rect', 'table', 'card', 'info-card', 'editor']}, {'prop': 'lines', 'type': 'select', 'options': [1, 2, 3, 5]}, {'prop': 'rows', 'type': 'select', 'options': [3, 5, 8]}, {'prop': 'cols', 'type': 'select', 'options': [3, 4, 6]}, {'prop': 'width', 'type': 'text'}, {'prop': 'height', 'type': 'text'}]"
    :initial="{'shape': 'text', 'lines': 3, 'rows': 5, 'cols': 4, 'width': '', 'height': ''}"
    :defaults="{'shape': 'text', 'lines': 1, 'rows': 5, 'cols': 4, 'width': '', 'height': ''}"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="text" :level="3">Text</DocHeading>
  <p>The default is one 12px line at full width. <code class="prose-code">lines</code> adds more, with the last at 60% so the block reads as a paragraph. <code class="prose-code">height</code> sets each line's height.</p>
  <ComponentExample name="skeleton/SkeletonText" />
  <DocHeading id="shapes" :level="3">Circle and rect</DocHeading>
  <p><code class="prose-code">circle</code> for avatars and icons (<code class="prose-code">height</code> is the diameter, 40px by default), <code class="prose-code">rect</code> for images, charts and buttons (80px tall by default).</p>
  <ComponentExample name="skeleton/SkeletonShapes" />
  <DocHeading id="table" :level="3">Table</DocHeading>
  <p><code class="prose-code">shape="table"</code> draws a header and <code class="prose-code">rows</code> × <code class="prose-code">cols</code> cells with the same heights as <RouterLink to="/components/table">Table</RouterLink>. Put it inside the table's card, in place of the table.</p>
  <ComponentExample name="skeleton/SkeletonTable" />
  <DocHeading id="cards" :level="3">Cards</DocHeading>
  <p><code class="prose-code">info-card</code> stands in for an overview card (icon, title, two key–value rows); <code class="prose-code">card</code> for a card with a title and a paragraph. Both bring their own border and surface.</p>
  <ComponentExample name="skeleton/SkeletonCards" />
  <DocHeading id="editor" :level="3">Editor</DocHeading>
  <p><code class="prose-code">shape="editor"</code> draws a line-number gutter and indented lines, 320px tall like <RouterLink to="/components/code-editor">Code Editor</RouterLink>. Show it while the editor's code downloads; set <code class="prose-code">height</code> to match the editor.</p>
  <DocHeading id="composed" :level="3">Composed layouts</DocHeading>
  <p>Build anything else from lines and rects — here an editor with a file tree, which replaces the old <code class="prose-code">SidebarLoader</code>.</p>
  <ComponentExample name="skeleton/SkeletonComposed" />
  <DocHeading id="swap" :level="3">Swapping in content</DocHeading>
  <p>Render the skeleton while loading, then the real content in the same box, so nothing moves.</p>
  <ComponentExample name="skeleton/SkeletonSwap" />
  <Callout type="tip">Replacing an old loader: <code class="prose-code">ResourceLoader</code> → <code class="prose-code">shape="table"</code>, <code class="prose-code">InfoCardLoader</code> and <code class="prose-code">SingleInfoCardLoader</code> → <code class="prose-code">shape="info-card"</code>, <code class="prose-code">ClusterSwitcherLoader</code> → <code class="prose-code">shape="rect" height="30px"</code>, <code class="prose-code">EditorLoader</code> → <code class="prose-code">shape="editor"</code>, <code class="prose-code">SidebarLoader</code> → compose lines as above.</Callout>

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>Each skeleton sets <code class="prose-code">aria-busy="true"</code> and holds visually hidden text (<code class="prose-code">label</code>, “Loading” by default). The shapes themselves are <code class="prose-code">aria-hidden</code>.</li>
    <li>With <code class="prose-code">label=""</code> the whole skeleton is <code class="prose-code">aria-hidden</code>. Do this for every piece of a composed layout and put <code class="prose-code">aria-busy="true"</code> and one hidden “Loading …” on the wrapper, so it's announced once.</li>
    <li>The shimmer stops under <code class="prose-code">prefers-reduced-motion</code>, leaving flat shapes.</li>
  </ul>

  <ApiTables component="AcSkeleton" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">slate-80</code>/<code class="prose-code">slate-90</code> mix + <code class="prose-code">slate-95</code> sweep (<code class="prose-code">slate-90</code> + <code class="prose-code">slate-80</code> in dark)</td><td class="px-4 py-3">Shape and shimmer</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">rounded-4</code> / <code class="prose-code">rounded-6</code> / <code class="prose-code">rounded-full</code></td><td class="px-4 py-3">Line / rect / circle</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">h-9 border-border</code>, <code class="prose-code">h-12 border-border-light</code></td><td class="px-4 py-3">Table header and rows</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">rounded-10 border-border bg-surface shadow-xs</code></td><td class="px-4 py-3"><code class="prose-code">card</code> and <code class="prose-code">info-card</code></td></tr>
      </tbody>
    </table>
  </div>
</template>
