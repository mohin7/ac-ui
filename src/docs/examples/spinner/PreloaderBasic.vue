<script setup lang="ts">
import { AcPreloader } from "@/lib";
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <div class="rounded-10 border border-border bg-surface">
      <AcPreloader message="Fetching resource layout" min-height="200px" />
    </div>
    <div class="rounded-10 border border-border bg-surface">
      <AcPreloader :show-spinner="false" message="Waiting for the first metrics scrape…" min-height="200px" />
    </div>
  </div>
</template>
