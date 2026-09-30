<script setup lang="ts">
import { AcTag } from "@/lib";

const labels = {
  "app.kubernetes.io/name": "postgreses.kubedb.com",
  "app.kubernetes.io/instance": "demo-postgres",
  "kubedb.com/role": "primary",
  env: "prod",
};
</script>

<template>
  <div class="flex flex-wrap items-center gap-1.5">
    <AcTag v-for="(value, key) in labels" :key="key" :key-label="key" :value-label="value" />
    <AcTag key-label="env" value-label="prod" color="danger" removable />
  </div>
</template>
