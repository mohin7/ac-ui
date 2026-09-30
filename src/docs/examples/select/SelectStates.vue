<script setup lang="ts">
import { ref } from "vue";
import { AcSelect } from "@/lib";

const options = [
  { value: "standard", label: "standard" },
  { value: "gp3", label: "gp3" },
];
const storageClass = ref<string | null>(null);
const loading = ref(false);

function refresh() {
  loading.value = true;
  setTimeout(() => (loading.value = false), 1200);
}
</script>

<template>
  <div class="grid max-w-160 gap-5 sm:grid-cols-2">
    <AcSelect v-model="storageClass" :options="options" label="Storage Class" refreshable :loading="loading" @refresh="refresh" />
    <AcSelect v-model="storageClass" :options="options" label="Storage Class" required error-msg="Select a storage class." />
    <AcSelect :model-value="'gp3'" :options="options" label="Managed by Operator" disabled />
    <AcSelect v-model="storageClass" :options="options" label="With Hint" hint="Volumes are created from this class." size="normal" />
  </div>
</template>
