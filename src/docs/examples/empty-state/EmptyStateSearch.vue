<script setup lang="ts">
import { ref } from "vue";
import { AcButton, AcEmptyState } from "@/lib";

const query = ref("pg-staging");
</script>

<template>
  <AcEmptyState variant="search" :query="query" description="Check the spelling, or search in all namespaces.">
    <template #actions>
      <AcButton title="Clear search" color="white" @click="query = ''" />
    </template>
  </AcEmptyState>
</template>
