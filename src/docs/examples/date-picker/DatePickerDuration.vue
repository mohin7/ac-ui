<script setup lang="ts">
import { ref } from "vue";
import { AcDatePicker } from "@/lib";

const presets = [
  { label: "5 minutes", duration: "5m" },
  { label: "30 minutes", duration: "30m" },
  { label: "1 hour", duration: "1h" },
  { label: "6 hours", duration: "6h" },
];
const timeout = ref<string | null>("1h30m");
</script>

<template>
  <div class="max-w-80 space-y-2">
    <AcDatePicker
      v-model="timeout"
      label="Timeout"
      mode="duration"
      clearable
      :presets="presets"
      hint="Maximum time allowed for the OpsRequest to complete."
    />
    <p class="text-xs text-muted">spec.timeout: <code class="prose-code">{{ JSON.stringify(timeout) }}</code></p>
  </div>
</template>
