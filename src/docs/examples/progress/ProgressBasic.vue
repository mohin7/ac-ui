<script setup lang="ts">
import { AcProgress } from "@/lib";
</script>

<template>
  <div class="flex max-w-md flex-col gap-6">
    <AcProgress :value="64" label="Backup demo-postgres" show-value />
    <AcProgress :value="3" :max="5" label="Replicas ready" show-value value-text="3 of 5" />
    <AcProgress :value="40" />
  </div>
</template>
