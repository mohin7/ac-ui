<script setup lang="ts">
import { ref } from "vue";
import { AcAlert, AcButton, AcModal } from "@/lib";

// The old StatusModal's `statusArray`: one message per condition.
const statuses = [
  { type: "success" as const, message: "Restore session restore-pg-orders finished in 2m 14s." },
  { type: "warning" as const, message: "Replica pg-orders-2 is still catching up with the primary." },
  { type: "danger" as const, message: "Volume snapshot snap-0b1e failed: the snapshot class gp3-csi was not found." },
];
const open = ref(false);
</script>

<template>
  <AcButton title="View Status" color="white" @click="open = true" />

  <AcModal v-model:open="open" title="Status" size="medium" :close-on-outside-click="false">
    <div class="space-y-3">
      <AcAlert v-for="(status, i) in statuses" :key="i" :color="status.type">{{ status.message }}</AcAlert>
    </div>
    <template #footer>
      <AcButton title="Close" color="white" @click="open = false" />
    </template>
  </AcModal>
</template>
