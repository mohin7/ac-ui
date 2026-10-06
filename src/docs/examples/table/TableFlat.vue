<script setup lang="ts">
import { AcCard, AcTable } from "@/lib";

const columns = [
  { key: "name", label: "Name" },
  { key: "type", label: "Type" },
  { key: "status", label: "Status" },
  { key: "age", label: "Age", align: "right" as const },
];

const rows = [
  { id: 1, name: "demo-postgres", type: "Postgres", status: "Ready", age: "2d" },
  { id: 2, name: "orders-mongo", type: "MongoDB", status: "Provisioning", age: "14m" },
  { id: 3, name: "cache-redis", type: "Redis", status: "Critical", age: "31d" },
];
</script>

<template>
  <AcCard title="Databases" subtitle="3 total" :padded="false">
    <AcTable flat :columns="columns" :rows="rows" />
  </AcCard>
</template>
