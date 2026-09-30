<script setup lang="ts">
import { ref } from "vue";
import { AcSelect } from "@/lib";

const version = ref<string | null>(null);
const options = [
  { value: "16.1", label: "16.1" },
  { value: "15.5", label: "15.5" },
  { value: "14.10", label: "14.10" },
  { value: "13.13", label: "13.13", disabled: true },
];
</script>

<template>
  <div class="max-w-80">
    <AcSelect v-model="version" :options="options" label="Postgres Version" />
  </div>
</template>
