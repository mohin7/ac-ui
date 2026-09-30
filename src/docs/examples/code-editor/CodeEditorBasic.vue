<script setup lang="ts">
import { ref } from "vue";
import { AcCodeEditor } from "@/lib/editor";

const values = ref(`# Values for the kubedb-postgres chart
replicas: 3
version: "16.4"
storage:
  storageClassName: gp3
  size: 20Gi
monitoring:
  agent: prometheus.io/operator
  serviceMonitor:
    interval: 30s
`);
</script>

<template>
  <AcCodeEditor v-model="values" title="values.yaml" height="280px" copyable />
</template>
