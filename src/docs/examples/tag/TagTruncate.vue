<script setup lang="ts">
import { AcTag } from "@/lib";
</script>

<template>
  <!-- tags never grow past their container; long text ends in an ellipsis -->
  <div class="flex max-w-60 flex-col items-start gap-1.5">
    <AcTag label="ace-cluster-a-very-long-cluster-name-us-east-1" title="ace-cluster-a-very-long-cluster-name-us-east-1" />
    <AcTag key-label="app.kubernetes.io/managed-by" value-label="kubedb.com" />
  </div>
</template>
