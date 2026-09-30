<script setup lang="ts">
import { ref } from "vue";
import { AcBadge, AcContentTable, AcPreloader, AcSkeleton, AcSwitch, AcTable } from "@/lib";
import type { Column } from "@/lib";

const COLUMNS: Column[] = [
  { key: "name", label: "Name" },
  { key: "engine", label: "Engine" },
  { key: "namespace", label: "Namespace" },
  { key: "status", label: "Status" },
];

const ROWS = [
  { id: 1, name: "demo-postgres", engine: "Postgres 16.1", namespace: "demo" },
  { id: 2, name: "orders-mongo", engine: "MongoDB 7.0.5", namespace: "shop" },
  { id: 3, name: "search-es", engine: "Elasticsearch 8.11", namespace: "search" },
];

const loading = ref(true);
</script>

<template>
  <div class="space-y-4">
    <AcSwitch v-model="loading" label="Loading" />

    <div class="grid gap-4 lg:grid-cols-[2fr_3fr]">
      <div class="flex rounded-10 border border-border bg-surface shadow-xs">
        <AcPreloader v-if="loading" message="Fetching resources from demo-cluster…" min-height="260px" />
        <div v-else class="flex min-h-[260px] w-full flex-col justify-center gap-1 p-6">
          <p class="text-xs font-medium text-muted">demo-cluster</p>
          <p class="text-2xl font-semibold text-heading">12 databases</p>
          <p class="text-base text-muted">Kubernetes 1.31 · 5 nodes · us-east-1</p>
        </div>
      </div>

      <AcContentTable title="Databases" :subtitle="loading ? 'Loading…' : `${ROWS.length} databases`" :padded="!loading">
        <AcSkeleton v-if="loading" shape="table" :rows="3" :cols="4" label="Loading databases" />
        <AcTable v-else :columns="COLUMNS" :rows="ROWS">
          <template #cell-name="{ value }">
            <span class="font-medium text-heading">{{ value }}</span>
          </template>
          <template #cell-status>
            <AcBadge label="Ready" color="success" variant="light" rounded dot />
          </template>
        </AcTable>
      </AcContentTable>
    </div>
  </div>
</template>
