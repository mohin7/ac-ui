<script setup lang="ts">
import { AcBadge } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = ["Always include a word — colour alone doesn't carry status.", "Map states consistently: Ready → success, Provisioning → info, Halted → warning, Critical/Failed → danger.", "Use `light` + `rounded` + `dot` for resource status in tables."];
const donts = ["Don't use a solid warning badge for text — white on warning is 2.1:1 (the component uses dark text instead).", "Don't make badges clickable; use a Button or link.", "Don't invent new status colours."];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use a badge to label status (Ready, Failed), plan tiers and versions. It is not interactive.</p>
  <ComponentPlayground
    tag="AcBadge"
    :component="AcBadge"
    :controls="[{'prop': 'color', 'type': 'select', 'options': ['default', 'primary', 'secondary', 'info', 'success', 'warning', 'danger', 'dark']}, {'prop': 'variant', 'type': 'select', 'options': ['solid', 'light', 'outlined']}, {'prop': 'rounded', 'type': 'boolean'}, {'prop': 'dot', 'type': 'boolean'}, {'prop': 'label', 'type': 'text'}]"
    :initial="{'color': 'success', 'variant': 'light', 'rounded': true, 'dot': true, 'label': 'Ready'}"
    :defaults="{'color': 'default', 'variant': 'solid', 'rounded': false, 'dot': false, 'label': 'Default'}"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="color" :level="3">Color</DocHeading>
  <p>Brand colours for tiers and categories, status colours for state.</p>
  <ComponentExample name="badge/BadgeColors" center />
  <DocHeading id="variant" :level="3">Variant</DocHeading>
  <p><code class="prose-code">light</code> is the safest choice in dense tables — about 13:1 contrast in every colour.</p>
  <ComponentExample name="badge/BadgeVariants" center />
  <DocHeading id="status" :level="3">Resource status</DocHeading>
  <p>The standard status badge: <code class="prose-code">light</code>, <code class="prose-code">rounded</code>, with a <code class="prose-code">dot</code>.</p>
  <ComponentExample name="badge/BadgeStatus" center />
  <DocHeading id="tiers" :level="3">Tiers and versions</DocHeading>
  <p>Solid for plan tiers, outlined for versions.</p>
  <ComponentExample name="badge/BadgeVersion" center />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>Renders a <code class="prose-code">&lt;span&gt;</code>; its text is read as part of the surrounding content.</li>
    <li>The dot is decorative (<code class="prose-code">aria-hidden</code>), so the label must say the status.</li>
  </ul>

  <ApiTables component="AcBadge" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-white shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">bg-green-95 text-green-10 ring-1 ring-inset ring-green-40/25</code></td><td class="px-4 py-3">Light success</td></tr>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">bg-primary text-white</code></td><td class="px-4 py-3">Solid primary</td></tr>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">rounded-6 / rounded-50</code></td><td class="px-4 py-3">Default / rounded shape</td></tr>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">h-5.5 px-2 text-xs font-medium</code></td><td class="px-4 py-3">Size</td></tr>
      </tbody>
    </table>
  </div>
</template>
