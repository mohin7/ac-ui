<script setup lang="ts">
import { ref } from "vue";
import { AcButton, AcPreloader } from "@/lib";

const loading = ref(false);

function show() {
  loading.value = true;
  setTimeout(() => (loading.value = false), 2000);
}
</script>

<template>
  <AcButton title="Show full-page preloader" color="white" @click="show" />
  <AcPreloader v-if="loading" full-page message="Signing you in…" />
</template>
