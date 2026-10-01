<script setup lang="ts">
import { AcStatCard } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = [
  "Lead an overview page with one row of three to six stat cards.",
  "Name the comparison period next to a delta: “+9% vs last month”.",
  "Set `invert-trend` when going up is bad, such as failed backups or cost.",
];
const donts = [
  "Don't put a whole table or form in a stat card — use Card or Resource Card.",
  "Don't colour a value by status without a word that says the same thing.",
  "Don't pad short rows with filler numbers nobody acts on.",
];
const theme = [
  ["rounded-10 border-border bg-surface shadow-xs", "Card"],
  ["text-3xl font-semibold text-heading", "Value (text-lg when small or inline)"],
  ["text-green-30 / text-red-30", "Good / bad delta"],
  ["stroke-slate-60 fill-primary", "Sparkline line and latest point"],
  ["bg-yellow-97 border-yellow-80, bg-red-97 border-red-80", "warning and danger status"],
  ["ring-[3px] ring-ring", "Focus when the card is a link or button"],
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use a stat card for one number people check at a glance: how many databases, how much storage, how far a backup is behind its target. It can show a unit, a change since last period, a sparkline, a progress bar and a status. Give it <code class="prose-code">to</code>, <code class="prose-code">href</code> or a <code class="prose-code">@click</code> listener and the whole card becomes a link or button.</p>
  <ComponentPlayground
    tag="AcStatCard"
    :component="AcStatCard"
    :controls="[{ prop: 'label', type: 'text' }, { prop: 'value', type: 'text' }, { prop: 'suffix', type: 'text' }, { prop: 'delta', type: 'text' }, { prop: 'deltaLabel', type: 'text' }, { prop: 'status', type: 'select', options: ['default', 'success', 'info', 'warning', 'danger'] }, { prop: 'size', type: 'select', options: ['normal', 'small'] }, { prop: 'inline', type: 'boolean' }, { prop: 'invertTrend', type: 'boolean' }, { prop: 'mono', type: 'boolean' }, { prop: 'loading', type: 'boolean' }]"
    :initial="{ label: 'Backup storage', value: '184', suffix: 'GiB', delta: '+12%', deltaLabel: 'vs last month', status: 'default', size: 'normal', inline: false, invertTrend: false, mono: false, loading: false }"
    :defaults="{ value: '', suffix: '', delta: '', deltaLabel: '', status: 'default', size: 'normal', inline: false, invertTrend: false, mono: false, loading: false }"
    :extra="{ sparkline: [120, 128, 131, 140, 152, 160, 171, 184], class: 'w-72' }"
    extra-code=':sparkline="[120, 128, 131, 140, 152, 160, 171, 184]"'
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="basic" :level="3">Basic</DocHeading>
  <p>A <code class="prose-code">label</code> and a <code class="prose-code">value</code>, with the unit in <code class="prose-code">suffix</code>. Format the value yourself so it reads the way your users count.</p>
  <ComponentExample name="stat-card/StatCardBasic" />

  <DocHeading id="overview-row" :level="3">Overview row</DocHeading>
  <p>A row for the top of an overview page, with an icon, a <code class="prose-code">delta</code> and a <code class="prose-code">sparkline</code>. The grid uses <code class="prose-code">repeat(auto-fill, minmax(min(220px, 100%), 1fr))</code>, so it wraps on narrow screens without breakpoints. Each card listens to <code class="prose-code">@click</code>, so it's a button; a number <code class="prose-code">delta</code> is shown as a percentage, and its colour depends on whether up is good (set <code class="prose-code">invert-trend</code> for failures and cost).</p>
  <ComponentExample name="stat-card/StatCardOverview" />

  <DocHeading id="status" :level="3">Status, progress and footer</DocHeading>
  <p>The default slot replaces the value, e.g. with a badge. <code class="prose-code">progress</code> adds a bar, the <code class="prose-code">badge</code> slot sits at the top right and the <code class="prose-code">footer</code> slot adds a line of context. <code class="prose-code">status="warning"</code> and <code class="prose-code">"danger"</code> tint the whole card.</p>
  <ComponentExample name="stat-card/StatCardStatus" />

  <DocHeading id="summary" :level="3">Summary</DocHeading>
  <p>For a review step, put <code class="prose-code">size="small"</code> cards in a Card. This replaces the old SummaryCard and its <code class="prose-code">items</code> prop.</p>
  <ComponentExample name="stat-card/StatCardSummary" />

  <DocHeading id="inline" :level="3">Inline and loading</DocHeading>
  <p><code class="prose-code">inline</code> puts the label and value in one compact row, for insight panels with many small facts. It replaces the old OverviewCard; wrap the grid in a Card with a title instead of OverviewCards. <code class="prose-code">loading</code> shows a placeholder bar.</p>
  <ComponentExample name="stat-card/StatCardInline" />
  <Callout type="tip">For a quota with a limit and thresholds, use Usage Card. For a database or cluster with several facts, use Resource Card.</Callout>

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>As a link or button, only the label is the control (stretched over the card), so the accessible name stays short; the value is attached with <code class="prose-code">aria-describedby</code>.</li>
    <li>The delta's arrow is hidden and replaced with “Up”, “Down” or “No change” for screen readers, so direction never relies on colour.</li>
    <li>The sparkline is an image with a text summary: number of points, first and last value, low and high.</li>
    <li>The progress bar is a <code class="prose-code">progressbar</code> named by the label. While <code class="prose-code">loading</code>, the card is <code class="prose-code">aria-busy</code>.</li>
  </ul>

  <ApiTables component="AcStatCard" />

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
