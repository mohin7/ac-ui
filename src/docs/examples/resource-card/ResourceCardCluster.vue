<script setup lang="ts">
import { Cloud, Download, KeyRound, Trash2 } from "lucide-vue-next";
import { AcDropdownDivider, AcDropdownItem, AcResourceCard, useToast } from "@/lib";

const { toast } = useToast();

const clusters = [
  {
    name: "prod-eks-us-east-1",
    status: "Active",
    color: "success" as const,
    tags: [{ label: "v1.30.4" }, { label: "Hub", color: "info" as const }],
    details: [
      { label: "Provider", value: "AWS EKS" },
      { label: "Location", value: "us-east-1" },
      { label: "Nodes", value: 12 },
      { label: "Age", value: "182d" },
    ],
  },
  {
    name: "staging-gke",
    status: "Active",
    color: "success" as const,
    tags: [{ label: "v1.28.9 (outdated)", color: "warning" as const }, { label: "Spoke", color: "info" as const }],
    details: [
      { label: "Provider", value: "Google GKE" },
      { label: "Location", value: "europe-west1-b" },
      { label: "Nodes", value: 4 },
      { label: "Age", value: "41d" },
    ],
  },
  {
    name: "edge-kind-01",
    status: "Connecting",
    statusLoading: true,
    tags: [{ label: "v1.31.0" }],
    details: [
      { label: "Provider", value: "Generic" },
      { label: "Location", value: "" },
      { label: "Nodes", value: "" },
      { label: "Age", value: "2m" },
    ],
  },
];
</script>

<template>
  <div class="grid grid-cols-[repeat(auto-fill,minmax(min(340px,100%),1fr))] gap-3">
    <AcResourceCard
      v-for="c in clusters"
      :key="c.name"
      :name="c.name"
      :icon="Cloud"
      :status="c.status"
      :status-color="c.color"
      :status-loading="c.statusLoading"
      :tags="c.tags"
      :details="c.details"
      @click="toast(`Open ${c.name}`)"
    >
      <template #menu>
        <AcDropdownItem label="Download kubeconfig" :icon="Download" />
        <AcDropdownItem label="Rotate credentials" :icon="KeyRound" />
        <AcDropdownDivider />
        <AcDropdownItem label="Remove cluster" :icon="Trash2" danger />
      </template>
    </AcResourceCard>
  </div>
</template>
