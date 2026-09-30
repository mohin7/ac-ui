<script setup lang="ts">
import { AcSkeleton } from "@/lib";
</script>

<template>
  <div class="overflow-hidden rounded-10 border border-border bg-surface">
    <AcSkeleton shape="table" :rows="4" :cols="5" label="Loading databases" />
  </div>
</template>
