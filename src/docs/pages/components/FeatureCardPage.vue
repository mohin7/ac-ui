<script setup lang="ts">
import { Activity } from "@lucide/vue";
import { AcFeatureCard } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const script = 'import { Activity } from "@lucide/vue";';

const dos = [
  "Keep descriptions to one or two sentences; they're clamped at three lines.",
  "Use the same kind of media across a grid: all icons or all logos.",
  "Pair a status colour with a word: “Enabled”, “Failed”.",
];
const donts = [
  "Don't put buttons or links inside a card that is itself a link — use Resource Card's actions instead.",
  "Don't use selectable cards for a single choice — use CheckRadio with `cards`.",
  "Don't use a feature card for a running resource with live details — use Resource Card.",
];
const theme = [
  ["rounded-10 border-border bg-surface shadow-xs", "Card"],
  ["hover:border-border-dark hover:shadow-sm", "Hover when it's a link, button or checkbox"],
  ["bg-primary-95 text-primary-30 rounded-8", "Icon tile"],
  ["border-border-light bg-surface-muted", "Logo tile"],
  ["has-checked:border-primary has-checked:bg-primary-97", "Selected card"],
  ["ring-[3px] ring-ring", "Focus"],
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use a feature card to show something people can open, enable or pick: a feature set, a product, a cloud provider, a database type. It has an icon or logo, a title, a short description and an optional status. It works as a link (<code class="prose-code">to</code> or <code class="prose-code">href</code>), a button (<code class="prose-code">@click</code>) or a checkbox (<code class="prose-code">selectable</code>).</p>
  <ComponentPlayground
    tag="AcFeatureCard"
    :component="AcFeatureCard"
    :controls="[{ prop: 'title', type: 'text' }, { prop: 'description', type: 'text' }, { prop: 'status', type: 'text' }, { prop: 'statusColor', type: 'select', options: ['default', 'primary', 'info', 'success', 'warning', 'danger'] }, { prop: 'required', type: 'boolean' }, { prop: 'recommended', type: 'boolean' }, { prop: 'centered', type: 'boolean' }, { prop: 'selectable', type: 'boolean' }, { prop: 'disabled', type: 'boolean' }]"
    :initial="{ title: 'Monitoring', description: 'Prometheus, Grafana and alert rules for every database in the cluster.', status: 'Enabled', statusColor: 'success', required: false, centered: false, selectable: false, disabled: false }"
    :defaults="{ description: '', status: '', statusColor: 'default', required: false, recommended: false, centered: false, selectable: false, disabled: false }"
    :extra="{ icon: Activity, class: 'w-80' }"
    extra-code=':icon="Activity"'
    :script="script"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="basic" :level="3">Feature sets</DocHeading>
  <p>A grid of feature sets, each with an <code class="prose-code">icon</code>, a <code class="prose-code">status</code> badge and, for required ones, <code class="prose-code">required</code>. Listening to <code class="prose-code">@click</code> makes each card a button with an arrow.</p>
  <ComponentExample name="feature-card/FeatureCardBasic" />

  <DocHeading id="selectable" :level="3">Selectable</DocHeading>
  <p><code class="prose-code">selectable</code> turns the card into a checkbox bound with <code class="prose-code">v-model:checked</code>. Use it for picking several features to enable at once. It replaces the old CheckItemCard.</p>
  <ComponentExample name="feature-card/FeatureCardSelectable" />
  <Callout type="note">For one choice out of a few — the old RadioCard — use <RouterLink to="/components/check-radio">CheckRadio</RouterLink> with <code class="prose-code">cards</code>.</Callout>

  <DocHeading id="centered" :level="3">Centred logos</DocHeading>
  <p><code class="prose-code">centered</code> stacks a 48px <code class="prose-code">logo</code> over the title, for picking a product, provider or database type. It replaces the old Vendor card.</p>
  <ComponentExample name="feature-card/FeatureCardCentered" />

  <DocHeading id="links" :level="3">Links and footer</DocHeading>
  <p>With <code class="prose-code">href</code> the card is a link; <code class="prose-code">target="_blank"</code> shows an external arrow and adds <code class="prose-code">rel="noopener noreferrer"</code>. With <code class="prose-code">to</code> it's a <code class="prose-code">RouterLink</code>. The <code class="prose-code">footer</code> slot adds a row at the bottom.</p>
  <ComponentExample name="feature-card/FeatureCardLinks" />

  <DocHeading id="actions" :level="3">Actions and title icon</DocHeading>
  <p>The <code class="prose-code">actions</code> slot puts controls at the top right of the card, such as an Enable or Reconcile button. They stay clickable even when the whole card is a link or button. The <code class="prose-code">title-extra</code> slot adds a small icon right after the title, for a ready or warning state. <code class="prose-code">recommended</code> adds a "Recommended" badge next to "Required".</p>
  <ComponentExample name="feature-card/FeatureCardActions" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>The title is an <code class="prose-code">h3</code>. As a link or button, only the title is the control, stretched over the card, so the accessible name is the title and the description is attached with <code class="prose-code">aria-describedby</code>.</li>
    <li>A <code class="prose-code">selectable</code> card is a <code class="prose-code">label</code> around a native checkbox named by the title; Space toggles it.</li>
    <li>Focus shows a ring around the whole card. Decorative icons are hidden; give <code class="prose-code">logo-alt</code> only when the logo says something the title doesn't.</li>
  </ul>

  <ApiTables component="AcFeatureCard" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr v-for="[cls, use] in theme" :key="cls" class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">{{ cls }}</code></td><td class="px-4 py-3">{{ use }}</td></tr>
      </tbody>
    </table>
  </div>
</template>
