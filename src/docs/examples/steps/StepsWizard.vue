<script setup lang="ts">
import { ref } from "vue";
import { AcButton, AcSteps } from "@/lib";

const steps = [
  { id: 1, title: "Engine", description: "Pick a database" },
  { id: 2, title: "Configure", description: "Name and topology" },
  { id: 3, title: "Review", description: "Confirm and deploy" },
];
const active = ref(1);
</script>

<template>
  <AcSteps :options="steps" :active="active" />
  <div class="mt-6 flex justify-center gap-2">
    <AcButton title="Back" color="white" :disabled="active === 1" @click="active--" />
    <AcButton v-if="active < steps.length" title="Next" @click="active++" />
    <AcButton v-else title="Deploy" @click="active = 1" />
  </div>
</template>
