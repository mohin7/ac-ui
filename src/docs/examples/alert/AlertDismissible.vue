<script setup lang="ts">
import { ref } from "vue";
import { AcAlert, AcButton } from "@/lib";

const visible = ref(true);
</script>

<template>
  <AcAlert v-if="visible" color="success" dismissible @close="visible = false">
    Backup completed for demo-postgres.
  </AcAlert>
  <AcButton v-else title="Show again" color="white" size="small" @click="visible = true" />
</template>
