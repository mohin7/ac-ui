<script setup lang="ts">
import { AcStatCard } from "@/lib";
</script>

<template>
  <div class="grid max-w-xl gap-3 sm:grid-cols-2">
    <AcStatCard label="Databases" value="24" />
    <AcStatCard label="Backup storage" value="184" suffix="GiB" />
  </div>
</template>
