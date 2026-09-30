<script setup lang="ts">
import { ref } from "vue";
import { AcButton } from "@/lib";

const saving = ref(false);

async function save() {
  saving.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1500));
  saving.value = false;
}
</script>

<template>
  <AcButton title="Save" :loading="saving" @click="save" />
  <AcButton title="Loading" variant="outlined" loading />
</template>
