<script setup lang="ts">
import { AcAlert } from "@/lib";
</script>

<template>
  <AcAlert color="danger" title="Connection failed">
    The API server did not respond. Check the kubeconfig and try again.
  </AcAlert>
</template>
