<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { RefreshCw } from "lucide-vue-next";
import { AcBadge, AcBanner, AcButton, AcContentTable, AcEmptyState, AcTable } from "@/lib";
import type { Column } from "@/lib";

const COLUMNS: Column[] = [
  { key: "name", label: "Name" },
  { key: "engine", label: "Engine" },
  { key: "status", label: "Status" },
];

const ROWS = [
  { id: 1, name: "demo-postgres", engine: "Postgres 16.1" },
  { id: 2, name: "orders-mongo", engine: "MongoDB 7.0.5" },
];

const failed = ref(true);
const retrying = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

function retry() {
  retrying.value = true;
  timer = setTimeout(() => {
    retrying.value = false;
    failed.value = false;
  }, 1200);
}

onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <div class="overflow-hidden rounded-10 border border-border bg-surface-muted shadow-xs">
    <AcBanner color="warning" title="Cluster degraded" action-label="View nodes" action-href="#/examples/states">
      2 of 5 nodes in demo-cluster are NotReady. Some metrics may be stale.
    </AcBanner>

    <div class="p-4 sm:p-6">
      <AcContentTable title="Databases" subtitle="demo-cluster" :padded="!failed">
        <template v-if="!failed" #right-controls>
          <AcButton title="Break it again" color="white" size="small" @click="failed = true" />
        </template>

        <AcEmptyState
          v-if="failed"
          variant="error"
          title="Couldn't load databases"
          description="The request to https://10.0.0.1:6443 timed out after 30 seconds. The API server may be restarting."
        >
          <template #actions>
            <AcButton title="Retry" :loading="retrying" @click="retry">
              <template #icon><RefreshCw /></template>
            </AcButton>
            <AcButton title="Check cluster status" color="white" href="#/examples/states" />
          </template>
        </AcEmptyState>

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
