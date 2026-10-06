<script setup lang="ts">
import { AcButton } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = ["Use one solid primary button per view for the main action.", "Write labels in Title Case with a verb: “Create Database”, “Save Changes”.", "Use `color=\"danger\"` for destructive actions and confirm them."];
const donts = ["Don't place two solid primary buttons side by side.", "Don't colour a button with custom classes — pick a `color` and `variant`.", "Don't put long sentences in a button; white on success is 3.5:1, so keep labels short."];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use a button for actions in forms, dialogs, toolbars and page headers. For navigation that looks like a button, pass <code class="prose-code">href</code> and it renders an <code class="prose-code">&lt;a&gt;</code>.</p>
  <ComponentPlayground
    tag="AcButton"
    :component="AcButton"
    :controls="[{'prop': 'color', 'type': 'select', 'options': ['primary', 'info', 'success', 'warning', 'danger', 'white', 'ghost']}, {'prop': 'variant', 'type': 'select', 'options': ['solid', 'light', 'outlined']}, {'prop': 'size', 'type': 'select', 'options': ['small', 'normal', 'medium']}, {'prop': 'loading', 'type': 'boolean'}, {'prop': 'disabled', 'type': 'boolean'}, {'prop': 'title', 'type': 'text'}]"
    :initial="{'color': 'primary', 'variant': 'solid', 'size': 'normal', 'loading': false, 'disabled': false, 'title': 'Create Database'}"
    :defaults="{'color': 'primary', 'variant': 'solid', 'size': 'normal', 'loading': false, 'disabled': false, 'title': ''}"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="color" :level="3">Color</DocHeading>
  <p>Use the <code class="prose-code">color</code> prop. <code class="prose-code">primary</code> is the main action; <code class="prose-code">danger</code> is for destructive actions; <code class="prose-code">white</code> and <code class="prose-code">ghost</code> are neutral secondary styles.</p>
  <ComponentExample name="button/ButtonColors" center />
  <DocHeading id="variant" :level="3">Variant</DocHeading>
  <p>Use <code class="prose-code">variant</code> to lower emphasis: <code class="prose-code">light</code> for secondary actions next to a primary, <code class="prose-code">outlined</code> for tertiary ones.</p>
  <ComponentExample name="button/ButtonVariants" center />
  <DocHeading id="size" :level="3">Size</DocHeading>
  <p><code class="prose-code">small</code> (24px) fits tables and toolbars, <code class="prose-code">normal</code> (32px) is the default, <code class="prose-code">medium</code> (40px) is for empty states and hero actions.</p>
  <ComponentExample name="button/ButtonSizes" center />
  <DocHeading id="icon" :level="3">Icon</DocHeading>
  <p>Put an inline SVG or icon component in the <code class="prose-code">icon</code> slot. For an icon-only button, leave out <code class="prose-code">title</code> and add an <code class="prose-code">aria-label</code>.</p>
  <ComponentExample name="button/ButtonIcon" center />
  <DocHeading id="loading" :level="3">Loading</DocHeading>
  <p>Set <code class="prose-code">loading</code> while an async action runs. The button keeps its width, shows a spinner and ignores clicks.</p>
  <ComponentExample name="button/ButtonLoading" center />
  <DocHeading id="disabled" :level="3">Disabled</DocHeading>
  <p>Disable a button when its action is unavailable. Prefer explaining why nearby.</p>
  <ComponentExample name="button/ButtonDisabled" center />
  <DocHeading id="link" :level="3">As a link</DocHeading>
  <p>Pass <code class="prose-code">href</code> to render an <code class="prose-code">&lt;a&gt;</code>. Other attributes such as <code class="prose-code">target</code> pass through.</p>
  <ComponentExample name="button/ButtonLink" center />
  <DocHeading id="form-actions" :level="3">Form actions</DocHeading>
  <p>Footer pattern for forms and dialogs: neutral Cancel on the left of the primary action, both right-aligned.</p>
  <ComponentExample name="button/ButtonFormActions" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>Renders a native <code class="prose-code">&lt;button type="button"&gt;</code> (or <code class="prose-code">&lt;a&gt;</code> with <code class="prose-code">href</code>), so keyboard and screen readers work by default.</li>
    <li>Icon-only buttons need an <code class="prose-code">aria-label</code>.</li>
    <li><code class="prose-code">loading</code> sets <code class="prose-code">aria-busy</code> and blocks clicks; <code class="prose-code">disabled</code> on a link sets <code class="prose-code">aria-disabled</code>.</li>
    <li>Focus shows a 2px primary outline.</li>
  </ul>

  <ApiTables component="AcButton" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">bg-primary / hover:bg-primary-hover</code></td><td class="px-4 py-3">Solid primary fill</td></tr>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">bg-primary-95 / text-primary-20</code></td><td class="px-4 py-3">Light variant</td></tr>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">border-primary-70 bg-surface</code></td><td class="px-4 py-3">Outlined variant</td></tr>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">rounded-6</code></td><td class="px-4 py-3">Corner radius</td></tr>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">h-8 px-3.5 text-base font-medium shadow-button</code></td><td class="px-4 py-3">Normal size</td></tr>
      </tbody>
    </table>
  </div>
</template>
