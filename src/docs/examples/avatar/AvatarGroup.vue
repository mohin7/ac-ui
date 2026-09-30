<script setup lang="ts">
import { AcAvatar } from "@/lib";

const members = ["Nadia Islam", "Arif Chowdhury", "Samira Khan", "Rafiul Hasan", "Tanvir Ahmed", "Mehnaz Rahman", "Imran Kabir"];
const shown = 4;
</script>

<template>
  <div class="flex flex-wrap items-center gap-10">
    <!-- the wrapper overlaps the avatars and draws a surface-coloured ring between them -->
    <div class="flex -space-x-2 *:ring-2 *:ring-surface" role="group" aria-label="Members of platform-team">
      <AcAvatar v-for="m in members.slice(0, shown)" :key="m" :name="m" />
      <AcAvatar :overflow-count="members.length - shown" />
    </div>
    <div class="flex -space-x-1.5 *:ring-2 *:ring-surface" role="group" aria-label="Reviewers">
      <AcAvatar v-for="m in members.slice(0, 3)" :key="m" :name="m" size="small" />
      <AcAvatar :overflow-count="12" size="small" />
    </div>
  </div>
</template>
