<script setup lang="ts">
import { ref } from "vue";
import { AcCheckRadio } from "@/lib";

const storage = ref("durable");
const options = [
  { value: "durable", label: "Durable", description: "Persistent volumes from a StorageClass. Data survives pod restarts." },
  { value: "ephemeral", label: "Ephemeral", description: "EmptyDir storage for tests and caches. Data is lost on restart." },
];
</script>

<template>
  <AcCheckRadio v-model="storage" cards :options="options" />
</template>
