<script setup lang="ts">
import { ref } from "vue";
import { AcButton, AcDeleteModal } from "@/lib";

const open = ref(false);
</script>

<template>
  <AcButton title="Delete" color="danger" variant="light" @click="open = true" />

  <AcDeleteModal
    v-model:open="open"
    title="Delete Backup"
    item-name="daily-full-2026-09-28"
    @confirm="open = false"
  />
</template>
