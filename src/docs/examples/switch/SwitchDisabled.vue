<script setup lang="ts">
import { AcSwitch } from "@/lib";
</script>

<template>
  <div class="space-y-3">
    <AcSwitch :model-value="true" label="Managed by the operator" disabled />
    <AcSwitch :model-value="false" label="Requires Enterprise" disabled />
  </div>
</template>
