<script setup lang="ts">
import { ref } from "vue";
import { AcSelect } from "@/lib";

const machine = ref<string | null>(null);
// Options of a group don't have to be next to each other: they're listed together under the heading.
const options = [
  { value: "t3.medium", label: "t3.medium", description: "2 vCPU · 4 GiB", group: "General purpose" },
  { value: "c6i.xlarge", label: "c6i.xlarge", description: "4 vCPU · 8 GiB", group: "Compute optimized" },
  { value: "t3.large", label: "t3.large", description: "2 vCPU · 8 GiB", group: "General purpose" },
  { value: "r6i.xlarge", label: "r6i.xlarge", description: "4 vCPU · 32 GiB", group: "Memory optimized" },
  { value: "c6i.2xlarge", label: "c6i.2xlarge", description: "8 vCPU · 16 GiB", group: "Compute optimized" },
];
</script>

<template>
  <div class="max-w-80">
    <AcSelect v-model="machine" :options="options" label="Machine Type" searchable />
  </div>
</template>
