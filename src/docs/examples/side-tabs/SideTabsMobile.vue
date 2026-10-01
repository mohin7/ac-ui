<script setup lang="ts">
import { ref } from "vue";
import { AcSideTabs } from "@/lib";

const viaSelect = ref("backups");
const viaScroll = ref("backups");
const items = [
  { key: "overview", label: "Overview", group: "Database" },
  { key: "configuration", label: "Configuration", group: "Database" },
  { key: "backups", label: "Backups", badge: 12, group: "Database" },
  { key: "monitoring", label: "Monitoring", group: "Operations" },
  { key: "tls", label: "TLS", group: "Operations" },
  { key: "danger", label: "Danger zone", tone: "danger" as const, group: "Operations" },
];
</script>

<template>
  <!-- Phone-sized frames: under `breakpoint` (640px) the list turns into a select or a scrolling row. -->
  <div class="grid gap-6 md:grid-cols-2">
    <div class="mx-auto w-full max-w-[375px] overflow-hidden rounded-16 border border-border bg-surface-muted shadow-md">
      <AcSideTabs v-model="viaSelect" :items="items" label="Section">
        <p class="p-4 text-base text-muted">mobile="select" · {{ viaSelect }}</p>
      </AcSideTabs>
    </div>
    <div class="mx-auto w-full max-w-[375px] overflow-hidden rounded-16 border border-border bg-surface-muted shadow-md">
      <AcSideTabs v-model="viaScroll" :items="items" label="Section" mobile="scroll">
        <p class="p-4 text-base text-muted">mobile="scroll" · {{ viaScroll }}</p>
      </AcSideTabs>
    </div>
  </div>
</template>
