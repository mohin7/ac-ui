<script setup lang="ts">
import { ref } from "vue";
import { AcButton, AcModal } from "@/lib";

const open = ref(false);
const events = Array.from({ length: 30 }, (_, i) => ({
  time: `12:${String(59 - i).padStart(2, "0")}`,
  text: i % 3 ? "Pod demo-postgres-1 is ready" : "Backup snapshot completed",
}));
</script>

<template>
  <AcButton title="View Events" color="white" @click="open = true" />

  <AcModal v-model:open="open" title="Events" description="demo-postgres · last hour" size="medium">
    <ul class="divide-y divide-border-light">
      <li v-for="e in events" :key="e.time" class="flex gap-4 py-2">
        <span class="w-12 shrink-0 font-mono text-xs text-muted">{{ e.time }}</span>
        <span class="text-heading">{{ e.text }}</span>
      </li>
    </ul>
    <template #footer-left>
      <span class="text-xs text-muted">{{ events.length }} events</span>
    </template>
    <template #footer>
      <AcButton title="Close" color="white" @click="open = false" />
    </template>
  </AcModal>
</template>
