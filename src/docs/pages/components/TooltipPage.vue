<script setup lang="ts">
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = [
  "Name icon-only buttons with a tooltip that repeats their `aria-label`.",
  "Keep it to a few words: “Copy connection string”, not a sentence.",
  "Use one to show the full text of a truncated resource name.",
];
const donts = [
  "Don't put links, buttons or anything people must read to finish a task in a tooltip — it can't be reached with Tab and disappears.",
  "Don't add a tooltip that repeats a button's visible label.",
  "Don't wrap a disabled button; it gets no hover or focus. Explain why it's disabled in text nearby.",
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>
    Use a tooltip for a short hint about a control: the name of an icon button, the full value of truncated text, a keyboard shortcut. Wrap the trigger
    in <code class="prose-code">AcTooltip</code> and set <code class="prose-code">content</code>.
  </p>
  <ComponentExample name="tooltip/TooltipBasic" center />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="placement" :level="3">Placement</DocHeading>
  <p>
    <code class="prose-code">placement</code> is <code class="prose-code">top</code> (default), <code class="prose-code">right</code>,
    <code class="prose-code">bottom</code> or <code class="prose-code">left</code>. It flips to the other side when it would leave the screen.
  </p>
  <ComponentExample name="tooltip/TooltipPlacement" center />
  <DocHeading id="content" :level="3">Rich content and truncated text</DocHeading>
  <p>
    The <code class="prose-code">#content</code> slot takes formatted text. Truncated text needs <code class="prose-code">tabindex="0"</code> so keyboard users
    can reach the tooltip too.
  </p>
  <ComponentExample name="tooltip/TooltipContent" center />
  <Callout type="note">
    It opens after <code class="prose-code">delay</code> (300 ms) on hover and at once on keyboard focus, stays open while the pointer is over it, and closes on
    Escape, blur, click or scroll.
  </Callout>

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>The bubble is <code class="prose-code">role="tooltip"</code>, and the first focusable element in the slot gets <code class="prose-code">aria-describedby</code> pointing at it (ids it already had are kept).</li>
    <li>A tooltip describes; it doesn't name. Icon-only buttons still need an <code class="prose-code">aria-label</code>.</li>
    <li>Escape hides it without moving focus, and it can be hovered, as WCAG 1.4.13 asks.</li>
    <li>Touch doesn't show tooltips on tap, so never hide essential information in one.</li>
  </ul>

  <ApiTables component="AcTooltip" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">bg-slate-10 text-slate-95</code></td><td class="px-4 py-3">Chip, light theme</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">dark:bg-slate-80 dark:text-slate-10 dark:ring-slate-70</code></td><td class="px-4 py-3">Chip, dark theme (stays a dark chip)</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">rounded-6 px-2 py-1 text-xs max-w-64</code></td><td class="px-4 py-3">Shape and size</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">shadow-md z-[100]</code></td><td class="px-4 py-3">Elevation</td></tr>
      </tbody>
    </table>
  </div>
</template>
