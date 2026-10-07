<script setup lang="ts">
import { Database, Plus } from "@lucide/vue";
import { AcButton, AcEmptyState } from "@/lib";
</script>

<template>
  <AcEmptyState
    title="No databases yet"
    description="Create a PostgreSQL, MongoDB, MySQL or Redis database in this namespace. It takes about two minutes."
    :icon="Database"
  >
    <template #actions>
      <AcButton title="Create Database">
        <template #icon><Plus /></template>
      </AcButton>
      <AcButton title="Import existing" color="white" />
    </template>
  </AcEmptyState>
</template>
