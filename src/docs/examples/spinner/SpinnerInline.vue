<script setup lang="ts">
import { AcSpinner } from "@/lib";
</script>

<template>
  <div class="flex flex-col gap-3">
    <!-- label="" because the text next to it already says what's loading -->
    <p class="flex items-center gap-2 text-muted">
      <AcSpinner size="xs" label="" />
      Checking cluster status…
    </p>
    <p class="flex items-center gap-2 text-blue-30">
      <AcSpinner label="" />
      Taking snapshot of demo-postgres
    </p>
  </div>
</template>
