<script setup lang="ts">
import { AcFileEditor } from "@/lib/editor";

// The rendered templates of a Helm release: read-only, and enough of them that the list gets a search box.
const resources = [
  ["serviceaccount.yaml", "ServiceAccount", "kubedb-operator"],
  ["cluster-role.yaml", "ClusterRole", "kubedb-operator"],
  ["cluster-role-binding.yaml", "ClusterRoleBinding", "kubedb-operator"],
  ["service.yaml", "Service", "kubedb-operator"],
  ["webhook-service.yaml", "Service", "kubedb-operator-webhook"],
  ["deployment.yaml", "Deployment", "kubedb-operator"],
  ["webhook-deployment.yaml", "Deployment", "kubedb-webhook-server"],
  ["configmap.yaml", "ConfigMap", "kubedb-operator-config"],
  ["apiserver-cert.yaml", "Secret", "kubedb-operator-apiserver-cert"],
  ["apiservice.yaml", "APIService", "v1alpha1.validators.kubedb.com"],
  ["mutating-webhook.yaml", "MutatingWebhookConfiguration", "mutators.kubedb.com"],
  ["validating-webhook.yaml", "ValidatingWebhookConfiguration", "validators.kubedb.com"],
  ["pdb.yaml", "PodDisruptionBudget", "kubedb-operator"],
  ["servicemonitor.yaml", "ServiceMonitor", "kubedb-operator"],
];

const files = resources.map(([file, kind, name]) => ({
  name: file!,
  kind,
  description: name,
  content: `apiVersion: v1
kind: ${kind}
metadata:
  name: ${name}
  namespace: kubedb
  labels:
    app.kubernetes.io/instance: kubedb
    app.kubernetes.io/managed-by: Helm
    helm.sh/chart: kubedb-operator-v2025.9.30
`,
}));
</script>

<template>
  <AcFileEditor :files="files" readonly label="Templates" height="440px" />
</template>
