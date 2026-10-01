<script setup lang="ts">
import { ref } from "vue";
import { AcClusterSwitcher } from "@/lib";

const clusters = [
  { name: "demo-cluster", displayName: "demo-cluster", provider: "EKS", location: "us-east-1", status: "Active" },
  { name: "prod-gke", displayName: "prod-gke", provider: "GKE", location: "europe-west1", status: "Active" },
  { name: "staging-aks", displayName: "staging-aks", provider: "AKS", location: "eastus2", status: "Active" },
  { name: "edge-linode", displayName: "edge-linode", provider: "Akamai", location: "ap-south", status: "NotReady", disabled: true },
  { name: "do-analytics", displayName: "do-analytics", provider: "DigitalOcean", location: "nyc3", status: "Lost", disabled: true },
  { name: "lab-kind", displayName: "lab-kind", provider: "Generic", status: "NotImported", disabled: true },
];
const empty = ref("");
const fixed = ref("demo-cluster");
</script>

<template>
  <div class="grid gap-6 sm:grid-cols-2">
    <div class="space-y-2">
      <p class="text-xs font-medium text-label">Loading</p>
      <div class="flex items-center gap-3">
        <div class="w-60"><AcClusterSwitcher loading /></div>
        <AcClusterSwitcher loading sidebar-collapsed />
      </div>
    </div>
    <div class="space-y-2">
      <p class="text-xs font-medium text-label">Rail</p>
      <AcClusterSwitcher v-model="fixed" :cluster-options="clusters" sidebar-collapsed />
    </div>
    <div class="space-y-2">
      <p class="text-xs font-medium text-label">Nothing selected, no search, no footer</p>
      <div class="w-60">
        <AcClusterSwitcher v-model="empty" :cluster-options="clusters.slice(0, 3)" :searchable="false" import-label="" />
      </div>
    </div>
    <div class="space-y-2">
      <p class="text-xs font-medium text-label">Disabled, offline icons</p>
      <div class="w-60">
        <AcClusterSwitcher v-model="fixed" :cluster-options="clusters" disabled provider-icon-base="" />
      </div>
    </div>
  </div>
</template>
