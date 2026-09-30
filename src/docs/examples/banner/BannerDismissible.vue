<script setup lang="ts">
import { ref } from "vue";
import { AcBanner, AcButton } from "@/lib";

// Keep this in localStorage or user settings so a dismissed banner stays dismissed.
const open = ref(true);
const reconnecting = ref(false);

function reconnect() {
  reconnecting.value = true;
  setTimeout(() => (reconnecting.value = false), 1200);
}
</script>

<template>
  <div class="grid gap-4">
    <div class="min-h-12 overflow-hidden rounded-10 border border-border">
      <AcBanner v-model:open="open" color="info" dismissible class="border-b-0" action-label="Read the guide" action-href="#/components/banner">
        Connect a Git repository to deploy databases from YAML.
      </AcBanner>
      <p v-if="!open" class="px-4 py-3.5 text-base text-muted">Dismissed.</p>
    </div>
    <div class="overflow-hidden rounded-10 border border-border">
      <AcBanner color="warning" class="border-b-0">
        The terminal session ended.
        <template #action>
          <AcButton title="Reconnect" size="small" color="white" :loading="reconnecting" @click="reconnect" />
        </template>
      </AcBanner>
    </div>
    <div><AcButton v-if="!open" title="Show again" color="white" size="small" @click="open = true" /></div>
  </div>
</template>
