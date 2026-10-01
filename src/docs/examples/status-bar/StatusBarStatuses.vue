<script setup lang="ts">
import { AcStatusBar } from "@/lib";

// The kubedb footer's feature checks: each status picks its icon and colour.
const items = [
  { label: "Monitoring", status: "success" as const },
  { label: "Backup", status: "warning" as const },
  { label: "Not exposed", status: "danger" as const },
  { label: "TLS", status: "info" as const },
  { label: "Archiver", status: "pending" as const },
  { label: "Autoscaler", status: "neutral" as const },
];
</script>

<template>
  <div class="overflow-hidden rounded-10 border border-border">
    <AcStatusBar :items="items" />
  </div>
</template>
