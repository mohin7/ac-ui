<script setup lang="ts">
import { Cloud } from "@lucide/vue";
import { AcResourceCard } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const script = 'import { Cloud } from "@lucide/vue";\n\nconst tags = [{ label: "v1.30.4" }, { label: "Hub", color: "info" }];\nconst details = [\n  { label: "Provider", value: "AWS EKS" },\n  { label: "Location", value: "us-east-1" },\n  { label: "Nodes", value: 12 },\n  { label: "Age", value: "182d" },\n];';

const dos = [
  "Show the four or so facts people scan for; put the rest on the detail page.",
  "Name the menu after the resource — the card does this for you: “Actions for prod-eks”.",
  "Use `loading` while the list loads so the grid doesn't jump.",
];
const donts = [
  "Don't show an empty value as blank — the card shows “—” for you.",
  "Don't nest a second link in the card body; use the `actions` slot or the menu.",
  "Don't use a resource card for a single number — use Stat Card.",
];
const theme = [
  ["rounded-10 border-border bg-surface shadow-xs", "Card"],
  ["hover:border-border-dark hover:shadow-sm", "Hover when it's a link or button"],
  ["border-border-light bg-surface-muted rounded-8", "Logo tile"],
  ["border-t border-border-light", "Details and footer dividers"],
  ["text-xs text-muted / text-base font-medium text-heading", "Detail label / value"],
  ["opacity-60", "Disabled"],
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use a resource card for one cluster, database, node, session or organization in a grid or list: its name, provider logo, status, tags, a few key facts and an actions menu. Give it <code class="prose-code">to</code>, <code class="prose-code">href</code> or <code class="prose-code">@click</code> to open the resource; the menu and action buttons stay separately clickable.</p>
  <ComponentPlayground
    tag="AcResourceCard"
    :component="AcResourceCard"
    :controls="[{ prop: 'name', type: 'text' }, { prop: 'subtitle', type: 'text' }, { prop: 'status', type: 'text' }, { prop: 'statusColor', type: 'select', options: ['default', 'primary', 'info', 'success', 'warning', 'danger'] }, { prop: 'columns', type: 'select', options: [1, 2, 3, 4] }, { prop: 'statusLoading', type: 'boolean' }, { prop: 'mono', type: 'boolean' }, { prop: 'disabled', type: 'boolean' }, { prop: 'loading', type: 'boolean' }]"
    :initial="{ name: 'prod-eks-us-east-1', subtitle: '', status: 'Active', statusColor: 'success', columns: 2, statusLoading: false, mono: false, disabled: false, loading: false }"
    :defaults="{ subtitle: '', status: '', statusColor: 'default', columns: 2, statusLoading: false, mono: false, disabled: false, loading: false }"
    :extra="{ icon: Cloud, tags: [{ label: 'v1.30.4' }, { label: 'Hub', color: 'info' }], details: [{ label: 'Provider', value: 'AWS EKS' }, { label: 'Location', value: 'us-east-1' }, { label: 'Nodes', value: 12 }, { label: 'Age', value: '182d' }], class: 'w-full max-w-sm' }"
    extra-code=':icon="Cloud" :tags="tags" :details="details"'
    :script="script"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="clusters" :level="3">Clusters</DocHeading>
  <p>The old <code class="prose-code">clusterData</code> splits into <code class="prose-code">name</code>, <code class="prose-code">logo</code>, <code class="prose-code">status</code>, <code class="prose-code">tags</code> and <code class="prose-code">details</code>. Put <code class="prose-code">AcDropdownItem</code>s in the <code class="prose-code">menu</code> slot and the card renders a ⋮ menu. <code class="prose-code">status-loading</code> replaces the old spinner tag.</p>
  <ComponentExample name="resource-card/ResourceCardCluster" />

  <DocHeading id="databases" :level="3">Databases</DocHeading>
  <p>A <code class="prose-code">logo</code>, a <code class="prose-code">mono</code> name for Kubernetes objects, key–value <code class="prose-code">tags</code> and four <code class="prose-code">columns</code> of details. <code class="prose-code">#detail-&lt;key&gt;</code> customises one value.</p>
  <ComponentExample name="resource-card/ResourceCardDatabase" />

  <DocHeading id="detail" :level="3">Detail panels</DocHeading>
  <p>Without a link, the card is a titled panel of facts — this replaces the old DetailCard. The <code class="prose-code">actions</code> slot holds buttons at the top right and <code class="prose-code">footer</code> a row under a divider.</p>
  <ComponentExample name="resource-card/ResourceCardDetail" />

  <DocHeading id="sessions" :level="3">Sessions</DocHeading>
  <p>With no details the card is a single row: an icon, a name, a subtitle and an action. This replaces the old SessionCard.</p>
  <ComponentExample name="resource-card/ResourceCardSession" />

  <DocHeading id="states" :level="3">Loading and disabled</DocHeading>
  <p><code class="prose-code">loading</code> renders the <RouterLink to="/components/skeleton">Skeleton</RouterLink> <code class="prose-code">info-card</code> preset in the same footprint. <code class="prose-code">disabled</code> greys the card and turns off its link, e.g. for a cluster that isn't connected.</p>
  <ComponentExample name="resource-card/ResourceCardStates" />
  <Callout type="tip">The old OrgCard was only used for “No cluster available”. Use <RouterLink to="/components/empty-state">Empty State</RouterLink> for that.</Callout>

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>The card is an <code class="prose-code">article</code> labelled by its name, an <code class="prose-code">h3</code>. As a link or button, only the name is the control, stretched over the card, so the menu and buttons inside stay reachable with Tab.</li>
    <li>The ⋮ menu is an <RouterLink to="/components/dropdown">AcDropdown</RouterLink> named “Actions for &lt;name&gt;”, with full menu keyboard support.</li>
    <li>Details are a <code class="prose-code">dl</code>; empty values read “Not set”. Loading cards announce “Loading &lt;name&gt;”.</li>
  </ul>

  <ApiTables component="AcResourceCard" :extra-slots="[{ name: 'detail-<key>', type: '{ detail: ResourceDetail }', description: 'Custom value for the detail with that `key`, e.g. `#detail-age`.' }]" />

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
