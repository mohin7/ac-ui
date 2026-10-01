<script setup lang="ts">
import { ref } from "vue";
import { AcDatePicker } from "@/lib";

const presets = [
  { label: "Today", duration: "0s" },
  { label: "Last 7 days", duration: "6d" },
  { label: "Last 30 days", duration: "29d" },
  { label: "Last 90 days", duration: "89d" },
];
const period = ref<[string, string] | null>(null);
</script>

<template>
  <div class="max-w-80 space-y-2">
    <AcDatePicker v-model="period" label="Backup Sessions" range clearable :presets="presets" />
    <p class="text-xs text-muted">v-model: <code class="prose-code">{{ JSON.stringify(period) }}</code></p>
  </div>
</template>
