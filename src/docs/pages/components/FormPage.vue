<script setup lang="ts">
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = [
  "Group related fields in sections with a short title: Target, Schedule, Storage.",
  "Name the primary button after the result: “Create Schedule”, “Save Changes”, not just “Submit”.",
  "Validate on submit and put each message under its field.",
];
const donts = [
  "Don't put more than one primary button in the footer.",
  "Don't disable Save to signal errors people can't see — let them submit and show what's wrong.",
  "Don't nest an AcForm inside another form.",
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use AcForm for create and edit pages. It's a <code class="prose-code">&lt;form&gt;</code> that emits <code class="prose-code">submit</code> without reloading the page and sets the width of the fields. AcFormSection groups fields under a title, and AcFormFooter is the sticky Cancel / Save bar.</p>
  <ComponentExample name="form/FormCreateBackup" />
  <Callout type="tip">The Save button is <code class="prose-code">type="submit"</code>, so Enter in any field submits too. Handle everything in the form's <code class="prose-code">@submit</code>. To use the browser's own required-field checks, leave the fields' <code class="prose-code">required</code> on; to turn them off, add <code class="prose-code">novalidate</code> to AcForm.</Callout>

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="aside" :level="3">Aside layout</DocHeading>
  <p><code class="prose-code">layout="aside"</code> puts each section's title and description in a left column from 768px up — good for settings pages. Below that it stacks. A section can override the form's layout with its own <code class="prose-code">layout</code>.</p>
  <ComponentExample name="form/FormAside" />
  <DocHeading id="sticky-container" :level="3">Sticky in a scrolling container</DocHeading>
  <p>The default <code class="prose-code">sticky="container"</code> keeps the footer at the bottom of whatever scrolls: the page, a side panel or this box. It settles at the end of the form once you reach it.</p>
  <ComponentExample name="form/FormStickyContainer" />
  <DocHeading id="sticky-viewport" :level="3">Pinned to the window</DocHeading>
  <p><code class="prose-code">sticky="viewport"</code> pins the bar to the bottom of the window, lined up with the footer's column, and keeps its space in the page so the last field isn't hidden. Use it when the form is the whole page.</p>
  <ComponentExample name="form/FormFooterViewport" />
  <DocHeading id="footer-slots" :level="3">Footer slots, outside a form</DocHeading>
  <p>The <code class="prose-code">left</code> slot takes a status or a secondary action; <code class="prose-code">right</code> replaces the buttons. Outside a <code class="prose-code">&lt;form&gt;</code> the primary button emits <code class="prose-code">save</code> instead — or pass <code class="prose-code">form="form-id"</code> to submit a form elsewhere on the page.</p>
  <ComponentExample name="form/FormFooterStandalone" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>AcForm is a native <code class="prose-code">&lt;form&gt;</code>, so Enter submits and the browser's form features work.</li>
    <li>Each AcFormSection is a <code class="prose-code">role="group"</code> labelled by its title and described by its description, so screen readers announce the group when focus enters it.</li>
    <li>While <code class="prose-code">loading</code>, the primary button is <code class="prose-code">aria-busy</code> and both buttons are disabled so a request isn't sent twice.</li>
  </ul>

  <ApiTables component="AcForm" heading="Form API" />
  <ApiTables component="AcFormSection" heading="Form Section API" id-prefix="section-" />
  <ApiTables component="AcFormFooter" heading="Form Footer API" id-prefix="footer-" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes these components use, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">max-w-160 · max-w-200 · max-w-250</code></td><td class="px-4 py-3">Form widths <code class="prose-code">narrow</code>, <code class="prose-code">normal</code>, <code class="prose-code">wide</code></td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">border-t border-border-light py-7</code></td><td class="px-4 py-3">Divider between sections</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">text-xl font-semibold · text-muted</code></td><td class="px-4 py-3">Section title and description</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">md:grid-cols-[1fr_2fr]</code></td><td class="px-4 py-3">Aside layout</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">sticky bottom-0 border-t bg-surface</code></td><td class="px-4 py-3">Footer bar</td></tr>
      </tbody>
    </table>
  </div>
</template>
