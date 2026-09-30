<script setup lang="ts">
import { AcPreloader } from "@/lib";
</script>

<template>
  <!-- the preloader fills a sized parent, like a terminal or editor pane -->
  <div class="h-64 overflow-hidden rounded-10 border border-border bg-surface-muted">
    <AcPreloader message="Connecting to demo-postgres-0…" />
  </div>
</template>
