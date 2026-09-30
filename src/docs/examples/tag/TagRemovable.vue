<script setup lang="ts">
import { ref } from "vue";
import { AcButton, AcTag } from "@/lib";

const initial = ["namespace: demo", "kind: Postgres", "status: Ready", "version: 16.1"];
const filters = ref([...initial]);

function remove(filter: string) {
  filters.value = filters.value.filter((f) => f !== filter);
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-1.5">
    <AcTag v-for="f in filters" :key="f" :label="f" removable @remove="remove(f)" />
    <span v-if="!filters.length" class="text-xs text-muted">No filters</span>
    <AcButton
      v-if="filters.length < initial.length"
      title="Reset"
      color="ghost"
      size="small"
      @click="filters = [...initial]"
    />
  </div>
</template>
