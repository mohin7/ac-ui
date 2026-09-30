<script setup lang="ts">
import { AcProgress } from "@/lib";
</script>

<template>
  <div class="grid max-w-md gap-5">
    <AcProgress :value="55" size="small" label="small · in table cells" />
    <AcProgress :value="55" label="normal" />
    <AcProgress :value="55" size="large" label="large · page-level tasks" />
  </div>
</template>
