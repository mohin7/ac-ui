<script setup lang="ts">
import { AcButton, AcHeader } from "@/lib";
</script>

<template>
  <div class="overflow-hidden rounded-10 border border-border">
    <AcHeader title="Create MongoDB" subtitle="appscode / demo-cluster" size="compact">
      <AcButton variant="outlined" size="small">Cancel</AcButton>
      <AcButton size="small">Deploy</AcButton>
    </AcHeader>
  </div>
</template>
