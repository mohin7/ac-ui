<script setup lang="ts">
import { ref } from "vue";
import { AcAccordionItem, AcInput } from "@/lib";

const additionalConfig = ref(false);
const maxConnections = ref("200");
const sharedBuffers = ref("256MB");
</script>

<template>
  <!-- One item on its own, like the old <Accordion :is-active @on-click>. -->
  <AcAccordionItem v-model:open="additionalConfig" title="Additional config" description="Optional postgresql.conf overrides" class="max-w-160">
    <div class="grid gap-4 pt-1 sm:grid-cols-2">
      <AcInput v-model="maxConnections" label="max_connections" type="number" />
      <AcInput v-model="sharedBuffers" label="shared_buffers" />
    </div>
  </AcAccordionItem>
</template>
