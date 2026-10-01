<script setup lang="ts">
import { ref, watch } from "vue";
import { AcButton, AcNotificationMenu } from "@/lib";

const STATUSES = ["Started", "Running", "Success", "Failed"];
const notifications = ref<{ id: number; time: number; msg: string; status: string; read: boolean }[]>([]);
const unread = ref(0);
const open = ref(false);

// The NATS payload is { msg, status }. The bell clears when the panel opens; the dots clear when it closes.
function receive() {
  const status = STATUSES[notifications.value.length % STATUSES.length]!;
  const time = Date.now();
  notifications.value.unshift({ id: time, time, msg: `Ops request scale-demo-postgres: ${status.toLowerCase()}`, status, read: open.value });
  if (!open.value) unread.value++;
}

watch(open, (v) => {
  if (v) unread.value = 0;
  else notifications.value = notifications.value.map((n) => ({ ...n, read: true }));
});
</script>

<template>
  <div class="flex items-center justify-center gap-3">
    <AcButton title="Simulate event" color="white" size="small" @click="receive" />
    <AcNotificationMenu v-model:open="open" :notifications="notifications" :unread-count="unread" align="start" />
  </div>
</template>
