<script setup lang="ts">
import { AcButton, AcCard, AcPage, AcTable } from "@/lib";

const columns = [
  { key: "name", label: "Name" },
  { key: "type", label: "Type" },
  { key: "status", label: "Status" },
];
const rows = [
  { id: 1, name: "demo-postgres", type: "Postgres", status: "Ready" },
  { id: 2, name: "orders-mongo", type: "MongoDB", status: "Provisioning" },
];
</script>

<template>
  <div class="rounded-10 border border-dashed border-border bg-surface-sunken">
    <AcPage>
      <AcCard title="Overview" subtitle="Padded body">
        <p>Cards, tables and forms are spaced evenly; the page supplies the padding.</p>
      </AcCard>
      <AcCard title="Databases" :padded="false">
        <template #actions><AcButton size="small">Create</AcButton></template>
        <AcTable flat :columns="columns" :rows="rows" />
      </AcCard>
    </AcPage>
  </div>
</template>
