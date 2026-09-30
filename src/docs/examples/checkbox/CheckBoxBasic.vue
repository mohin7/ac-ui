<script setup lang="ts">
import { ref } from "vue";
import { AcCheckBox } from "@/lib";

const addons = ref(["monitoring"]);
const options = [
  { value: "monitoring", label: "Monitoring with Prometheus and Grafana" },
  { value: "backup", label: "Scheduled backups with Stash" },
  { value: "ingress", label: "Expose via Voyager" },
];
</script>

<template>
  <AcCheckBox v-model="addons" :options="options" />
  <p class="mt-3 text-xs text-label">Selected: {{ addons.join(", ") || "none" }}</p>
</template>
