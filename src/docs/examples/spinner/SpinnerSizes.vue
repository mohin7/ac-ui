<script setup lang="ts">
import { AcSpinner } from "@/lib";

const sizes = ["xs", "small", "normal", "large"] as const;
</script>

<template>
  <div class="flex flex-wrap items-end gap-8 text-primary">
    <div v-for="size in sizes" :key="size" class="flex flex-col items-center gap-2">
      <AcSpinner :size="size" />
      <span class="text-xs text-muted">{{ size }}</span>
    </div>
  </div>
</template>
