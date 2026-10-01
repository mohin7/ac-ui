<script setup lang="ts">
import { ref } from "vue";
import { AcButton, AcCard, AcStatCard } from "@/lib";

const loading = ref(false);
const insights = [
  { label: "Replicas", value: "3 / 3" },
  { label: "CPU request", value: "1500m" },
  { label: "Memory request", value: "6Gi" },
  { label: "Storage", value: "20Gi" },
  { label: "Connections", value: "42" },
  { label: "Version", value: "16.1" },
];

function reload() {
  loading.value = true;
  setTimeout(() => (loading.value = false), 1500);
}
</script>

<template>
  <AcCard title="Insights">
    <template #actions>
      <AcButton title="Reload" color="white" size="small" :loading="loading" @click="reload" />
    </template>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(min(200px,100%),1fr))] gap-2">
      <AcStatCard v-for="i in insights" :key="i.label" inline :label="i.label" :value="i.value" :loading="loading" />
    </div>
  </AcCard>
</template>
