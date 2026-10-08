<script setup lang="ts">
import { ref } from "vue";
import { RotateCcw } from "@lucide/vue";
import { AcButton } from "@/lib";
import { AcFileEditor } from "@/lib/editor";

const values = `replicas: 2
version: "16.4"
storage:
  size: 20Gi
monitoring:
  agent: prometheus.io/operator
`;
const tls = `issuerRef:
  apiGroup: cert-manager.io
  kind: ClusterIssuer
  name: letsencrypt-prod
certificates:
  - alias: server
    dnsNames:
      - pg.demo.svc
`;
const backup = `schedule: "0 */6 * * *"
retention:
  keepLast: 7
`;

const files = ref([
  { name: "values.yaml", kind: "Helm values", original: values, content: values.replace("replicas: 2", "replicas: 3").replace("20Gi", "50Gi") },
  { name: "tls.yaml", kind: "TLS", original: tls, content: tls },
  { name: "backup.yaml", kind: "Backup", original: backup, content: backup.replace("keepLast: 7", "keepLast: 14") },
]);
const view = ref<"edit" | "changes">("changes");

function reset(name: string) {
  files.value = files.value.map((f) => (f.name === name ? { ...f, content: f.original } : f));
}
</script>

<template>
  <AcFileEditor v-model:files="files" v-model:view="view" height="380px">
    <template #actions="{ file }">
      <AcButton title="Reset" size="small" color="white" :disabled="file.content === file.original" @click="reset(file.name)">
        <template #icon><RotateCcw /></template>
      </AcButton>
    </template>
  </AcFileEditor>
</template>
