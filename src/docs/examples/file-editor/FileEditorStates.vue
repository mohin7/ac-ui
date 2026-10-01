<script setup lang="ts">
import { ref } from "vue";
import { AcSegmentedControl } from "@/lib";
import { AcFileEditor } from "@/lib/editor";

const state = ref<"loading" | "empty">("loading");
</script>

<template>
  <div class="flex flex-col gap-4">
    <AcSegmentedControl v-model="state" :options="[{ value: 'loading', label: 'Loading' }, { value: 'empty', label: 'Empty' }]" label="State" />
    <AcFileEditor :files="[]" :loading="state === 'loading'" empty-text="This ConfigMap has no data" height="320px" />
  </div>
</template>
