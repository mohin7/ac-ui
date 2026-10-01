<script setup lang="ts">
import { AcCellValue } from "@/lib";

const tolerations = [
  { key: "dedicated", operator: "Equal", value: "db", effect: "NoSchedule" },
  { key: "node.kubernetes.io/not-ready", operator: "Exists", effect: "NoExecute", tolerationSeconds: 300 },
];
const backup = { schedule: "0 */6 * * *", repository: { name: "s3-backups", bucket: "appscode-prod" }, retention: { keepLast: 7 } };
const zones = ["us-east-1a", "us-east-1b", "us-east-1c", "us-east-1d", "us-east-1f"];
</script>

<template>
  <div class="space-y-3 text-base">
    <div class="flex items-center gap-4">
      <span class="w-28 shrink-0 text-muted">Backup</span>
      <AcCellValue :value="backup" title="Backup config" />
    </div>
    <div class="flex items-center gap-4">
      <span class="w-28 shrink-0 text-muted">Tolerations</span>
      <AcCellValue :value="tolerations" title="Tolerations" />
    </div>
    <div class="flex items-center gap-4">
      <span class="w-28 shrink-0 text-muted">Zones</span>
      <AcCellValue :value="zones" title="Zones" :max-items="2" />
    </div>
  </div>
</template>
