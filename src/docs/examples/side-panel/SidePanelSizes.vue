<script setup lang="ts">
import { ref } from "vue";
import { AcButton, AcSidePanel } from "@/lib";

type Size = "small" | "normal" | "large" | "full";
const sizes: Size[] = ["small", "normal", "large", "full"];
const size = ref<Size>("normal");
const side = ref<"right" | "left">("right");
const open = ref(false);

function show(s: Size, from: "right" | "left" = "right") {
  size.value = s;
  side.value = from;
  open.value = true;
}
</script>

<template>
  <AcButton v-for="s in sizes" :key="s" :title="s" color="white" @click="show(s)" />
  <AcButton title="left" color="white" variant="outlined" @click="show('normal', 'left')" />

  <AcSidePanel v-model:open="open" :title="`Size: ${size}`" :size="size" :side="side">
    <p>small 400px · normal 520px · large 800px · full viewport. Phones always get the full width.</p>
    <template #footer>
      <AcButton title="Close" color="white" @click="open = false" />
    </template>
  </AcSidePanel>
</template>
