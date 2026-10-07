<script setup lang="ts">
import { ref } from "vue";
import { RotateCcw } from "@lucide/vue";
import { AcButton, AcSegmentedControl } from "@/lib";
import { AcCodeEditor } from "@/lib/editor";

const saved = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: billing-api
  namespace: billing
spec:
  replicas: 2
  selector:
    matchLabels:
      app: billing-api
  template:
    metadata:
      labels:
        app: billing-api
    spec:
      containers:
        - name: api
          image: ghcr.io/appscode/billing-api:v1.8.2
          ports:
            - containerPort: 8080
          resources:
            limits:
              memory: 256Mi
`;
const definition = ref(
  saved.replace("replicas: 2", "replicas: 4").replace("v1.8.2", "v1.9.0").replace("memory: 256Mi", "memory: 512Mi\n              cpu: 500m"),
);
const view = ref<"edit" | "changes">("changes");
const layout = ref<"unified" | "split">("unified");
</script>

<template>
  <AcCodeEditor v-model="definition" v-model:view="view" :original="saved" :diff-layout="layout" title="billing-api.yaml" height="340px">
    <template #actions>
      <AcSegmentedControl v-if="view === 'changes'" v-model="layout" :options="['unified', 'split']" size="small" label="Diff layout" />
      <AcButton title="Reset" size="small" color="white" :disabled="definition === saved" @click="definition = saved">
        <template #icon><RotateCcw /></template>
      </AcButton>
    </template>
  </AcCodeEditor>
</template>
