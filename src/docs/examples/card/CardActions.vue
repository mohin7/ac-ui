<script setup lang="ts">
import { AcBadge, AcButton, AcCard } from "@/lib";
</script>

<template>
  <AcCard title="demo-postgres" subtitle="Postgres 16.1 · namespace demo">
    <template #actions>
      <AcBadge label="Ready" color="success" variant="light" rounded dot />
      <AcButton title="Edit" color="white" size="small" />
    </template>
    <dl class="grid grid-cols-3 gap-4">
      <div><dt class="text-xs text-label">Replicas</dt><dd class="text-2xl text-heading">3</dd></div>
      <div><dt class="text-xs text-label">Storage</dt><dd class="text-2xl text-heading">20 GiB</dd></div>
      <div><dt class="text-xs text-label">Age</dt><dd class="text-2xl text-heading">2d</dd></div>
    </dl>
  </AcCard>
</template>
