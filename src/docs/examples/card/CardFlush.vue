<script setup lang="ts">
import { AcCard, AcTable } from "@/lib";

const columns = [
  { key: "name", label: "Name" },
  { key: "schedule", label: "Schedule" },
  { key: "last", label: "Last run", align: "right" as const },
];
const rows = [
  { id: 1, name: "daily-full", schedule: "0 2 * * *", last: "6h ago" },
  { id: 2, name: "hourly-wal", schedule: "0 * * * *", last: "12m ago" },
];
</script>

<template>
  <AcCard title="Backup Schedules" :padded="false">
    <div class="p-4">
      <AcTable :columns="columns" :rows="rows" />
    </div>
  </AcCard>
</template>
