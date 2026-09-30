<script setup lang="ts">
import { ref } from "vue";
import { AcButton, AcModal } from "@/lib";

const open = ref(false);
const upgrading = ref(false);

async function upgrade() {
  upgrading.value = true;
  await new Promise((r) => setTimeout(r, 2000));
  upgrading.value = false;
  open.value = false;
}
</script>

<template>
  <AcButton title="Upgrade Cluster" color="white" @click="open = true" />

  <AcModal
    v-model:open="open"
    title="Upgrade to Kubernetes 1.30"
    :closable="!upgrading"
    :close-on-outside-click="false"
  >
    <p>Nodes are drained and replaced one at a time. Workloads with a single replica will restart.</p>
    <template #footer>
      <AcButton title="Cancel" color="white" :disabled="upgrading" @click="open = false" />
      <AcButton title="Start Upgrade" :loading="upgrading" @click="upgrade" />
    </template>
  </AcModal>
</template>
