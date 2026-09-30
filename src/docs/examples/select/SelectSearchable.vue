<script setup lang="ts">
import { ref } from "vue";
import { AcSelect } from "@/lib";

const namespace = ref<string | null>("demo");
const options = ["default", "demo", "kube-system", "kubedb", "monitoring", "shop", "search", "stash", "stream", "voyager"].map(
  (ns) => ({ value: ns, label: ns }),
);
</script>

<template>
  <div class="max-w-80">
    <AcSelect v-model="namespace" :options="options" label="Namespace" searchable clearable />
  </div>
</template>
