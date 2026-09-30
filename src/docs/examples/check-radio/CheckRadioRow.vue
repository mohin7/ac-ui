<script setup lang="ts">
import { ref } from "vue";
import { AcCheckRadio } from "@/lib";

const mode = ref("cluster");
</script>

<template>
  <AcCheckRadio
    v-model="mode"
    row
    :options="[
      { value: 'standalone', label: 'Standalone' },
      { value: 'cluster', label: 'Cluster' },
      { value: 'sharded', label: 'Sharded', disabled: true },
    ]"
  />
</template>
