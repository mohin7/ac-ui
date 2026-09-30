<script setup lang="ts">
import { AcProgress } from "@/lib";

const colors = ["primary", "info", "success", "warning", "danger"] as const;
</script>

<template>
  <div class="grid max-w-md gap-4">
    <AcProgress v-for="(c, i) in colors" :key="c" :value="30 + i * 15" :label="c" :color="c" show-value />
  </div>
</template>
