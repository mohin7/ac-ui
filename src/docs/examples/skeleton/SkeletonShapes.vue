<script setup lang="ts">
import { AcSkeleton } from "@/lib";
</script>

<template>
  <div class="flex flex-wrap items-center gap-6">
    <AcSkeleton shape="circle" />
    <AcSkeleton shape="circle" height="24px" />
    <AcSkeleton shape="rect" width="160px" height="96px" />
    <AcSkeleton shape="rect" width="120px" height="32px" />
  </div>
</template>
