<script setup lang="ts">
import { ref } from "vue";
import { AcTable } from "@/lib";

const columns = [
  { key: "name", label: "Name", sortable: true },
  { key: "mode", label: "Mode" },
  { key: "replicas", label: "Replicas", align: "right" as const },
  { key: "status", label: "Status", type: "status" as const },
];

const rows = [
  { id: "demo-postgres", name: "demo-postgres", mode: "Cluster", replicas: 3, status: "Ready", nodes: ["demo-postgres-0 · primary", "demo-postgres-1 · standby", "demo-postgres-2 · standby"] },
  { id: "orders-mongo", name: "orders-mongo", mode: "Replica set", replicas: 3, status: "Provisioning", nodes: ["orders-mongo-0 · primary", "orders-mongo-1 · secondary"] },
  { id: "cache-redis", name: "cache-redis", mode: "Standalone", replicas: 1, status: "Ready", nodes: [] },
];

const open = ref<unknown[]>(["demo-postgres"]);
</script>

<template>
  <AcTable v-model:expanded="open" :columns="columns" :rows="rows" expandable :can-expand="(row) => row.nodes.length > 0">
    <template #expanded="{ row }">
      <p class="mb-2 text-xs font-medium text-label">Nodes</p>
      <ul class="space-y-1 font-mono text-xs">
        <li v-for="node in row.nodes" :key="node">{{ node }}</li>
      </ul>
    </template>
  </AcTable>
</template>
