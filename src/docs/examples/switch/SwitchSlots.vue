<script setup lang="ts">
import { ref } from "vue";
import { AcBadge, AcSwitch } from "@/lib";

const protect = ref(false);
</script>

<template>
  <AcSwitch v-model="protect" label="Deletion protection">
    <template #right>
      <AcBadge :label="protect ? 'On' : 'Off'" :color="protect ? 'success' : 'default'" variant="light" />
    </template>
  </AcSwitch>
</template>
