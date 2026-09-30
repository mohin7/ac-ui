<script setup lang="ts">
import { ref } from "vue";
import { AcFileUpload } from "@/lib";

const license = ref<File[]>([]);
const bundle = ref<File[]>([]);
</script>

<template>
  <div class="grid max-w-200 gap-6 sm:grid-cols-2">
    <AcFileUpload v-model="license" label="License file" accept=".txt" error-msg="The license has expired. Upload a new one from the AppsCode portal." />
    <AcFileUpload v-model="bundle" label="Backup bundle" description="Restores are paused while a backup runs." disabled />
  </div>
</template>
