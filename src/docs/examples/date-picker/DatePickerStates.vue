<script setup lang="ts">
import { ref } from "vue";
import { AcDatePicker } from "@/lib";

const snapshot = ref<string | null>(null);
const created = ref("2026-08-14T09:30:00Z");
const schedule = ref<string | null>("2026-10-04");
</script>

<template>
  <div class="grid max-w-80 gap-5">
    <AcDatePicker v-model="snapshot" label="Snapshot Date" required error-msg="Choose the snapshot to restore from." />
    <AcDatePicker v-model="created" label="Created" mode="datetime" disabled />
    <AcDatePicker v-model="schedule" label="First Run" size="normal" clearable />
  </div>
</template>
