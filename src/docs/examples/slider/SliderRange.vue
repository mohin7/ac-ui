<script setup lang="ts">
import { ref } from "vue";
import { AcSlider } from "@/lib";

const replicas = ref<[number, number]>([3, 7]);
const saved = ref<[number, number]>([3, 7]);
</script>

<template>
  <div class="max-w-md space-y-3">
    <AcSlider
      v-model="replicas"
      label="Replicas"
      description="The autoscaler keeps the MongoDB replica set between these bounds."
      range
      :min="1"
      :max="9"
      :marks="[1, 3, 5, 7, 9]"
      show-input
      @change="(v) => (saved = v as [number, number])"
    />
    <p class="text-xs text-muted">Saved on release: {{ saved[0] }}–{{ saved[1] }} replicas</p>
  </div>
</template>
