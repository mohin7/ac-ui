<script setup lang="ts">
import { AcAlert } from "@/lib";
</script>

<template>
  <div class="space-y-2">
    <AcAlert color="info">Your cluster is being imported. This can take a few minutes.</AcAlert>
    <AcAlert color="success">Database demo-postgres is ready.</AcAlert>
    <AcAlert color="warning">You have used 90% of your monthly quota.</AcAlert>
    <AcAlert color="danger">Failed to connect to the cluster.</AcAlert>
    <AcAlert color="primary">A new KubeDB version is available.</AcAlert>
    <AcAlert color="neutral">Read-only mode is on for this workspace.</AcAlert>
  </div>
</template>
