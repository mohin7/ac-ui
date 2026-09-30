<script setup lang="ts">
import { ref } from "vue";
import { AcTabs } from "@/lib";

const tab = ref("overview");
const items = [
  { key: "overview", label: "Overview" },
  { key: "backups", label: "Backups" },
  { key: "monitoring", label: "Monitoring" },
  { key: "yaml", label: "YAML" },
];
</script>

<template>
  <AcTabs v-model="tab" :items="items" />
</template>
