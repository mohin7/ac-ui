<script setup lang="ts">
import { AcButton, AcTooltip } from "@/lib";

const placements = ["top", "right", "bottom", "left"] as const;
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-3">
    <AcTooltip v-for="p in placements" :key="p" :content="`Tooltip on the ${p}`" :placement="p">
      <AcButton :title="p" color="white" />
    </AcTooltip>
  </div>
</template>
