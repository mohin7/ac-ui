<script setup lang="ts">
import { computed, ref } from "vue";
import { AcSegmentedControl, AcStatusBar } from "@/lib";

type Connection = "connected" | "reconnecting" | "offline";

const state = ref<Connection>("reconnecting");
const STATES = {
  connected: { label: "Connected", status: "success" },
  reconnecting: { label: "Reconnecting…", status: "pending" },
  offline: { label: "Offline", status: "danger" },
} as const;

const items = computed(() => [
  { ...STATES[state.value], dot: true, priority: "high" as const },
  { label: "Context", value: "kind-kubedb-dev", mono: true },
  { label: "Last sync", value: state.value === "connected" ? "just now" : "2 min ago", align: "right" as const },
]);
</script>

<template>
  <div class="space-y-4">
    <AcSegmentedControl v-model="state" :options="['connected', 'reconnecting', 'offline']" label="Connection" size="small" />
    <div class="overflow-hidden rounded-10 border border-border">
      <AcStatusBar :items="items" />
    </div>
  </div>
</template>
