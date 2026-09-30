<script setup lang="ts">
import { ref } from "vue";
import { AcInput } from "@/lib";

const name = ref("");
</script>

<template>
  <div class="max-w-80">
    <AcInput v-model="name" label="Database Name" />
  </div>
</template>
