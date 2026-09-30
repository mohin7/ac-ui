<script setup lang="ts">
import { AcThemeMode } from "@/lib";
</script>

<template>
  <div class="w-full max-w-110 rounded-10 border border-border bg-surface shadow-xs">
    <div class="flex items-center justify-between gap-4 px-4 py-3.5">
      <div>
        <p class="font-medium text-heading">Appearance</p>
        <p class="text-xs text-muted">System follows your device's setting.</p>
      </div>
      <AcThemeMode display="labels" />
    </div>
  </div>
</template>
