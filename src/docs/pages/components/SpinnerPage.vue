<script setup lang="ts">
import { AcSpinner } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = ["Say what is loading: “Fetching resource layout”, not just “Loading…”.", "Use a Preloader for a page, panel or modal body, and a Spinner next to the thing that's busy.", "Use `loading` on AcButton instead of placing a spinner in a button yourself."];
const donts = ["Don't use a Preloader when you know the layout — a Skeleton keeps the page steadier.", "Don't show several spinners for one request.", "Don't use `full-page` inside the app shell; it covers the sidebar and header."];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>A spinner shows that something is working, inline next to the thing that's busy. A preloader is a centred spinner with a message that fills a page, panel or modal body while its data loads. For content with a known layout, prefer a <RouterLink to="/components/skeleton">Skeleton</RouterLink>.</p>
  <ComponentPlayground
    tag="AcSpinner"
    :component="AcSpinner"
    :controls="[{'prop': 'size', 'type': 'select', 'options': ['xs', 'small', 'normal', 'large']}, {'prop': 'label', 'type': 'text'}]"
    :initial="{'size': 'normal', 'label': 'Loading'}"
    :defaults="{'size': 'small', 'label': 'Loading'}"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="sizes" :level="3">Spinner sizes</DocHeading>
  <p>The spinner takes the current text colour. <code class="prose-code">xs</code> 12px and <code class="prose-code">small</code> 16px go next to text; <code class="prose-code">normal</code> 20px and <code class="prose-code">large</code> 32px stand alone.</p>
  <ComponentExample name="spinner/SpinnerSizes" center />
  <DocHeading id="inline" :level="3">Inline with text</DocHeading>
  <p>Pass <code class="prose-code">label=""</code> when visible text already says what's happening, so it isn't announced twice.</p>
  <ComponentExample name="spinner/SpinnerInline" />
  <DocHeading id="preloader" :level="3">Preloader</DocHeading>
  <p>AcPreloader centres a spinner and a <code class="prose-code">message</code>. It grows to fill its container and is at least <code class="prose-code">min-height</code> tall (240px by default). Turn off <code class="prose-code">show-spinner</code> for a message alone.</p>
  <ComponentExample name="spinner/PreloaderBasic" />
  <DocHeading id="preloader-fill" :level="3">Filling a pane</DocHeading>
  <p>In a parent with a fixed height, such as a terminal or editor pane, the preloader fills it.</p>
  <ComponentExample name="spinner/PreloaderFill" />
  <DocHeading id="full-page" :level="3">Full page</DocHeading>
  <p><code class="prose-code">full-page</code> covers the viewport on a plain surface, for app start-up, sign-in and branding checks before the shell renders.</p>
  <ComponentExample name="spinner/PreloaderFullPage" center />
  <Callout type="note">The old Preloader was always <code class="prose-code">calc(100vh - 200px)</code> tall. For the same look on a page, pass <code class="prose-code">min-height="calc(100vh - 200px)"</code>, or place it in a container that already has the page height.</Callout>

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>A spinner with a <code class="prose-code">label</code> is <code class="prose-code">role="status"</code> named by it; with <code class="prose-code">label=""</code> it is hidden.</li>
    <li>The preloader is a polite <code class="prose-code">role="status"</code> live region, so its message is announced; the spinner inside is hidden.</li>
    <li>When loading finishes, move focus to the new content's heading if the preloader replaced the whole page.</li>
  </ul>

  <ApiTables component="AcSpinner" heading="Spinner API" />
  <ApiTables component="AcPreloader" heading="Preloader API" id-prefix="preloader-" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes these components use, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">animate-spin currentColor</code></td><td class="px-4 py-3">Spinner (colour from the parent's text)</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">size-3 size-4 size-5 size-8</code></td><td class="px-4 py-3">Spinner sizes</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">text-primary</code>, <code class="prose-code">text-base text-muted</code></td><td class="px-4 py-3">Preloader spinner and message</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">fixed inset-0 z-[80] bg-surface</code></td><td class="px-4 py-3">Full-page preloader</td></tr>
      </tbody>
    </table>
  </div>
</template>
