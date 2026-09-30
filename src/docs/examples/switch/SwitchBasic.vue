<script setup lang="ts">
import { ref } from "vue";
import { AcSwitch } from "@/lib";

const tls = ref(true);
</script>

<template>
  <AcSwitch v-model="tls" label="Enable TLS" />
</template>
