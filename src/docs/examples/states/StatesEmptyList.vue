<script setup lang="ts">
import { ref } from "vue";
import { Database, Plus } from "lucide-vue-next";
import { AcBadge, AcButton, AcContentTable, AcEmptyState, AcTable } from "@/lib";
import type { Column } from "@/lib";

interface Row extends Record<string, unknown> {
  id: number;
  name: string;
  engine: string;
  namespace: string;
}

const COLUMNS: Column[] = [
  { key: "name", label: "Name" },
  { key: "engine", label: "Engine" },
  { key: "namespace", label: "Namespace" },
  { key: "status", label: "Status" },
];

const rows = ref<Row[]>([]);

function create() {
  rows.value = [{ id: 1, name: "demo-postgres", engine: "Postgres 16.1", namespace: "demo" }];
}
</script>

<template>
  <AcContentTable title="Databases" :subtitle="rows.length ? '1 database' : 'demo-cluster'">
    <template v-if="rows.length" #right-controls>
      <AcButton title="Reset" color="white" size="small" @click="rows = []" />
    </template>

    <AcEmptyState
      v-if="!rows.length"
      :icon="Database"
      title="No databases yet"
      description="Deploy a managed Postgres, MongoDB, Redis or MySQL with KubeDB. It takes about two minutes."
    >
      <template #actions>
        <AcButton title="Create Database" @click="create">
          <template #icon><Plus /></template>
        </AcButton>
        <AcButton title="Read the guide" color="white" href="https://kubedb.com/docs/" />
      </template>
    </AcEmptyState>

    <AcTable v-else :columns="COLUMNS" :rows="rows">
      <template #cell-name="{ value }">
        <span class="font-medium text-heading">{{ value }}</span>
      </template>
      <template #cell-status>
        <AcBadge label="Provisioning" color="info" variant="light" rounded dot />
      </template>
    </AcTable>
  </AcContentTable>
</template>
