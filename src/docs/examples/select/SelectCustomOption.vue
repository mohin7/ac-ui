<script setup lang="ts">
import { ref } from "vue";
import { AcBadge, AcSelect } from "@/lib";

const cluster = ref<string | null>("prod-eks");
const clusters = [
  { value: "prod-eks", label: "prod-eks", description: "AWS · us-east-1", status: "Ready" },
  { value: "staging-gke", label: "staging-gke", description: "GCP · us-central1", status: "Ready" },
  { value: "dev-kind", label: "dev-kind", description: "Local · kind", status: "NotReady" },
];
const statusOf = (value: unknown) => clusters.find((c) => c.value === value)?.status;
</script>

<template>
  <div class="max-w-80">
    <AcSelect v-model="cluster" :options="clusters" label="Cluster">
      <template #option="{ option }">
        <span class="flex items-center justify-between gap-2">
          <span class="min-w-0">
            <span class="block truncate font-medium">{{ option.label }}</span>
            <span class="block truncate text-xs text-muted">{{ option.description }}</span>
          </span>
          <AcBadge
            :label="statusOf(option.value)"
            :color="statusOf(option.value) === 'Ready' ? 'success' : 'warning'"
            variant="light"
            rounded
            dot
          />
        </span>
      </template>
    </AcSelect>
  </div>
</template>
