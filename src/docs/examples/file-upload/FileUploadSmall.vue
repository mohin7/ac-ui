<script setup lang="ts">
import { ref } from "vue";
import { AcFileUpload, AcInput } from "@/lib";

const secretName = ref("gcs-credentials");
const keyFile = ref<File[]>([]);
</script>

<template>
  <div class="grid max-w-160 items-end gap-5 sm:grid-cols-2">
    <AcInput v-model="secretName" label="Secret name" />
    <AcFileUpload v-model="keyFile" label="Service account key" accept=".json" :max-size="64 * 1024" small />
  </div>
</template>
