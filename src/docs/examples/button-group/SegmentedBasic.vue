<script setup lang="ts">
import { ref } from "vue";
import { AcSegmentedControl } from "@/lib";

const range = ref("24h");
const ranges = [
  { value: "1h", label: "1h" },
  { value: "6h", label: "6h" },
  { value: "24h", label: "24h" },
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
];
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <AcSegmentedControl v-model="range" :options="ranges" label="Metrics range" />
    <p class="text-base text-muted">Showing CPU usage for the last <strong class="text-heading">{{ range }}</strong></p>
  </div>
</template>
