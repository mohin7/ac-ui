<script setup lang="ts">
import { AcLogo } from "@/lib";

const sizes = [
  { size: 16, use: "Favicon, dense tables" },
  { size: 24, use: "Navbar, sidebar (default)" },
  { size: 32, use: "Sign-in, empty states" },
  { size: 48, use: "Marketing, splash" },
];
</script>

<template>
  <div class="flex flex-col divide-y divide-border-light">
    <div v-for="s in sizes" :key="s.size" class="flex flex-wrap items-center gap-x-6 gap-y-2 py-4 first:pt-0 last:pb-0">
      <span class="w-40 shrink-0 text-xs text-muted"><span class="font-mono text-heading">{{ s.size }}px</span> · {{ s.use }}</span>
      <AcLogo variant="mark" :size="s.size" label="" />
      <AcLogo :size="s.size" label="" />
    </div>
  </div>
</template>
