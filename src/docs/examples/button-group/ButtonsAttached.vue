<script setup lang="ts">
import { AcButton, AcButtons } from "@/lib";
import { Minus, Play, Plus, RotateCw, Square } from "@lucide/vue";
</script>

<template>
  <div class="flex flex-wrap items-center gap-6">
    <AcButtons attached inline label="Database lifecycle">
      <AcButton title="Start" color="white">
        <template #icon><Play /></template>
      </AcButton>
      <AcButton title="Restart" color="white">
        <template #icon><RotateCw /></template>
      </AcButton>
      <AcButton title="Stop" color="white">
        <template #icon><Square /></template>
      </AcButton>
    </AcButtons>

    <AcButtons attached inline label="Replicas">
      <AcButton color="white" aria-label="Remove a replica">
        <template #icon><Minus /></template>
      </AcButton>
      <span class="inline-flex h-8 items-center border border-border bg-surface px-3 text-base font-medium text-heading tabular-nums">3 replicas</span>
      <AcButton color="white" aria-label="Add a replica">
        <template #icon><Plus /></template>
      </AcButton>
    </AcButtons>
  </div>
</template>
