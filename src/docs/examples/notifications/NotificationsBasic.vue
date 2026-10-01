<script setup lang="ts">
import { ref } from "vue";
import { AcNotificationMenu } from "@/lib";

const MIN = 60_000;
const now = Date.now();
const notifications = ref([
  { id: 1, time: now - 2 * MIN, title: "Backup failed", msg: "demo-postgres · BackupSession demo-postgres-1727 hit the 2h timeout.", status: "Failed", read: false },
  { id: 2, time: now - 9 * MIN, title: "Upgrading orders-mongo", msg: "MongoDB 6.0.12 → 7.0.5 in namespace shop.", status: "Running", read: false },
  { id: 3, time: now - 47 * MIN, title: "Restore complete", msg: "billing-pg restored from snapshot 2026-09-30T02:00Z.", status: "Success", read: false },
  { id: 4, time: now - 5 * 60 * MIN, title: "Certificate expires in 7 days", msg: "demo-cluster · tls/kubedb-webhook", status: "Pending", read: true },
  { id: 5, time: now - 26 * 60 * MIN, title: "prod-gke imported", msg: "3 nodes · europe-west1", status: "Success", read: true },
]);

function markAllRead() {
  notifications.value = notifications.value.map((n) => ({ ...n, read: true }));
}

function markRead(id: string | number) {
  notifications.value = notifications.value.map((n) => (n.id === id ? { ...n, read: true } : n));
}
</script>

<template>
  <div class="flex justify-center">
    <AcNotificationMenu
      :notifications="notifications"
      view-all-href="#/components/notifications"
      align="start"
      @mark-all-read="markAllRead"
      @select="markRead($event.id)"
    />
  </div>
</template>
