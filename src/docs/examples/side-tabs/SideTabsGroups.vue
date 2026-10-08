<script setup lang="ts">
import { ref } from "vue";
import { Boxes, FileCode, GitBranch, LayoutDashboard, ListTree, Network, ScrollText, Wrench } from "@lucide/vue";
import { AcSideTabs } from "@/lib";

const page = ref("ops-scale");
const items = [
  { key: "overview", label: "Overview", icon: LayoutDashboard, group: "Resource" },
  { key: "pods", label: "Pods", icon: Boxes, badge: 3, group: "Resource" },
  { key: "services", label: "Services", icon: Network, group: "Resource" },
  {
    key: "operations",
    label: "Operations",
    icon: Wrench,
    group: "Manage",
    children: [
      { key: "ops-scale", label: "Horizontal scaling" },
      { key: "ops-upgrade", label: "Version upgrade" },
      { key: "ops-restart", label: "Restart" },
      { key: "ops-reconfigure-tls", label: "Reconfigure TLS", disabled: true },
    ],
  },
  { key: "events", label: "Events", icon: ListTree, badge: 2, badgeColor: "danger" as const, group: "Inspect" },
  { key: "graph", label: "Graph", icon: GitBranch, group: "Inspect" },
  { key: "manifest", label: "Manifest", icon: FileCode, group: "Inspect" },
  { key: "logs", label: "Logs", icon: ScrollText, group: "Inspect" },
];
</script>

<template>
  <div class="overflow-hidden rounded-10 border border-border bg-surface-muted">
    <AcSideTabs v-model="page" :items="items" label="MongoDB mg-rs" :sticky="false">
      <div class="p-5 text-base text-muted">
        Current page: <code class="text-code">{{ page }}</code>
      </div>
    </AcSideTabs>
  </div>
</template>
