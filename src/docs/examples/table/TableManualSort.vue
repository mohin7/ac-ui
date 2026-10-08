<script setup lang="ts">
import { computed, ref } from "vue";
import { AcButton, AcTable } from "@/lib";

const columns = [
  { key: "name", label: "Name", sortable: true },
  { key: "size", label: "Size (GiB)", sortable: true, align: "right" as const },
];
// 12 rows over 3 pages: the sort has to cover all of them, not just the page in view.
const all = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, name: `volume-${String.fromCharCode(97 + ((i * 5) % 12))}`, size: ((i * 37) % 90) + 10 }));

const sortBy = ref<{ key: string; mode: "asc" | "desc" } | null>(null);
const page = ref(1);
const pageSize = 4;

const sorted = computed(() => {
  const s = sortBy.value;
  if (!s) return all;
  const dir = s.mode === "asc" ? 1 : -1;
  return [...all].sort((a, b) => String(a[s.key as "name"]).localeCompare(String(b[s.key as "name"]), undefined, { numeric: true }) * dir);
});
const rows = computed(() => sorted.value.slice((page.value - 1) * pageSize, page.value * pageSize));
</script>

<template>
  <div class="flex flex-col gap-3">
    <AcTable v-model:sort-by="sortBy" manual-sort :columns="columns" :rows="rows" @sort="page = 1" />
    <div class="flex items-center justify-between text-xs text-muted">
      <span>Page {{ page }} of {{ Math.ceil(all.length / pageSize) }}</span>
      <div class="flex gap-2">
        <AcButton size="small" color="white" :disabled="page === 1" @click="page--">Previous</AcButton>
        <AcButton size="small" color="white" :disabled="page * pageSize >= all.length" @click="page++">Next</AcButton>
      </div>
    </div>
  </div>
</template>
