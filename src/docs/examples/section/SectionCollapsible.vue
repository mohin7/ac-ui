<script setup lang="ts">
import { ref } from "vue";
import { AcBadge, AcSectionContent } from "@/lib";

const open = ref(true);
</script>

<template>
  <AcSectionContent v-model:open="open" title="Advanced Settings" collapsible>
    <template #title-extra>
      <AcBadge label="Optional" variant="outlined" rounded />
    </template>
    <p>Resource limits, node selectors and tolerations.</p>
  </AcSectionContent>
</template>
