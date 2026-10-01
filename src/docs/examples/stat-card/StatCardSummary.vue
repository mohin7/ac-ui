<script setup lang="ts">
import { AcCard, AcStatCard, AcTag } from "@/lib";

const items = [
  { label: "Scenario", value: "Point-in-time recovery" },
  { label: "Recovery point", value: "2026-09-08 09:42 UTC", mono: true },
  { label: "Target", value: "ace/ace-postgres", mono: true },
  { label: "Estimated RTO", value: "18m", suffix: "/ 20m SLA", status: "success" as const },
  { label: "Discards", value: "6h 05m of activity", status: "warning" as const },
  { label: "Rollback", value: "Snapshot before recovery", status: "success" as const },
];
</script>

<template>
  <AcCard title="Recovery summary" subtitle="Review before you start the restore">
    <template #actions>
      <AcTag label="pitr-wf-94022" class="font-mono" />
    </template>
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <AcStatCard
        v-for="item in items"
        :key="item.label"
        size="small"
        :label="item.label"
        :value="item.value"
        :suffix="item.suffix"
        :status="item.status"
        :mono="item.mono"
      />
    </div>
  </AcCard>
</template>
