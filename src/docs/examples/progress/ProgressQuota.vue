<script setup lang="ts">
import { AcProgress } from "@/lib";

const quotas = [
  { label: "CPU", used: 5.4, limit: 12, unit: "cores" },
  { label: "Memory", used: 26, limit: 32, unit: "GiB" },
  { label: "Storage", used: 97, limit: 100, unit: "GiB" },
];
</script>

<template>
  <div class="grid max-w-md gap-5">
    <AcProgress
      v-for="q in quotas"
      :key="q.label"
      :value="q.used"
      :max="q.limit"
      :label="q.label"
      :value-text="`${q.used} of ${q.limit} ${q.unit}`"
      color="auto"
      show-value
    />
  </div>
</template>
