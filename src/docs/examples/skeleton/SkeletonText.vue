<script setup lang="ts">
import { AcSkeleton } from "@/lib";
</script>

<template>
  <div class="grid max-w-md gap-8">
    <AcSkeleton />
    <AcSkeleton :lines="2" />
    <AcSkeleton :lines="4" height="14px" />
  </div>
</template>
