<script setup lang="ts">
import { AcSkeleton } from "@/lib";

// Fixed widths so the placeholder code lines don't jump between renders.
const codeWidths = ["40%", "65%", "55%", "80%", "30%", "70%", "50%", "60%"];
</script>

<template>
  <!-- one aria-busy region for the whole editor; each piece is hidden with label="" -->
  <div class="flex gap-6 rounded-10 border border-border bg-surface p-4" aria-busy="true">
    <span class="sr-only">Loading editor</span>
    <div class="hidden w-48 shrink-0 flex-col gap-2.5 sm:flex">
      <AcSkeleton height="20px" label="" />
      <AcSkeleton v-for="i in 3" :key="i" height="20px" width="85%" class="ml-auto" label="" />
      <AcSkeleton height="20px" label="" />
      <AcSkeleton v-for="i in 2" :key="`b${i}`" height="20px" width="85%" class="ml-auto" label="" />
    </div>
    <div class="flex min-w-0 flex-1 flex-col gap-2.5">
      <AcSkeleton v-for="(w, i) in codeWidths" :key="i" :width="w" label="" />
    </div>
  </div>
</template>
