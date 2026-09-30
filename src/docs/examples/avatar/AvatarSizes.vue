<script setup lang="ts">
import { AcAvatar } from "@/lib";

const sizes = ["xs", "small", "normal", "large"] as const;
</script>

<template>
  <div class="flex flex-wrap items-end gap-6">
    <div v-for="size in sizes" :key="size" class="flex flex-col items-center gap-2">
      <AcAvatar name="Samira Khan" :size="size" status="online" />
      <span class="text-xs text-muted">{{ size }}</span>
    </div>
  </div>
</template>
