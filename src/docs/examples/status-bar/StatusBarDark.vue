<script setup lang="ts">
import { Cpu, MemoryStick } from "lucide-vue-next";
import { AcStatusBar } from "@/lib";

const items = [
  { label: "Connected", status: "success" as const, dot: true, priority: "high" as const },
  { label: "Cluster", value: "gke-appscode-prod", mono: true },
  { label: "Namespace", value: "kubedb", mono: true },
  { label: "CPU", icon: Cpu, value: "1.2 / 4", meter: 30, align: "right" as const },
  { label: "Memory", icon: MemoryStick, value: "6Gi / 8Gi", meter: 76, align: "right" as const },
  { label: "v2026.9.30", align: "right" as const, priority: "low" as const },
];
</script>

<template>
  <div class="overflow-hidden rounded-10 border border-border">
    <AcStatusBar :items="items" dark />
  </div>
</template>
