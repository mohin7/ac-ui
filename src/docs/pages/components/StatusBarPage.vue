<script setup lang="ts">
import { Cpu, MemoryStick } from "lucide-vue-next";
import { AcStatusBar } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const items = [
  { label: "Connected", status: "success", dot: true, priority: "high" },
  { label: "Cluster", value: "prod-us-east-1", mono: true, priority: "high" },
  { label: "MongoDB", value: "demo/mg-rs", mono: true },
  { label: "CPU", icon: Cpu, value: "420m / 1", meter: 42, align: "right" },
  { label: "Memory", icon: MemoryStick, value: "1.6Gi / 2Gi", meter: 80, align: "right" },
  { label: "TLS", status: "success", align: "right" },
];
const script =
  'import { Cpu, MemoryStick } from "lucide-vue-next";\n\nconst items = [\n  { label: "Connected", status: "success", dot: true, priority: "high" },\n  { label: "Cluster", value: "prod-us-east-1", mono: true, priority: "high" },\n  { label: "MongoDB", value: "demo/mg-rs", mono: true },\n  { label: "CPU", icon: Cpu, value: "420m / 1", meter: 42, align: "right" },\n  { label: "Memory", icon: MemoryStick, value: "1.6Gi / 2Gi", meter: 80, align: "right" },\n  { label: "TLS", status: "success", align: "right" },\n];';

const dos = [
  "Keep it to facts people glance at: connection, cluster, resource, usage, version.",
  "Mark the two or three items that matter most `priority: \"high\"` so they survive on phones.",
  "Pair every status colour with a word: “Backup”, “Not exposed”.",
];
const donts = [
  "Don't put primary actions here; the bar is easy to miss. Use the page header.",
  "Don't show long values; the bar is one 28px line and values truncate.",
  "Don't use it for notifications; use a toast or a banner.",
];
const theme = [
  ["h-7 border-t border-border-light bg-surface-muted", "Bar"],
  ["dark bg-sidebar", "Dark bar; the dark class switches every token inside to the dark theme"],
  ["text-xs text-muted · font-medium text-heading", "Label · value"],
  ["font-mono text-[11.5px]", "`mono` values"],
  ["text-success · text-warning · text-danger · text-info", "Status icons"],
  ["size-2 rounded-full bg-success · animate-ping", "Connection dot · pulsing `pending` dot"],
  ["h-1.5 w-8 bg-slate-80 · bg-primary / bg-warning / bg-danger", "Usage meter track · fill at < 75, ≥ 75, ≥ 90"],
  ["hover:bg-surface-sunken rounded-4", "Item that's a link or button"],
  ["@max-lg:hidden · @max-3xl:hidden", "`normal` and `low` priority items on narrow bars"],
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>
    The status bar is the thin strip along the bottom of a console page: whether the console is connected, which cluster and resource you're looking at,
    its usage and version, and a couple of small actions. Pass the items as data; add anything custom, such as a badge, in the
    <code class="prose-code">left</code> and <code class="prose-code">right</code> slots.
  </p>
  <ComponentPlayground
    tag="AcStatusBar"
    :component="AcStatusBar"
    :controls="[{ prop: 'dark', type: 'boolean' }, { prop: 'label', type: 'text' }]"
    :initial="{ dark: false, label: 'mg-rs status' }"
    :defaults="{ dark: false, label: 'Status bar' }"
    :extra="{ items }"
    extra-code=':items="items"'
    :script="script"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="basic" :level="3">Database detail page</DocHeading>
  <p>
    An item shows a <code class="prose-code">label</code> and a <code class="prose-code">value</code>, or just a label. <code class="prose-code">align: "right"</code>
    moves it to the right end. <code class="prose-code">meter</code> adds a usage bar. An item with <code class="prose-code">onClick</code>,
    <code class="prose-code">to</code> or <code class="prose-code">href</code> becomes a button or link; <code class="prose-code">iconOnly</code> keeps just its icon.
  </p>
  <ComponentExample name="status-bar/StatusBarBasic" />

  <DocHeading id="connection" :level="3">Connection</DocHeading>
  <p>
    <code class="prose-code">dot</code> shows a status dot instead of an icon. <code class="prose-code">status: "pending"</code> makes it pulse, for
    reconnecting.
  </p>
  <ComponentExample name="status-bar/StatusBarConnection" />

  <DocHeading id="statuses" :level="3">Feature status</DocHeading>
  <p><code class="prose-code">status</code> colours the item's icon and picks a default one, like the old footer's feature checks.</p>
  <ComponentExample name="status-bar/StatusBarStatuses" />

  <DocHeading id="dark" :level="3">Dark</DocHeading>
  <p><code class="prose-code">dark</code> puts the bar on the dark sidebar colour in both themes, to match a dark Sidebar.</p>
  <ComponentExample name="status-bar/StatusBarDark" />

  <DocHeading id="responsive" :level="3">Narrow bars</DocHeading>
  <p>
    The bar measures its own width. Below 768px <code class="prose-code">low</code> items hide; below 512px <code class="prose-code">normal</code> ones
    do too. <code class="prose-code">high</code> items always show.
  </p>
  <ComponentExample name="status-bar/StatusBarResponsive" />
  <Callout type="tip">
    Place the bar at the end of the page column. <code class="prose-code">sticky</code> keeps it at the bottom of the scroll area; give a sticky
    <RouterLink to="/components/side-tabs">Side Tabs</RouterLink> list a matching <code class="prose-code">bottom="28px"</code>.
  </Callout>

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>The bar is a <code class="prose-code">&lt;footer&gt;</code> named by <code class="prose-code">label</code>, with the items in lists.</li>
    <li>Status is never colour alone: every status item has a text label, and icon-only items use it as their accessible name and hover title.</li>
    <li>Meters are <code class="prose-code">role="meter"</code> with the value and the item's label.</li>
    <li>The bar isn't a live region, so updates aren't announced. Announce a lost connection with a toast as well.</li>
    <li>The pulsing dot stops under <code class="prose-code">prefers-reduced-motion</code>.</li>
  </ul>

  <ApiTables component="AcStatusBar" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr v-for="[cls, use] in theme" :key="cls" class="border-t border-border-light first:border-0">
          <td class="px-4 py-3"><code class="prose-code">{{ cls }}</code></td>
          <td class="px-4 py-3">{{ use }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
