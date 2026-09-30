<script setup lang="ts">
import { computed, ref } from "vue";
import { AcBadge, AcButton, AcContentTable, AcEmptyState, AcTable } from "@/lib";
import type { Column } from "@/lib";

const COLUMNS: Column[] = [
  { key: "name", label: "Name" },
  { key: "engine", label: "Engine" },
  { key: "namespace", label: "Namespace" },
  { key: "status", label: "Status" },
];

const DATABASES = [
  { id: 1, name: "demo-postgres", engine: "Postgres", namespace: "demo", status: "Ready" },
  { id: 2, name: "orders-mongo", engine: "MongoDB", namespace: "shop", status: "Ready" },
  { id: 3, name: "cache-redis", engine: "Redis", namespace: "shop", status: "Critical" },
];

const search = ref("pg-staging");

const matches = computed(() => {
  const q = search.value.trim().toLowerCase();
  return q ? DATABASES.filter((d) => d.name.includes(q) || d.engine.toLowerCase().includes(q)) : DATABASES;
});
</script>

<template>
  <AcContentTable v-model:search="search" title="Databases" :subtitle="`${matches.length} of ${DATABASES.length}`" searchable search-placeholder="Search databases">
    <!-- Outside the table: its empty cell spans the table's scroll width, so on phones it would be cut off -->
    <AcEmptyState
      v-if="!matches.length"
      variant="search"
      size="small"
      :query="search"
      description="Check the spelling, or search by engine, e.g. “postgres”."
    >
      <template #actions>
        <AcButton title="Clear search" color="white" size="small" @click="search = ''" />
      </template>
    </AcEmptyState>
    <AcTable v-else :columns="COLUMNS" :rows="matches">
      <template #cell-name="{ value }">
        <span class="font-medium text-heading">{{ value }}</span>
      </template>
      <template #cell-status="{ value }">
        <AcBadge :label="String(value)" :color="value === 'Ready' ? 'success' : 'danger'" variant="light" rounded dot />
      </template>
    </AcTable>
  </AcContentTable>
</template>
