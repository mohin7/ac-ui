<script setup lang="ts">
import { AcAvatar } from "@/lib";

const members = [
  { name: "Nadia Islam", status: "online" },
  { name: "Arif Chowdhury", status: "away" },
  { name: "Samira Khan", status: "busy" },
  { name: "Rafiul Hasan", status: "offline" },
] as const;
</script>

<template>
  <div class="flex flex-wrap items-center gap-6">
    <div v-for="m in members" :key="m.name" class="flex items-center gap-2">
      <AcAvatar :name="m.name" :status="m.status" />
      <span class="text-xs text-muted capitalize">{{ m.status }}</span>
    </div>
  </div>
</template>
