<script setup lang="ts">
import { AcAvatar, AcBadge } from "@/lib";

const members = [
  { name: "Nadia Islam", email: "nadia@appscode.com", role: "Owner" },
  { name: "Arif Chowdhury", email: "arif@appscode.com", role: "Admin" },
  { name: "Samira Khan", email: "samira@appscode.com", role: "Viewer" },
];
</script>

<template>
  <ul class="max-w-md divide-y divide-border-light rounded-10 border border-border bg-surface">
    <li v-for="m in members" :key="m.email" class="flex items-center gap-3 px-4 py-3">
      <!-- the name is written next to it, so the avatar is decorative -->
      <AcAvatar :name="m.name" alt="" />
      <div class="min-w-0 flex-1">
        <p class="truncate font-medium text-heading">{{ m.name }}</p>
        <p class="truncate text-xs text-muted">{{ m.email }}</p>
      </div>
      <AcBadge :label="m.role" variant="light" />
    </li>
  </ul>
</template>
