<script setup lang="ts">
import { ref } from "vue";
import { AcSelect } from "@/lib";

interface Cluster {
  id: string;
  name: string;
  region: string;
}

const clusters: Cluster[] = [
  { id: "c1", name: "prod-us", region: "us-east-1" },
  { id: "c2", name: "prod-eu", region: "eu-west-1" },
  { id: "c3", name: "staging", region: "us-west-2" },
];
const options = clusters.map((c) => ({ value: c, label: c.name, description: c.region }));

// Objects from elsewhere (an API refresh) are equal to the options' by `id`, not by reference.
const one = ref<Cluster | null>({ ...clusters[1]! });
const many = ref<Cluster[]>([{ ...clusters[0]! }, { ...clusters[2]! }]);
</script>

<template>
  <div class="flex max-w-100 flex-col gap-4">
    <div>
      <AcSelect v-model="one" :options="options" by="id" label="Cluster" clearable />
      <p class="mt-2 text-xs text-muted">v-model: {{ one }}</p>
    </div>
    <div>
      <AcSelect v-model="many" :options="options" :by="(a, b) => a.id === b.id" label="Clusters" multiple />
      <p class="mt-2 text-xs text-muted">v-model: {{ many.map((c) => c.name) }}</p>
    </div>
  </div>
</template>
