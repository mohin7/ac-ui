<script setup lang="ts">
import { AcButton, AcDivider } from "@/lib";
</script>

<template>
  <div class="mx-auto flex max-w-sm flex-col gap-4">
    <AcButton title="Import an existing cluster" color="white" />
    <AcDivider label="OR" />
    <AcButton title="Create a new cluster" />
    <AcDivider label="Advanced" align="left" class="mt-4" />
    <p class="text-xs text-muted">Termination policy, TLS and monitoring.</p>
  </div>
</template>
