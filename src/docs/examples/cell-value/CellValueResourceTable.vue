<script setup lang="ts">
import { computed } from "vue";
import { AcTable, type ResourceTable } from "@/lib";

// The shape the resource API returns for a list page: column descriptors and rows of cells.
const now = Date.now();
const table: ResourceTable = {
  columns: [
    { name: "Name", type: "string", format: "name", priority: 3 },
    { name: "Namespace", type: "string", priority: 3 },
    { name: "Version", type: "string", priority: 3 },
    { name: "Status", type: "string", priority: 3 },
    { name: "Labels", type: "object", priority: 3 },
    { name: "Age", type: "date", priority: 3 },
  ],
  rows: [
    {
      namespace: "demo",
      cells: [
        { data: "pg-orders", link: "#/components/cell-value" },
        { data: "demo" },
        { data: "16.1" },
        { data: "Ready", color: "success" },
        { data: { app: "orders", team: "payments", tier: "gold", env: "prod" } },
        { data: new Date(now - 3 * 86400_000).toISOString(), sort: now - 3 * 86400_000 },
      ],
    },
    {
      namespace: "shop",
      cells: [
        { data: "mongo-catalog", link: "#/components/cell-value" },
        { data: "shop" },
        { data: "7.0.5" },
        { data: "Provisioning", color: "warning" },
        { data: { app: "catalog" } },
        { data: new Date(now - 14 * 60_000).toISOString(), sort: now - 14 * 60_000 },
      ],
    },
    {
      namespace: "cache",
      cells: [
        { data: "redis-sessions", link: "#/components/cell-value" },
        { data: "cache" },
        { data: "<unknown>" },
        { data: "NotReady", color: "danger", tooltip: "2 of 3 replicas are not ready" },
        { data: {} },
        { data: new Date(now - 31 * 86400_000).toISOString(), sort: now - 31 * 86400_000 },
      ],
    },
  ],
};

const columns = computed(() =>
  table.columns.map((col, i) => ({ key: String(i), label: col.name, descriptor: col, sortable: true })),
);
const rows = computed(() =>
  table.rows.map((row, r) => ({ id: r, ...Object.fromEntries(row.cells.map((cell, i) => [String(i), cell])) })),
);
</script>

<template>
  <AcTable :columns="columns" :rows="rows" />
</template>
