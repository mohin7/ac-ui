<script setup lang="ts">
import { AcCard } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = ["Keep one topic per card.", "Put the card's main actions in the `actions` slot.", "Use `h5`-sized titles (the default)."];
const donts = ["Don't nest cards inside cards.", "Don't add coloured side borders for emphasis — use a Badge or Alert."];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use a card to group related content — a resource's summary, a settings section, a table. Cards sit on the page's light gray background.</p>
  <ComponentPlayground
    tag="AcCard"
    :component="AcCard"
    :controls="[{'prop': 'title', 'type': 'text'}, {'prop': 'subtitle', 'type': 'text'}, {'prop': 'padded', 'type': 'boolean'}]"
    :initial="{'title': 'Backup Configuration', 'subtitle': 'Stash · every 6 hours', 'padded': true}"
    :defaults="{'title': '', 'subtitle': '', 'padded': true}"
    slot-text="Last backup completed 2 hours ago."
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="basic" :level="3">Basic</DocHeading>
  <p>Title, subtitle and body.</p>
  <ComponentExample name="card/CardBasic" />
  <DocHeading id="actions" :level="3">Header actions</DocHeading>
  <p>The <code class="prose-code">actions</code> slot places badges and buttons on the right of the header.</p>
  <ComponentExample name="card/CardActions" />
  <DocHeading id="flush" :level="3">Flush content</DocHeading>
  <p>Set <code class="prose-code">:padded="false"</code> to control the body padding yourself, e.g. around a table.</p>
  <ComponentExample name="card/CardFlush" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>Renders a <code class="prose-code">&lt;section&gt;</code> with an <code class="prose-code">&lt;h5&gt;</code> title, so it appears in the heading outline.</li>
  </ul>

  <ApiTables component="AcCard" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">rounded-10 border border-border bg-surface shadow-xs</code></td><td class="px-4 py-3">Surface</td></tr>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">px-5 py-3.5 / p-5</code></td><td class="px-4 py-3">Header / body padding</td></tr>
      </tbody>
    </table>
  </div>
</template>
