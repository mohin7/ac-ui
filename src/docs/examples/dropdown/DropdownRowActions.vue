<script setup lang="ts">
import { ref } from "vue";
import { AcDropdown, AcDropdownDivider, AcDropdownItem, AcTable } from "@/lib";
import { ArchiveRestore, DatabaseBackup, Pencil, Terminal, Trash2 } from "lucide-vue-next";

const columns = [
  { key: "name", label: "Name" },
  { key: "type", label: "Type" },
  { key: "namespace", label: "Namespace" },
  { key: "status", label: "Status" },
  { key: "actions", label: "", align: "right" as const, width: "56px" },
];
const rows = [
  { id: 1, name: "demo-postgres", type: "Postgres 16.1", namespace: "demo", status: "Ready" },
  { id: 2, name: "orders-mongo", type: "MongoDB 7.0.5", namespace: "shop", status: "Provisioning" },
  { id: 3, name: "cache-redis", type: "Redis 7.2.4", namespace: "shop", status: "Ready" },
];
const last = ref("");
</script>

<template>
  <AcTable :columns="columns" :rows="rows">
    <template #cell-actions="{ row }">
      <AcDropdown align="end" :menu-label="`Actions for ${row.name}`">
        <AcDropdownItem label="Connect" :icon="Terminal" @click="last = `Connect ${row.name}`" />
        <AcDropdownItem label="Back up now" :icon="DatabaseBackup" @click="last = `Back up ${row.name}`" />
        <AcDropdownItem label="Restore" :icon="ArchiveRestore" :disabled="row.status !== 'Ready'" />
        <AcDropdownItem label="Edit" :icon="Pencil" shortcut="E" @click="last = `Edit ${row.name}`" />
        <AcDropdownDivider />
        <AcDropdownItem label="Delete" :icon="Trash2" danger @click="last = `Delete ${row.name}`" />
      </AcDropdown>
    </template>
  </AcTable>
  <p class="mt-3 text-xs text-muted" aria-live="polite">{{ last ? `Chose: ${last}` : "Open a row's ⋮ menu." }}</p>
</template>
