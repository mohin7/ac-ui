<script setup lang="ts">
import { ref } from "vue";
import { Trash2 } from "lucide-vue-next";
import { AcButton, AcTable } from "@/lib";

const columns = [
  { key: "name", label: "Name", sortable: true },
  { key: "type", label: "Type" },
  { key: "version", label: "Version" },
  { key: "age", label: "Age", align: "right" as const },
];

const rows = [
  { id: 1, name: "demo-postgres", type: "Postgres", version: "16.1", age: "2d" },
  { id: 2, name: "orders-mongo", type: "MongoDB", version: "7.0.5", age: "14m" },
  { id: 3, name: "cache-redis", type: "Redis", version: "7.2.4", age: "31d" },
];

const selected = ref<unknown[]>([]);
</script>

<template>
  <div class="mb-3 flex items-center justify-between gap-3">
    <p class="text-xs text-label">{{ selected.length ? `${selected.length} selected` : "Nothing selected" }}</p>
    <AcButton color="danger" variant="outlined" size="small" :disabled="!selected.length">
      <template #icon><Trash2 /></template>
      Delete selected
    </AcButton>
  </div>
  <AcTable v-model:selected="selected" :columns="columns" :rows="rows" selectable />
</template>
