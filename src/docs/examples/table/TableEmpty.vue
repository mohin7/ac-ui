<script setup lang="ts">
import { AcButton, AcTable } from "@/lib";

const columns = [
  { key: "name", label: "Name" },
  { key: "type", label: "Type" },
  { key: "status", label: "Status" },
];
</script>

<template>
  <AcTable :columns="columns" :rows="[]">
    <template #empty>
      <p class="mb-3">No databases in this namespace yet.</p>
      <AcButton title="Create Database" size="small" />
    </template>
  </AcTable>
</template>
