<script setup lang="ts">
import { KeyRound } from "@lucide/vue";
import { AcEmptyState } from "@/lib";
</script>

<template>
  <div class="grid gap-6 md:grid-cols-2">
    <div class="overflow-hidden rounded-10 border border-border bg-surface">
      <div class="flex h-9 items-center gap-4 border-b border-border bg-surface-muted px-4 text-xs font-medium text-label">
        <span class="flex-1">Secret</span><span class="w-24">Type</span><span class="w-20">Age</span>
      </div>
      <AcEmptyState size="small" title="No secrets in this namespace" :icon="KeyRound" />
    </div>
    <div class="rounded-10 border border-border bg-surface">
      <AcEmptyState size="large" variant="search" query="redis" description="No Redis databases match your filters." />
    </div>
  </div>
</template>
