<script setup lang="ts">
import { ref } from "vue";
import { AcSlider } from "@/lib";

const diff = ref(30);
</script>

<template>
  <div class="max-w-md">
    <AcSlider
      v-model="diff"
      label="Resource Diff Percentage"
      description="Scale only when the recommendation differs from the current request by more than this."
      unit="%"
      :marks="[0, 50, 100]"
      show-input
    />
  </div>
</template>
