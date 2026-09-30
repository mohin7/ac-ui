<script setup lang="ts">
import { AcKbd } from "@/lib";
</script>

<template>
  <div class="flex flex-wrap items-center gap-6">
    <AcKbd :keys="['mod', 'k']" size="small" />
    <AcKbd :keys="['mod', 'k']" />
  </div>
</template>
