<script setup lang="ts">
import { ref } from "vue";
import { AcSlider } from "@/lib";

const cpu = ref(95);
const memory = ref(60);
const threshold = ref(0.75);
</script>

<template>
  <div class="grid max-w-md gap-8">
    <AcSlider
      v-model="cpu"
      label="CPU Alert Threshold"
      unit="%"
      show-input
      required
      :error-msg="cpu > 90 ? 'Alerts above 90% fire too late to act on.' : ''"
    />
    <AcSlider v-model="threshold" label="Eviction Ratio" :min="0" :max="1" :step="0.05" hint="Fraction of pods that may be evicted at once." show-input />
    <AcSlider v-model="memory" label="Memory Alert Threshold" unit="%" disabled hint="Managed by the cluster's monitoring preset." />
  </div>
</template>
