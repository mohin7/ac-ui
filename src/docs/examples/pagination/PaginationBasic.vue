<script setup lang="ts">
import { computed, ref } from "vue";
import { AcPagination } from "@/lib";

// 57 daily snapshots, newest first.
const backups = Array.from({ length: 57 }, (_, i) => {
  const day = new Date(Date.UTC(2026, 8, 30 - i)).toISOString().slice(0, 10).replaceAll("-", "");
  return { name: `pg-prod-${day}-0200`, size: `${(1.2 + ((i * 7) % 10) / 10).toFixed(1)} GiB` };
});

const page = ref(1);
const pageSize = ref(5);
const range = ref({ start: 0, end: 5 });
const rows = computed(() => backups.slice(range.value.start, range.value.end));
</script>

<template>
  <div class="overflow-hidden rounded-10 border border-border bg-surface">
    <ul class="divide-y divide-border-light">
      <li v-for="b in rows" :key="b.name" class="flex items-center justify-between px-4 py-2.5 text-base">
        <span class="font-mono text-xs text-heading">{{ b.name }}</span>
        <span class="text-muted tabular-nums">{{ b.size }}</span>
      </li>
    </ul>
    <div class="border-t border-border px-4 py-3">
      <AcPagination
        v-model:page="page"
        v-model:page-size="pageSize"
        :total="backups.length"
        :page-sizes="[5, 10, 20, 50]"
        item-label="snapshots"
        @range="range = $event"
      />
    </div>
  </div>
</template>
