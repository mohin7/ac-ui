<script setup lang="ts">
import { ref } from "vue";
import { AcSlider } from "@/lib";

const retention = ref(7);
const storage = ref(100);

function days(n: number) {
  return n === 1 ? "1 day" : `${n} days`;
}
</script>

<template>
  <div class="grid max-w-md gap-8">
    <AcSlider
      v-model="retention"
      label="Keep Backups For"
      :min="1"
      :max="30"
      :format-value="days"
      :marks="[
        { value: 1, label: '1 day' },
        { value: 7, label: '1 week' },
        { value: 14, label: '2 weeks' },
        { value: 30, label: '30 days' },
      ]"
    />
    <AcSlider v-model="storage" label="Storage" :min="10" :max="500" :step="10" unit="GiB" :marks="[10, 100, 250, 500]" tooltip="always" />
  </div>
</template>
