<script setup lang="ts">
import { ref } from "vue";
import { AcButton, AcModal } from "@/lib";

type Size = "small" | "normal" | "medium" | "large" | "full";
const size = ref<Size>("normal");
const open = ref(false);
const sizes: Size[] = ["small", "normal", "medium", "large", "full"];

function show(s: Size) {
  size.value = s;
  open.value = true;
}
</script>

<template>
  <AcButton v-for="s in sizes" :key="s" :title="s" color="white" @click="show(s)" />

  <AcModal v-model:open="open" :title="`Size: ${size}`" :size="size">
    <p>small 440px · normal 520px · medium 800px · large 1000px · full viewport.</p>
    <template #footer>
      <AcButton title="Close" color="white" @click="open = false" />
    </template>
  </AcModal>
</template>
