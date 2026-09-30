<script setup lang="ts">
import { ref } from "vue";
import { AcSwitch, AcTable } from "@/lib";

const columns = [
  { key: "name", label: "Name", sortable: true },
  { key: "type", label: "Type", sortable: true },
  { key: "version", label: "Version" },
  { key: "status", label: "Status" },
  { key: "age", label: "Age", align: "right" as const },
];

const rows = [
  { id: 1, name: "demo-postgres", type: "Postgres", version: "16.1", status: "Ready", age: "2d" },
  { id: 2, name: "orders-mongo", type: "MongoDB", version: "7.0.5", status: "Provisioning", age: "14m" },
  { id: 3, name: "cache-redis", type: "Redis", version: "7.2.4", status: "Critical", age: "31d" },
];

const loading = ref(true);
</script>

<template>
  <AcSwitch v-model="loading" label="Loading" class="mb-3" />
  <AcTable :columns="columns" :rows="rows" :loading="loading" :loader-rows="3" />
</template>
