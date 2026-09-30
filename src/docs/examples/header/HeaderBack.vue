<script setup lang="ts">
import { AcBadge, AcButton, AcHeader } from "@/lib";

// In an app: const router = useRouter(); router.back()
function goBack() {}
</script>

<template>
  <AcHeader title="demo-postgres" subtitle="Postgres 16.1 · namespace demo" back-button @back="goBack">
    <template #breadcrumb>Databases / Postgres</template>
    <template #title-extra>
      <AcBadge label="Ready" color="success" variant="light" rounded dot />
    </template>
    <AcButton title="Connect" color="white" />
    <AcButton title="Edit" color="white" />
    <AcButton title="Delete" color="danger" variant="light" />
  </AcHeader>
</template>
