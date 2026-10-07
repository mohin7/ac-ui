<script setup lang="ts">
import { ref } from "vue";
import { Database, DatabaseBackup, LayoutDashboard, Settings } from "@lucide/vue";
import { AcClusterSwitcher, AcSidebar, AcSidebarItem, AcSidebarSection } from "@/lib";

const clusters = [
  { name: "demo-cluster", displayName: "demo-cluster", provider: "EKS", location: "us-east-1", status: "Active" },
  { name: "prod-gke", displayName: "prod-gke", provider: "GKE", location: "europe-west1", status: "Active" },
  { name: "staging-aks", displayName: "staging-aks", provider: "AKS", location: "eastus2", status: "Active" },
  { name: "edge-linode", displayName: "edge-linode", provider: "Akamai", location: "ap-south", status: "NotReady", disabled: true },
  { name: "do-analytics", displayName: "do-analytics", provider: "DigitalOcean", location: "nyc3", status: "Lost", disabled: true },
  { name: "lab-kind", displayName: "lab-kind", provider: "Generic", status: "NotImported", disabled: true },
];
const cluster = ref("prod-gke");
const collapsed = ref(false);
</script>

<template>
  <div class="relative flex h-[420px] overflow-hidden rounded-10 border border-border">
    <AcSidebar v-model:collapsed="collapsed" dark contained :breakpoint="0" label="Console">
      <template #header>
        <AcClusterSwitcher v-model="cluster" :cluster-options="clusters" import-url="#/components/cluster-switcher" />
      </template>
      <AcSidebarSection>
        <AcSidebarItem label="Overview" :icon="LayoutDashboard" active />
        <AcSidebarItem label="Databases" :icon="Database" />
        <AcSidebarItem label="Backups" :icon="DatabaseBackup" />
        <AcSidebarItem label="Settings" :icon="Settings" />
      </AcSidebarSection>
    </AcSidebar>
    <div class="flex-1 bg-surface-muted p-6 text-base text-muted">
      Collapse the sidebar: the switcher becomes a provider icon and the list opens to the right.
    </div>
  </div>
</template>
