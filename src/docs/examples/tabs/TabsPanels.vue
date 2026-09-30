<script setup lang="ts">
import { ref } from "vue";
import { AcTabs } from "@/lib";

const tab = ref("overview");
const items = [
  { key: "overview", label: "Overview" },
  { key: "backups", label: "Backups", count: 12 },
  { key: "logs", label: "Logs", disabled: true },
];
</script>

<template>
  <AcTabs v-model="tab" :items="items">
    <template #default="{ active }">
      <p v-if="active === 'overview'">Postgres 16.1 running 3 replicas in namespace demo.</p>
      <p v-else-if="active === 'backups'">12 snapshots, the latest 2 hours ago.</p>
    </template>
  </AcTabs>
</template>
