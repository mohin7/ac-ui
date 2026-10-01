<script setup lang="ts">
import { ref } from "vue";
import { AcDatePicker } from "@/lib";

// The archiver can restore anywhere between its oldest base backup and the last shipped WAL file.
const now = Date.now();
const earliest = new Date(now - 3 * 86400000).toISOString();
const latest = new Date(now - 5 * 60000).toISOString();
const recoveryTimestamp = ref<string | null>(null);
</script>

<template>
  <div class="max-w-80 space-y-2">
    <AcDatePicker
      v-model="recoveryTimestamp"
      label="Recovery Timestamp"
      mode="datetime"
      time-zone="UTC"
      show-seconds
      :min-date="earliest"
      :max-date="latest"
      hint="Point-in-time recovery for postgres-prod. Times are in UTC."
    />
    <p class="text-xs text-muted">spec.init.archiver.recoveryTimestamp: <code class="prose-code">{{ recoveryTimestamp ?? "—" }}</code></p>
  </div>
</template>
