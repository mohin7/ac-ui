<script setup lang="ts">
import { AcCodeEditor } from "@/lib/editor";

const current = JSON.stringify(
  { name: "default", spec: { monitoring: { enabled: true }, backup: { schedule: "0 */6 * * *", retention: "7d" }, tls: { issuer: "letsencrypt" } } },
  null,
  2,
);
const proposed = JSON.stringify(
  { name: "default", spec: { monitoring: { enabled: true, interval: "30s" }, backup: { schedule: "0 */4 * * *", retention: "14d" }, tls: { issuer: "letsencrypt" } } },
  null,
  2,
);
</script>

<template>
  <AcCodeEditor :model-value="proposed" :original="current" language="json" readonly diff-layout="split" title="Preset: default" height="auto" />
</template>
