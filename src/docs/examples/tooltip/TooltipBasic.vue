<script setup lang="ts">
import { AcButton, AcTooltip } from "@/lib";
import { Copy, RotateCw, Terminal, Trash2 } from "lucide-vue-next";
</script>

<template>
  <div class="flex items-center gap-1">
    <AcTooltip content="Copy connection string">
      <AcButton color="ghost" aria-label="Copy connection string">
        <template #icon><Copy /></template>
      </AcButton>
    </AcTooltip>
    <AcTooltip content="Open terminal">
      <AcButton color="ghost" aria-label="Open terminal">
        <template #icon><Terminal /></template>
      </AcButton>
    </AcTooltip>
    <AcTooltip content="Restart pods">
      <AcButton color="ghost" aria-label="Restart pods">
        <template #icon><RotateCw /></template>
      </AcButton>
    </AcTooltip>
    <AcTooltip content="Delete database">
      <AcButton color="ghost" aria-label="Delete database">
        <template #icon><Trash2 /></template>
      </AcButton>
    </AcTooltip>
  </div>
</template>
