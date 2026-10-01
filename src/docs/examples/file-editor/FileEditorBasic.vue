<script setup lang="ts">
import { ref } from "vue";
import { AcFileEditor } from "@/lib/editor";

const files = ref([
  {
    name: "demo-postgres.yaml",
    kind: "Postgres",
    description: "demo",
    content: `apiVersion: kubedb.com/v1
kind: Postgres
metadata:
  name: demo-postgres
  namespace: demo
spec:
  version: "16.4"
  replicas: 3
  storageType: Durable
  storage:
    storageClassName: gp3
    resources:
      requests:
        storage: 20Gi
  deletionPolicy: WipeOut
`,
  },
  {
    name: "demo-postgres-auth.yaml",
    kind: "Secret",
    description: "demo",
    content: `apiVersion: v1
kind: Secret
metadata:
  name: demo-postgres-auth
  namespace: demo
type: kubernetes.io/basic-auth
stringData:
  username: postgres
`,
  },
  {
    name: "demo-postgres-backup.yaml",
    kind: "BackupConfiguration",
    description: "demo",
    content: `apiVersion: core.kubestash.com/v1alpha1
kind: BackupConfiguration
metadata:
  name: demo-postgres-backup
  namespace: demo
spec:
  target:
    apiGroup: kubedb.com
    kind: Postgres
    name: demo-postgres
  sessions:
    - name: daily
      scheduler:
        schedule: "0 2 * * *"
      repositories:
        - name: gcs-repo
          backend: gcs-backend
          directory: /demo/postgres
`,
  },
]);
const active = ref("demo-postgres.yaml");
</script>

<template>
  <AcFileEditor v-model:files="files" v-model:active="active" height="420px" />
</template>
