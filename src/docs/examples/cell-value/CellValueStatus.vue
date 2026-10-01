<script setup lang="ts">
import { AcCellValue } from "@/lib";

const phases = ["Ready", "Running", "Provisioning", "Halted", "Failed", "Critical", "Unknown"];
const colored = [
  { data: "Succeeded", color: "success" },
  { data: "Backup in progress", color: "is-info" },
  { data: "Expiring in 6d", color: "warning" },
  { data: "Expired", color: "danger" },
  { data: "Paused", color: "light" },
];
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap gap-2">
      <AcCellValue v-for="phase in phases" :key="phase" :value="phase" type="status" />
    </div>
    <div class="flex flex-wrap gap-2">
      <AcCellValue v-for="cell in colored" :key="cell.data" :cell="cell" />
    </div>
  </div>
</template>
