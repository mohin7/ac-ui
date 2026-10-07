<script setup lang="ts">
import { computed, ref } from "vue";
import { Braces } from "@lucide/vue";
import { AcButton, AcModal } from "@/lib";
import { AcCodeEditor } from "@/lib/editor";

const open = ref(false);
const status = {
  phase: "Ready",
  observedGeneration: 4,
  conditions: [
    { type: "ProvisioningStarted", status: "True", lastTransitionTime: "2026-09-28T10:12:03Z" },
    { type: "ReplicaReady", status: "True", lastTransitionTime: "2026-09-28T10:14:41Z" },
    { type: "AcceptingConnection", status: "True", lastTransitionTime: "2026-09-28T10:14:52Z" },
  ],
};
const json = computed(() => JSON.stringify(status, null, 2));
</script>

<template>
  <AcButton title="View status" color="white" @click="open = true">
    <template #icon><Braces /></template>
  </AcButton>
  <AcModal v-model:open="open" title="demo-postgres status" size="medium" hide-footer>
    <AcCodeEditor :model-value="json" language="json" readonly copyable height="auto" max-height="60vh" label="Status" />
  </AcModal>
</template>
