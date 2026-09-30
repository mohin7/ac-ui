<script setup lang="ts">
import { AcButton, useToast } from "@/lib";

const { toast, success } = useToast();

function backUp() {
  // duration 0 keeps it up while the request runs; the same id replaces it with the result.
  const id = toast("Backing up demo-postgres…", { duration: 0, dismissible: false });
  setTimeout(() => success("Backup complete", { id, description: "Snapshot demo-postgres-20260930 (1.2 GiB)." }), 2000);
}
</script>

<template>
  <AcButton title="Back Up Now" @click="backUp" />
</template>
