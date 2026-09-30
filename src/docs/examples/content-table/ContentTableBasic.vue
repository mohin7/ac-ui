<script setup lang="ts">
import { AcBadge, AcContentTable, AcTable } from "@/lib";

const columns = [
  { key: "name", label: "Name", sortable: true },
  { key: "type", label: "Type" },
  { key: "status", label: "Status" },
];
const rows = [
  { id: 1, name: "demo-postgres", type: "Postgres", status: "Ready" },
  { id: 2, name: "orders-mongo", type: "MongoDB", status: "Provisioning" },
  { id: 3, name: "cache-redis", type: "Redis", status: "Critical" },
  { id: 4, name: "search-es", type: "Elasticsearch", status: "Ready" },
];
const matches = (q: string) => rows.filter((r) => r.name.includes(q.toLowerCase()) || r.type.toLowerCase().includes(q.toLowerCase()));
const tone = (s: unknown) => (s === "Ready" ? "success" : s === "Critical" ? "danger" : "info");
</script>

<template>
  <AcContentTable title="Databases" :subtitle="`${rows.length} databases`" searchable search-placeholder="Search databases">
    <template #default="{ searchText }">
      <AcTable :columns="columns" :rows="matches(searchText)" empty-text="No databases match your search.">
        <template #cell-name="{ value }">
          <span class="font-medium text-heading">{{ value }}</span>
        </template>
        <template #cell-status="{ value }">
          <AcBadge :label="String(value)" :color="tone(value)" variant="light" rounded dot />
        </template>
      </AcTable>
    </template>
  </AcContentTable>
</template>
