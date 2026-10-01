<script setup lang="ts">
import { AcCellValue } from "@/lib";

const image = "ghcr.io/appscode-images/postgres:16.1-bookworm@sha256:8a1f0c2e5b7d9a3c4e6f8b0d2a4c6e8f0b2d4a6c8e0f2b4d6a8c0e2f4b6d8a0c";
</script>

<template>
  <div class="space-y-3 text-base">
    <div class="flex items-center gap-4">
      <span class="w-28 shrink-0 text-muted">Image</span>
      <AcCellValue :value="image" mono max-width="320px" />
    </div>
    <div class="flex items-center gap-4">
      <span class="w-28 shrink-0 text-muted">Message</span>
      <AcCellValue value="Back-off restarting failed container postgres in pod pg-orders-0_demo" max-width="240px" />
    </div>
    <div class="flex items-center gap-4">
      <span class="w-28 shrink-0 text-muted">Owner</span>
      <AcCellValue value="kubedb-operator" tooltip="Managed by the KubeDB operator in kubedb namespace" />
    </div>
  </div>
</template>
