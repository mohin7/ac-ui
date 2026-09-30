<script setup lang="ts">
import { ref } from "vue";
import { AcTextarea } from "@/lib";

const values = ref(`# Helm values for kubedb-postgres
replicas: 3
storage:
  storageClassName: gp3
  size: 20Gi`);
</script>

<template>
  <div class="max-w-120">
    <AcTextarea
      v-model="values"
      label="Custom values (YAML)"
      :rows="3"
      :max-rows="12"
      auto-resize
      mono
      hint="Grows as you type, up to 12 lines, then scrolls."
    />
  </div>
</template>
