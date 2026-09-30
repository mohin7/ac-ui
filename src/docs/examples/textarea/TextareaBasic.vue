<script setup lang="ts">
import { ref } from "vue";
import { AcTextarea } from "@/lib";

const description = ref("");
</script>

<template>
  <div class="max-w-120">
    <AcTextarea v-model="description" label="Description" hint="Shown on the cluster's overview page." />
  </div>
</template>
