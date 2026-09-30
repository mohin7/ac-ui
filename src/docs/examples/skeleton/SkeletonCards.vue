<script setup lang="ts">
import { AcSkeleton } from "@/lib";
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-3" aria-busy="true">
    <span class="sr-only">Loading cluster overview</span>
    <AcSkeleton v-for="i in 3" :key="i" shape="info-card" label="" />
    <AcSkeleton shape="card" label="" class="sm:col-span-3" />
  </div>
</template>
