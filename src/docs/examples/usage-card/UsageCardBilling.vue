<script setup lang="ts">
import { Cpu, MemoryStick } from "@lucide/vue";
import { AcUsageCard } from "@/lib";
</script>

<template>
  <AcUsageCard
    title="Billable usage"
    description="All clusters in appscode-labs"
    period="Sep 2026"
    :breakdown-headers="['Resource', 'Billable', 'Prod', 'Non-prod', 'Free']"
    :breakdown="[
      { label: 'CPU (core-month)', icon: Cpu, values: [5.72, 5.73, 0, 12] },
      { label: 'Memory (GiB-month)', icon: MemoryStick, values: [14, 14.09, 0, 0] },
    ]"
  />
</template>
