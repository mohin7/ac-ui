<script setup lang="ts">
import { AcButton } from "@/lib";
</script>

<template>
  <AcButton title="Create Database">
    <template #icon>
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v10M3 8h10" /></svg>
    </template>
  </AcButton>
  <AcButton color="white" aria-label="Add">
    <template #icon>
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v10M3 8h10" /></svg>
    </template>
  </AcButton>
</template>
