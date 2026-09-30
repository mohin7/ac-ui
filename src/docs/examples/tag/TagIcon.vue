<script setup lang="ts">
import { Cloud, Database, Server } from "lucide-vue-next";
import { AcTag } from "@/lib";
</script>

<template>
  <div class="flex flex-wrap items-center gap-1.5">
    <AcTag label="Postgres">
      <template #icon><Database /></template>
    </AcTag>
    <AcTag label="AWS" color="warning">
      <template #icon><Cloud /></template>
    </AcTag>
    <AcTag key-label="node" value-label="ip-10-0-1-24">
      <template #icon><Server /></template>
    </AcTag>
  </div>
</template>
