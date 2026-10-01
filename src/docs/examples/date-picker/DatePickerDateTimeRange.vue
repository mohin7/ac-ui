<script setup lang="ts">
import { ref } from "vue";
import { AcDatePicker } from "@/lib";

const presets = [
  { label: "Last 15 minutes", duration: "15m" },
  { label: "Last 1 hour", duration: "1h" },
  { label: "Last 24 hours", duration: "24h" },
  { label: "Last 7 days", duration: "7d" },
];
const logWindow = ref<[string, string] | null>(null);
</script>

<template>
  <div class="max-w-96 space-y-2">
    <AcDatePicker v-model="logWindow" label="Log Window" mode="datetime" range :presets="presets" />
    <p class="text-xs break-all text-muted">v-model: <code class="prose-code">{{ JSON.stringify(logWindow) }}</code></p>
  </div>
</template>
