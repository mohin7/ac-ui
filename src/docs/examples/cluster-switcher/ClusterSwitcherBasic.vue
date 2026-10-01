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
const cluster = ref("demo-cluster");
const event = ref("");
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="w-60 rounded-10 border border-border bg-surface-muted p-3">
      <AcClusterSwitcher v-model="cluster" :cluster-options="clusters" @select="event = `select ${$event.name}`" @import="event = 'import'" />
    </div>
    <p class="text-xs text-muted">
      v-model: <code class="font-mono text-heading">{{ cluster }}</code><template v-if="event"> · last event: {{ event }}</template>
    </p>
  </div>
</template>
