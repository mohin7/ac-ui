<script setup lang="ts">
import { AcInput } from "@/lib";
</script>

<template>
  <div class="grid max-w-160 gap-5 sm:grid-cols-2">
    <AcInput label="Small (default)" size="small" />
    <AcInput label="Normal" size="normal" />
  </div>
</template>
