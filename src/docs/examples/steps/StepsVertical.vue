<script setup lang="ts">
import { ref } from "vue";
import { AcButton, AcSteps } from "@/lib";

const steps = [
  {
    id: 1,
    title: "Cluster selection",
    substeps: [
      { id: "provider", title: "Select provider" },
      { id: "credential", title: "Select credential" },
      { id: "cluster", title: "Select cluster" },
    ],
  },
  { id: 2, title: "Import", description: "Name the cluster and finish" },
];

const order = ["provider", "credential", "cluster"];
const sub = ref(1);
</script>

<template>
  <div class="flex max-w-100 items-start gap-8">
    <div class="w-56 shrink-0">
      <AcSteps :options="steps" :active="1" orientation="vertical" :active-substep="order[sub]" />
    </div>
    <div class="flex gap-2">
      <AcButton variant="outlined" size="small" :disabled="sub === 0" @click="sub--">Back</AcButton>
      <AcButton size="small" :disabled="sub === order.length - 1" @click="sub++">Next</AcButton>
    </div>
  </div>
</template>
