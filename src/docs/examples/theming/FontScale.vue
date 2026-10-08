<script setup lang="ts">
import { AcButton, AcInput, AcSegmentedControl, AcTag, useFontScale } from "@/lib";

const { scale, preset, setScale } = useFontScale();

const options = [
  { label: "Small", value: "small" },
  { label: "Default", value: "default" },
  { label: "Large", value: "large" },
  { label: "Larger", value: "larger" },
];
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center gap-3">
      <AcSegmentedControl label="Interface scale" :model-value="preset ?? 'default'" :options="options" @update:model-value="setScale($event as never)" />
      <AcTag :label="`${scale}×`" />
    </div>
    <div class="flex flex-col gap-3 rounded-10 border border-border bg-surface p-4">
      <h4>Everything grows together</h4>
      <p class="text-muted">Text, line height, padding, control height and radius all follow one variable.</p>
      <div class="flex items-center gap-2">
        <AcInput label="Search" placeholder="Search…" />
        <AcButton>Save</AcButton>
      </div>
    </div>
  </div>
</template>
