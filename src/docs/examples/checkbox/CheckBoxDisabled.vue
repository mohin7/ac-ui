<script setup lang="ts">
import { ref } from "vue";
import { AcCheckBox } from "@/lib";

const features = ref(["tls"]);
const options = [
  { value: "tls", label: "TLS" },
  { value: "audit", label: "Audit logs (Enterprise)", disabled: true },
];
</script>

<template>
  <AcCheckBox v-model="features" :options="options" />
</template>
