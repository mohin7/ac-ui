<script setup lang="ts">
import { Check } from "@lucide/vue";
import { AcBadge, AcStatCard } from "@/lib";
</script>

<template>
  <div class="grid grid-cols-[repeat(auto-fill,minmax(min(200px,100%),1fr))] gap-3">
    <AcStatCard label="Status">
      <AcBadge label="Protected" color="success" variant="light" rounded dot />
      <template #footer>
        <span class="inline-flex items-center gap-1"><Check class="size-3.5 text-green-40" aria-hidden="true" />4 of 4 targets healthy</span>
      </template>
    </AcStatCard>
    <AcStatCard label="Data RPO" value="41s" suffix="/ 1m target" :progress="68" mono>
      <template #footer><span class="font-mono text-green-30">+19s margin</span></template>
    </AcStatCard>
    <AcStatCard label="Estimated RTO" value="18m" suffix="/ 20m" status="success" mono>
      <template #badge><AcBadge label="Optimal" color="success" variant="light" rounded /></template>
      <template #footer>2m margin</template>
    </AcStatCard>
    <AcStatCard label="Object RPO" value="2h 04m" suffix="/ 2h" status="warning" :progress="100" progress-color="warning" mono>
      <template #footer>Breached by 4m</template>
    </AcStatCard>
    <AcStatCard label="Failed restores" value="2" status="danger" delta="+2" delta-label="since yesterday" invert-trend />
  </div>
</template>
