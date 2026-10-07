<script setup lang="ts">
import { ref } from "vue";
import { AcTable } from "@/lib";

const columns = [
  { key: "name", label: "Name" },
  { key: "version", label: "Version" },
  { key: "status", label: "Status" },
];
const rows = [
  { id: 1, name: "demo-postgres", version: "16.1", status: "Ready" },
  { id: 2, name: "orders-mongo", version: "7.0.5", status: "Provisioning" },
  { id: 3, name: "cache-redis", version: "7.2.4", status: "Ready" },
  { id: 4, name: "legacy-mysql", version: "5.7", status: "Unsupported" },
];

const chosen = ref(1);
</script>

<template>
  <div class="flex flex-col gap-3">
    <AcTable
      :columns="columns"
      :rows="rows"
      clickable
      :row-active="(row) => row.id === chosen"
      :row-disabled="(row) => row.status === 'Unsupported'"
      @row-click="chosen = $event.id as number"
    />
    <p class="text-xs text-muted">Chosen: {{ rows.find((r) => r.id === chosen)?.name }}. The unsupported row ignores clicks.</p>
  </div>
</template>
