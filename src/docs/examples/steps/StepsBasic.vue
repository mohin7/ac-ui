<script setup lang="ts">
import { AcSteps } from "@/lib";

const steps = [
  { id: 1, title: "Select Cluster", description: "Choose where to deploy" },
  { id: 2, title: "Configure", description: "Version, storage and replicas" },
  { id: 3, title: "Review", description: "Confirm and deploy" },
];
</script>

<template>
  <AcSteps :options="steps" :active="2" />
</template>
