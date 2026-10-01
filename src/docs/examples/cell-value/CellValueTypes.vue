<script setup lang="ts">
import { AcCellValue } from "@/lib";

const created = new Date(Date.now() - 3 * 86400_000 - 4 * 3600_000).toISOString();

const rows = [
  { label: "Name", value: "pg-orders", props: { bold: true } },
  { label: "Replicas", value: 3 },
  { label: "Storage", value: "50Gi" },
  { label: "CPU usage", value: 42.567, props: { unit: "%" } },
  { label: "TLS enabled", value: true },
  { label: "Halted", value: false },
  { label: "Created", value: created },
  { label: "Labels", value: { app: "postgres", team: "payments", "app.kubernetes.io/managed-by": "kubedb", tier: "gold" } },
  { label: "Endpoints", value: ["10.0.12.4:5432", "10.0.12.9:5432"] },
  { label: "Resources", value: { requests: { cpu: "500m", memory: "1Gi" }, limits: { memory: "2Gi" } } },
  { label: "Phase", value: "Ready", props: { type: "status" as const } },
  { label: "Paused", value: null },
];
</script>

<template>
  <dl class="grid gap-x-6 gap-y-3 text-base sm:grid-cols-[10rem_1fr]">
    <template v-for="row in rows" :key="row.label">
      <dt class="text-muted">{{ row.label }}</dt>
      <dd class="min-w-0 text-heading">
        <AcCellValue :value="row.value" :title="row.label" v-bind="row.props" />
      </dd>
    </template>
  </dl>
</template>
