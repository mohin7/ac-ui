<script setup lang="ts">
import { AcLogo } from "@/lib";
</script>

<template>
  <div class="grid gap-3 sm:grid-cols-3">
    <div class="flex h-28 items-center justify-center rounded-10 border border-border bg-surface">
      <AcLogo :size="28" />
    </div>
    <div class="dark flex h-28 items-center justify-center rounded-10 border border-border bg-surface">
      <AcLogo :size="28" />
    </div>
    <div class="flex h-28 items-center justify-center rounded-10 bg-brand-navy">
      <AcLogo :size="28" tone="white" />
    </div>
  </div>
</template>
