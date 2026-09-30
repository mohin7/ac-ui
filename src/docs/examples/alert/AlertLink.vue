<script setup lang="ts">
import { AcAlert } from "@/lib";
</script>

<template>
  <AcAlert color="warning">
    cache-redis has 1 replica and no recent backup. <a href="#/components/alert">Configure Stash</a>
  </AcAlert>
</template>
