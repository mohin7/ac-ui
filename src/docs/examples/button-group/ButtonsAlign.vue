<script setup lang="ts">
import { AcButton, AcButtons } from "@/lib";

const aligns = ["start", "center", "end", "between"] as const;
</script>

<template>
  <div class="space-y-3">
    <AcButtons v-for="align in aligns" :key="align" :align="align" class="rounded-10 border border-dashed border-border p-2">
      <AcButton title="Back" color="white" />
      <AcButton :title="`Next (${align})`" />
    </AcButtons>
  </div>
</template>
