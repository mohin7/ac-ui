<script setup lang="ts">
import { ref } from "vue";
import { AcBadge, AcButton, AcContentTable, AcSelect, AcTable } from "@/lib";

const type = ref<string | null>(null);
const types = [
  { value: "Postgres", label: "Postgres" },
  { value: "MongoDB", label: "MongoDB" },
  { value: "Redis", label: "Redis" },
];
const columns = [
  { key: "name", label: "Name" },
  { key: "type", label: "Type" },
  { key: "age", label: "Age", align: "right" as const },
];
const rows = [
  { id: 1, name: "demo-postgres", type: "Postgres", age: "2d" },
  { id: 2, name: "orders-mongo", type: "MongoDB", age: "14m" },
  { id: 3, name: "cache-redis", type: "Redis", age: "31d" },
];
</script>

<template>
  <AcContentTable title="Databases" searchable>
    <template #title-actions>
      <AcBadge :label="String(rows.length)" variant="outlined" rounded />
    </template>
    <template #left-controls>
      <div class="w-40">
        <AcSelect v-model="type" :options="types" placeholder="All types" size="compact" clearable />
      </div>
    </template>
    <template #right-controls>
      <AcButton title="Create Database" />
    </template>
    <template #default="{ searchText }">
      <AcTable
        :columns="columns"
        :rows="rows.filter((r) => (!type || r.type === type) && r.name.includes(searchText))"
      />
    </template>
  </AcContentTable>
</template>
