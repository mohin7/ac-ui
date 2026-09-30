<script setup lang="ts">
import { ref } from "vue";
import { AcSelect } from "@/lib";

const zones = ref<string[]>(["us-east-1a", "us-east-1b"]);
const options = [
  { value: "us-east-1a", label: "us-east-1a" },
  { value: "us-east-1b", label: "us-east-1b" },
  { value: "us-east-1c", label: "us-east-1c" },
  { value: "us-east-1d", label: "us-east-1d" },
];
</script>

<template>
  <div class="max-w-100">
    <AcSelect v-model="zones" :options="options" label="Availability Zones" multiple clearable />
    <p class="mt-3 text-xs text-muted">v-model: {{ zones }}</p>
  </div>
</template>
