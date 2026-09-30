<script setup lang="ts">
import { AcTag } from "@/lib";
</script>

<template>
  <div class="flex flex-wrap items-center gap-1.5">
    <AcTag label="postgres" />
    <AcTag label="us-east-1" />
    <AcTag label="production" color="danger" />
    <AcTag label="staging" color="warning" />
    <AcTag label="dev" color="info" />
    <AcTag label="managed" color="success" />
    <AcTag label="rancher" color="primary" rounded />
  </div>
</template>
