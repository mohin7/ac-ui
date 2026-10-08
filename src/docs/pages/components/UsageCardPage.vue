<script setup lang="ts">
import { HardDrive } from "@lucide/vue";
import { AcUsageCard } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const script = 'import { HardDrive } from "@lucide/vue";';

const dos = [
  "Say what is left or over, not only the percentage — the card does this from `used` and `limit`.",
  "Match `warning-at` and `danger-at` to when people should act, e.g. 60% for a plan with slow upgrades.",
  "Give the breakdown a heading row so each number has a name.",
];
const donts = [
  "Don't use a usage card without a limit for a single number — use Stat Card.",
  "Don't add more than about six breakdown rows; group the rest as “Other”.",
  "Don't use a usage card to set a threshold — use Slider.",
];
const theme = [
  ["rounded-10 border-border bg-surface shadow-xs", "Card"],
  ["bg-primary on bg-primary-93", "Meter under the warning threshold"],
  ["bg-warning on bg-yellow-93", "Meter from warning-at"],
  ["bg-danger on bg-red-93", "Meter from danger-at and over the limit"],
  ["bg-surface w-0.5", "Threshold marks"],
  ["border-t border-border-light tabular-nums", "Breakdown table"],
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use a usage card to show how much of a quota or plan is used: CPU and memory against a namespace limit, backup storage against a repository size, databases against a plan. It turns warning and danger as usage passes its thresholds, says what's left, and can add a breakdown table — or show only a breakdown, for billing.</p>
  <ComponentPlayground
    tag="AcUsageCard"
    :component="AcUsageCard"
    :controls="[{ prop: 'title', type: 'text' }, { prop: 'description', type: 'text' }, { prop: 'unit', type: 'text' }, { prop: 'period', type: 'text' }, { prop: 'showThresholds', type: 'boolean' }, { prop: 'loading', type: 'boolean' }]"
    :initial="{ title: 'Storage', description: 'Namespace demo', unit: 'GiB', period: '', showThresholds: true, loading: false }"
    :defaults="{ description: '', unit: '', period: '', showThresholds: true, loading: false }"
    :extra="{ icon: HardDrive, used: 212, limit: 250, class: 'w-80' }"
    extra-code=':icon="HardDrive" :used="212" :limit="250"'
    :script="script"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="quota" :level="3">Quotas</DocHeading>
  <p>Set <code class="prose-code">used</code>, <code class="prose-code">limit</code> and <code class="prose-code">unit</code>. From <code class="prose-code">warning-at</code> (80%) the meter turns yellow with a “Near limit” badge, from <code class="prose-code">danger-at</code> (95%) red with “At limit”, and past the limit it reads “Over limit” and how far over.</p>
  <ComponentExample name="usage-card/UsageCardQuota" />

  <DocHeading id="breakdown" :level="3">Breakdown</DocHeading>
  <p><code class="prose-code">breakdown</code> rows (<code class="prose-code">{ label, icon?, values }</code>) and <code class="prose-code">breakdown-headers</code> add a table under the meter. Numbers are right-aligned and formatted with <code class="prose-code">format</code>.</p>
  <ComponentExample name="usage-card/UsageCardBreakdown" />

  <DocHeading id="billing" :level="3">Billing table</DocHeading>
  <p>Without <code class="prose-code">used</code>, the card shows only its breakdown — this replaces the old UsageTableCard and UsageCard. <code class="prose-code">period</code> sits at the top right. On phones the table scrolls sideways.</p>
  <ComponentExample name="usage-card/UsageCardBilling" />

  <DocHeading id="states" :level="3">Thresholds, no limit, loading, link</DocHeading>
  <p>Without <code class="prose-code">limit</code> the card reads “No limit” and has no meter. <code class="prose-code">loading</code> shows placeholder bars. Like every card, <code class="prose-code">to</code>, <code class="prose-code">href</code> or <code class="prose-code">@click</code> makes it a link or button.</p>
  <ComponentExample name="usage-card/UsageCardStates" />
  <Callout type="note">The old UsageThreshold, a range input for picking a threshold, is now <RouterLink to="/components/slider">Slider</RouterLink>. The old TableCard is a <RouterLink to="/components/card">Card</RouterLink> with <code class="prose-code">:padded="false"</code> around a <RouterLink to="/components/table">Table</RouterLink>.</Callout>

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>The bar is a <code class="prose-code">role="meter"</code> named by the title, with <code class="prose-code">aria-valuetext</code> such as “184 GiB of 250 GiB, 74%”, plus “near limit” or “over limit” when it applies.</li>
    <li>State is never colour alone: a badge says “Near limit”, “At limit” or “Over limit”, and a line says what's left.</li>
    <li>The breakdown is a real table with column and row headers. The card is a <code class="prose-code">section</code> labelled by its title.</li>
  </ul>

  <ApiTables component="AcUsageCard" />

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
