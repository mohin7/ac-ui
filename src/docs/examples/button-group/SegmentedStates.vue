<script setup lang="ts">
import { ref } from "vue";
import { AcSegmentedControl } from "@/lib";

const mode = ref("standalone");
const tier = ref("dedicated");
const modes = [
  { value: "standalone", label: "Standalone" },
  { value: "replicaset", label: "Replica Set" },
  { value: "sharded", label: "Sharded", disabled: true },
];
</script>

<template>
  <div class="max-w-md space-y-4">
    <AcSegmentedControl v-model="mode" :options="modes" label="MongoDB mode" size="small" />
    <AcSegmentedControl v-model="tier" :options="['shared', 'dedicated', 'isolated']" label="Machine tier" block />
    <AcSegmentedControl v-model="tier" :options="['shared', 'dedicated', 'isolated']" label="Machine tier (locked)" disabled />
  </div>
</template>
