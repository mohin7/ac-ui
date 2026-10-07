<script setup lang="ts">
import { ref } from "vue";
import { AcSegmentedControl } from "@/lib";
import { Braces, FileCode, LayoutGrid, List } from "@lucide/vue";

const format = ref("yaml");
const view = ref("list");
</script>

<template>
  <div class="flex flex-wrap items-center gap-6">
    <AcSegmentedControl
      v-model="format"
      label="Manifest format"
      :options="[
        { value: 'yaml', label: 'YAML', icon: FileCode },
        { value: 'json', label: 'JSON', icon: Braces },
      ]"
    />
    <AcSegmentedControl
      v-model="view"
      label="Cluster view"
      icon-only
      :options="[
        { value: 'list', label: 'List view', icon: List },
        { value: 'grid', label: 'Grid view', icon: LayoutGrid },
      ]"
    />
  </div>
</template>
