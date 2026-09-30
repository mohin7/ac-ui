<script setup lang="ts">
import { AcCodeEditor } from "@/lib/editor";

const script = `# Connect this cluster to AppsCode
helm upgrade -i opscenter-core oci://ghcr.io/appscode-charts/opscenter-core \\
  --version v2025.9.30 \\
  --namespace kubeops --create-namespace \\
  --set ace-installer.helm.createNamespace=true \\
  --set-file ace-installer.helm.releases.kube-ui-server.values=./kube-ui-server.yaml \\
  --wait --burst-limit=10000 --debug
`;
</script>

<template>
  <AcCodeEditor :model-value="script" language="shell" readonly copyable height="auto" :line-numbers="false" label="Install script" />
</template>
