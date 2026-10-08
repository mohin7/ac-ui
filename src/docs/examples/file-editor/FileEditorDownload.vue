<script setup lang="ts">
import { ref } from "vue";
import { AcFileEditor } from "@/lib/editor";
import { useToast } from "@/lib";

const { toast } = useToast();

const files = ref([
  {
    name: "demo-redis",
    kind: "Redis",
    language: "yaml" as const,
    content: `apiVersion: kubedb.com/v1
kind: Redis
metadata:
  name: demo-redis
  namespace: demo
spec:
  version: "7.4.0"
  mode: Cluster
`,
  },
]);
</script>

<template>
  <AcFileEditor v-model:files="files" height="260px" downloadable @download="(f) => toast(`Downloaded ${f.name}`)" />
</template>
