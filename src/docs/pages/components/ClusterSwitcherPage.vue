<script setup lang="ts">
import { AcClusterSwitcher } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const clusters = [
  { name: "demo-cluster", displayName: "demo-cluster", provider: "EKS", location: "us-east-1", status: "Active" },
  { name: "prod-gke", displayName: "prod-gke", provider: "GKE", location: "europe-west1", status: "Active" },
  { name: "staging-aks", displayName: "staging-aks", provider: "AKS", location: "eastus2", status: "Active" },
  { name: "edge-linode", displayName: "edge-linode", provider: "Akamai", location: "ap-south", status: "NotReady", disabled: true },
];
const script =
  'import { ref } from "vue";\n\nconst cluster = ref("demo-cluster");\nconst clusters = [\n  { name: "demo-cluster", displayName: "demo-cluster", provider: "EKS", location: "us-east-1", status: "Active" },\n  { name: "prod-gke", displayName: "prod-gke", provider: "GKE", location: "europe-west1", status: "Active" },\n  // …\n];';
const dos = [
  "Put it in the sidebar's `header` slot, where it follows the collapsed rail on its own.",
  "Pass `status` for every cluster, and disable the ones people can't open yet.",
  "Navigate in the `v-model` setter or on `select`, like the old route-bound computed.",
];
const donts = [
  "Don't show it on pages that aren't scoped to one cluster; hide it or set `disabled`.",
  "Don't rely on the dot colour alone — the list prints the status word too.",
  "Don't fetch provider icons from the CDN on offline installers; set `provider-icon-base` to an empty string.",
];
const rows = [
  ["h-10 rounded-8 border-border bg-surface shadow-xs", "Trigger"],
  ["border-white/10 bg-white/4 hover:bg-white/8", "Trigger in a dark sidebar"],
  ["size-7 rounded-6 ring-border-light", "Provider icon"],
  ["bg-success / bg-warning / bg-danger / bg-slate-60", "Status dot"],
  ["rounded-10 border-border bg-surface shadow-lg", "Panel"],
  ["bg-surface-muted", "Highlighted cluster"],
  ["ac-skeleton-bone", "Loading"],
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>
    The cluster switcher sits at the top of the sidebar in Console and KubeDB. It shows the active cluster with its provider and status, and opens a searchable
    list to switch to another one. <code class="prose-code">v-model</code> is the cluster <code class="prose-code">name</code>.
  </p>
  <ComponentPlayground
    tag="AcClusterSwitcher"
    :component="AcClusterSwitcher"
    :controls="[
      { prop: 'sidebarCollapsed', type: 'boolean' },
      { prop: 'loading', type: 'boolean' },
      { prop: 'searchable', type: 'boolean' },
      { prop: 'disabled', type: 'boolean' },
      { prop: 'importLabel', type: 'text' },
    ]"
    :initial="{ sidebarCollapsed: false, loading: false, searchable: true, disabled: false, importLabel: 'Import cluster' }"
    :defaults="{ sidebarCollapsed: false, loading: false, searchable: true, disabled: false, importLabel: 'Import cluster' }"
    :extra="{ modelValue: 'demo-cluster', clusterOptions: clusters, style: 'width: 240px' }"
    extra-code='v-model="cluster" :cluster-options="clusters"'
    :script="script"
  />
  <Callout type="tip">
    Inside <RouterLink to="/components/sidebar">AcSidebar</RouterLink> it reads the collapsed state itself, so <code class="prose-code">sidebar-collapsed</code> is only
    needed elsewhere. In the rail the list opens to the right of the icon.
  </Callout>

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="basic" :level="3">Basic</DocHeading>
  <p>
    Type to filter by name, provider or region. Clusters with <code class="prose-code">disabled</code> (or the old <code class="prose-code">$isDisabled</code>) are listed
    but can't be chosen. The footer action emits <code class="prose-code">import</code>.
  </p>
  <ComponentExample name="cluster-switcher/ClusterSwitcherBasic" />
  <DocHeading id="sidebar" :level="3">In the sidebar</DocHeading>
  <p>In the <code class="prose-code">header</code> slot of a dark sidebar. Collapse it to see the rail; <code class="prose-code">import-url</code> makes the footer a link.</p>
  <ComponentExample name="cluster-switcher/ClusterSwitcherSidebar" :padded="false" />
  <DocHeading id="states" :level="3">States</DocHeading>
  <p>
    <code class="prose-code">loading</code> replaces the old <code class="prose-code">ClusterSwitcherLoader</code>. Turn off <code class="prose-code">searchable</code> for a
    few clusters; <code class="prose-code">import-label=""</code> hides the footer.
  </p>
  <ComponentExample name="cluster-switcher/ClusterSwitcherStates" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>The trigger is a button named after the active cluster and its status, with <code class="prose-code">aria-haspopup="dialog"</code> and <code class="prose-code">aria-expanded</code>.</li>
    <li>The search box is a <code class="prose-code">role="combobox"</code> that controls a <code class="prose-code">role="listbox"</code> through <code class="prose-code">aria-activedescendant</code>, so focus stays in the box while you move.</li>
    <li>Keyboard: Enter, Space or ↓ opens; ↑ ↓ move (skipping disabled clusters); Enter switches; Esc closes and returns focus to the trigger; Tab reaches the footer action.</li>
    <li>Disabled clusters have <code class="prose-code">aria-disabled</code>; the selected one has <code class="prose-code">aria-selected</code>.</li>
  </ul>

  <ApiTables component="AcClusterSwitcher" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr v-for="[c, u] in rows" :key="c" class="border-t border-border-light first:border-0">
          <td class="px-4 py-3"><code class="prose-code">{{ c }}</code></td>
          <td class="px-4 py-3">{{ u }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
