<script setup lang="ts">
import { ref } from "vue";
import { AcFileEditor } from "@/lib/editor";

const files = ref([
  { name: "nginx.conf", kind: "ConfigMap key", content: "server {\n  listen 8080;\n  location / {\n    proxy_pass http://grafana:3000;\n  }\n}\n" },
  { name: "datasources.yaml", kind: "ConfigMap key", content: "apiVersion: 1\ndatasources:\n  - name: Prometheus\n    type: prometheus\n    url: http://prometheus-operated:9090\n" },
  { name: "dashboards.json", kind: "ConfigMap key", content: '{\n  "folder": "KubeDB",\n  "refresh": "30s"\n}\n' },
]);
</script>

<template>
  <!-- Narrower than 672px, the list becomes a select above the editor. -->
  <div class="mx-auto max-w-sm">
    <AcFileEditor v-model:files="files" height="360px" />
  </div>
</template>
