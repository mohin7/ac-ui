<script setup lang="ts">
import { ref } from "vue";
import { AcCheckRadio } from "@/lib";

const policy = ref("Delete");
const options = [
  { value: "Delete", label: "Delete" },
  { value: "Halt", label: "Halt" },
  { value: "WipeOut", label: "WipeOut" },
];
</script>

<template>
  <AcCheckRadio v-model="policy" :options="options" />
  <p class="mt-3 text-xs text-label">Termination policy: {{ policy }}</p>
</template>
