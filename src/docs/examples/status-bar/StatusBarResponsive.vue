<script setup lang="ts">
import { ref } from "vue";
import { Cpu, MemoryStick } from "lucide-vue-next";
import { AcSegmentedControl, AcStatusBar } from "@/lib";

const width = ref("100%");
const items = [
  { label: "Connected", status: "success" as const, dot: true, priority: "high" as const },
  { label: "Cluster", value: "prod-us-east-1", mono: true, priority: "high" as const },
  { label: "Postgres", value: "demo/pg-ha", mono: true },
  { label: "Version", value: "16.4", mono: true, priority: "low" as const },
  { label: "CPU", icon: Cpu, value: "250m / 1", meter: 25, align: "right" as const, priority: "low" as const },
  { label: "Memory", icon: MemoryStick, value: "900Mi / 1Gi", meter: 88, align: "right" as const },
  { label: "Ready", status: "success" as const, align: "right" as const, priority: "high" as const },
];
</script>

<template>
  <div class="space-y-4">
    <AcSegmentedControl
      v-model="width"
      :options="[{ value: '375px', label: 'Phone' }, { value: '640px', label: 'Tablet' }, { value: '100%', label: 'Full' }]"
      label="Bar width"
      size="small"
    />
    <div class="overflow-hidden rounded-10 border border-border" :style="{ width, maxWidth: '100%' }">
      <AcStatusBar :items="items" />
    </div>
  </div>
</template>
