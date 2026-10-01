<script setup lang="ts">
import { Database, HardDrive, Server, TriangleAlert } from "lucide-vue-next";
import { AcStatCard, useToast } from "@/lib";

const { toast } = useToast();

const stats = [
  { label: "Databases", value: "24", delta: 9, deltaLabel: "vs last month", icon: Database, trend: [16, 17, 17, 18, 20, 21, 22, 24] },
  { label: "Clusters", value: "6", delta: 0, deltaLabel: "vs last month", icon: Server, trend: [6, 6, 6, 6, 6, 6, 6, 6] },
  { label: "Backup storage", value: "1.8", suffix: "TiB", delta: 12.5, deltaLabel: "vs last month", icon: HardDrive, trend: [1.2, 1.3, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8] },
  { label: "Failed backups", value: "3", delta: "+2", deltaLabel: "vs last week", icon: TriangleAlert, trend: [0, 1, 0, 0, 1, 1, 2, 3], invert: true },
];
</script>

<template>
  <!-- Fills the row with cards at least 220px wide, so it wraps on phones without breakpoints. -->
  <div class="grid grid-cols-[repeat(auto-fill,minmax(min(220px,100%),1fr))] gap-3">
    <AcStatCard
      v-for="s in stats"
      :key="s.label"
      :label="s.label"
      :value="s.value"
      :suffix="s.suffix"
      :delta="s.delta"
      :delta-label="s.deltaLabel"
      :invert-trend="s.invert"
      :icon="s.icon"
      :sparkline="s.trend"
      @click="toast(`Open ${s.label.toLowerCase()}`)"
    />
  </div>
</template>
