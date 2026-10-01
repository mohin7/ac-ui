<script setup lang="ts">
import { computed, ref } from "vue";
import { ArrowLeft, Send } from "lucide-vue-next";
import { AcButton } from "@/lib";
import { AcFileEditor, type EditorProblem } from "@/lib/editor";

// In an app each schema comes from the resource's CRD: spec.versions[].schema.openAPIV3Schema.
const postgresSchema = {
  type: "object",
  required: ["apiVersion", "kind", "metadata", "spec"],
  properties: {
    spec: {
      type: "object",
      required: ["version", "storage"],
      properties: {
        version: { enum: ["14.13", "15.8", "16.4"] },
        replicas: { type: "integer", minimum: 1, maximum: 9 },
        storage: { type: "object" },
        deletionPolicy: { enum: ["Delete", "Halt", "WipeOut", "DoNotTerminate"] },
      },
    },
  },
};
const opsRequestSchema = {
  type: "object",
  required: ["spec"],
  properties: {
    spec: {
      type: "object",
      required: ["type", "databaseRef"],
      properties: { type: { enum: ["Restart", "VerticalScaling", "HorizontalScaling", "Reconfigure"] } },
    },
  },
};

const files = ref([
  {
    name: "demo-postgres.yaml",
    kind: "Postgres",
    description: "demo",
    schema: postgresSchema,
    content: `apiVersion: kubedb.com/v1
kind: Postgres
metadata:
  name: demo-postgres
  namespace: demo
spec:
  version: "16.4"
  replicas: three
  storage:
    resources:
      requests:
        storage: 20Gi
  deletionPolicy: WipeOut
`,
  },
  {
    name: "demo-postgres-scale.yaml",
    kind: "PostgresOpsRequest",
    description: "demo",
    schema: opsRequestSchema,
    content: `apiVersion: ops.kubedb.com/v1alpha1
kind: PostgresOpsRequest
metadata:
  name: demo-postgres-scale
  namespace: demo
spec:
  type: HorizontalScaling
  databaseRef:
    name: demo-postgres
  horizontalScaling:
    replicas: 3
`,
  },
]);
const problems = ref<Record<string, EditorProblem[]>>({});
const broken = computed(() => Object.values(problems.value).filter((list) => list.length).length);
</script>

<template>
  <div class="flex flex-col gap-4">
    <AcFileEditor v-model:files="files" format-switch height="400px" @validate="problems = $event" />
    <div class="flex flex-wrap items-center justify-between gap-3">
      <AcButton title="Previous" color="white">
        <template #icon><ArrowLeft /></template>
      </AcButton>
      <div class="flex items-center gap-3">
        <span class="text-xs text-muted">{{ broken ? `Fix ${broken === 1 ? "1 file" : `${broken} files`} to deploy` : "Ready to deploy" }}</span>
        <AcButton title="Deploy" :disabled="broken > 0">
          <template #icon><Send /></template>
        </AcButton>
      </div>
    </div>
  </div>
</template>
