<script setup lang="ts">
import { ref } from "vue";
import { AcFileUpload } from "@/lib";

const kubeconfig = ref<File[]>([]);
</script>

<template>
  <div class="max-w-120">
    <AcFileUpload v-model="kubeconfig" label="Kubeconfig" accept=".yaml,.yml,.conf" :max-size="1024 * 1024" required />
  </div>
</template>
