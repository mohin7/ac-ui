<script setup lang="ts">
import { ref } from "vue";
import { AcButton } from "@/lib";
import { AcCodeEditor, type EditorProblem } from "@/lib/editor";

// In an app this comes from the CRD's spec.versions[].schema.openAPIV3Schema.
const schema = {
  type: "object",
  required: ["apiVersion", "kind", "metadata", "spec"],
  properties: {
    apiVersion: { const: "kubedb.com/v1" },
    kind: { const: "Postgres" },
    metadata: { type: "object", required: ["name"], properties: { name: { type: "string" }, namespace: { type: "string" } } },
    spec: {
      type: "object",
      required: ["version", "storage"],
      additionalProperties: false,
      properties: {
        version: { enum: ["14.13", "15.8", "16.4"] },
        replicas: { type: "integer", minimum: 1, maximum: 9 },
        storageType: { enum: ["Durable", "Ephemeral"] },
        storage: { type: "object" },
        deletionPolicy: { enum: ["Delete", "Halt", "WipeOut", "DoNotTerminate"] },
      },
    },
  },
};

const manifest = ref(`apiVersion: kubedb.com/v1
kind: Postgres
metadata:
  name: demo-postgres
  namespace: demo
spec:
  version: "16.4"
  replicas: three
  storageType: Durable
  storage:
    resources:
      requests:
        storage: 10Gi
  deletionPolicy: Wipeout
`);
const problems = ref<EditorProblem[]>([]);
</script>

<template>
  <div class="flex flex-col gap-3">
    <AcCodeEditor v-model="manifest" title="postgres.yaml" :schema="schema" height="300px" @validate="problems = $event" />
    <div class="flex items-center justify-end gap-3">
      <span class="text-xs text-muted">{{ problems.length ? "Fix the problems above to apply" : "Valid" }}</span>
      <AcButton title="Apply" :disabled="problems.length > 0" />
    </div>
  </div>
</template>
