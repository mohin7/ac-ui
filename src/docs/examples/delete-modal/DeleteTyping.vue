<script setup lang="ts">
import { ref } from "vue";
import { AcButton, AcDeleteModal } from "@/lib";

const open = ref(false);
const deleting = ref(false);

async function remove() {
  deleting.value = true;
  await new Promise((r) => setTimeout(r, 1500));
  deleting.value = false;
  open.value = false;
}
</script>

<template>
  <AcButton title="Delete Database" color="danger" @click="open = true" />

  <AcDeleteModal
    v-model:open="open"
    title="Delete Database"
    item-name="demo-postgres"
    detail="All data and volumes are removed. Stash backups are kept for 7 days."
    confirm-text="Delete Database"
    confirm-by-typing
    :loading="deleting"
    @confirm="remove"
  />
</template>
