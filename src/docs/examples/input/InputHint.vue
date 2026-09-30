<script setup lang="ts">
import { ref } from "vue";
import { AcInput } from "@/lib";

const ns = ref("");
</script>

<template>
  <div class="max-w-80">
    <AcInput v-model="ns" label="Namespace" required hint="Lowercase letters, numbers and hyphens." />
  </div>
</template>
