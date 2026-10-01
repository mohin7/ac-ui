<script setup lang="ts">
import { AcLogo } from "@/lib";
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex h-14 items-center gap-3 rounded-10 border border-border bg-surface px-4">
      <AcLogo :size="22" label="" />
      <span class="border-l border-border pl-3 text-lg font-medium text-muted">Console</span>
    </div>
    <div class="flex h-14 items-center gap-2.5 rounded-10 border border-border bg-surface px-4">
      <AcLogo variant="mark" label="" />
      <span class="text-lg font-semibold tracking-[-0.01em] text-heading">KubeDB</span>
    </div>
  </div>
</template>
