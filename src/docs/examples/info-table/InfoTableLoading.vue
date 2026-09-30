<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { AcButton, AcInfoTable } from "@/lib";

const items = ref<{ label: string; value?: string }[]>([]);
const loading = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

function load() {
  loading.value = true;
  items.value = [];
  timer = setTimeout(() => {
    items.value = [
      { label: "Node", value: "ip-10-0-12-34.ec2.internal" },
      { label: "Instance type", value: "m6i.xlarge" },
      { label: "Zone", value: "us-east-1b" },
      { label: "Kubelet", value: "v1.30.4-eks" },
    ];
    loading.value = false;
  }, 1500);
}

load();
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <div class="grid max-w-200 gap-5 md:grid-cols-2">
    <AcInfoTable :items="items" :loading="loading" title="Node">
      <template #actions><AcButton title="Reload" color="white" size="small" :disabled="loading" @click="load" /></template>
    </AcInfoTable>
    <AcInfoTable title="Annotations" empty-text="No annotations on this resource." />
  </div>
</template>
