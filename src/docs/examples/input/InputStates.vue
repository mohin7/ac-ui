<script setup lang="ts">
import { AcInput } from "@/lib";
</script>

<template>
  <div class="grid max-w-160 gap-5 sm:grid-cols-2">
    <AcInput model-value="appscode" label="Organization" readonly />
    <AcInput label="Cluster ID" disabled />
  </div>
</template>
