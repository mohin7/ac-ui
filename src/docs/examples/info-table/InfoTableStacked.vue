<script setup lang="ts">
import { AcCard, AcInfoTable } from "@/lib";

const items = [
  { label: "Repository", value: "s3-backups" },
  { label: "Schedule", value: "0 2 * * *", mono: true },
  { label: "Last backup", value: "Today, 02:00 UTC" },
  { label: "Retention", value: "Keep last 30" },
];
</script>

<template>
  <AcCard title="Backup" class="max-w-100">
    <AcInfoTable :items="items" layout="stacked" :columns="2" :bordered="false" />
  </AcCard>
</template>
