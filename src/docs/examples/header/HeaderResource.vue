<script setup lang="ts">
import { Link2, Trash2 } from "@lucide/vue";
import { AcBadge, AcButton, AcHeader } from "@/lib";
</script>

<template>
  <AcHeader title="orders-mongo" subtitle="MongoDB · demo">
    <template #icon><img src="/logos/kubedb-logo.png" alt="" /></template>
    <template #title-extra><AcBadge color="success">Ready</AcBadge></template>
    <AcButton variant="outlined">
      <template #icon><Link2 /></template>
      Connect
    </AcButton>
    <AcButton color="danger" variant="light">
      <template #icon><Trash2 /></template>
      Delete
    </AcButton>
  </AcHeader>
</template>
