<script setup lang="ts">
import { ref } from "vue";
import { Activity, DatabaseBackup, KeyRound, LayoutDashboard, Settings2, ShieldCheck, TriangleAlert } from "@lucide/vue";
import { AcSideTabs } from "@/lib";

const section = ref("overview");
const items = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "configuration", label: "Configuration", icon: Settings2 },
  { key: "backups", label: "Backups", icon: DatabaseBackup, badge: 12 },
  { key: "monitoring", label: "Monitoring", icon: Activity },
  { key: "tls", label: "TLS", icon: ShieldCheck, badge: "Expiring", badgeColor: "warning" as const },
  { key: "credentials", label: "Credentials", icon: KeyRound },
  { key: "danger", label: "Danger zone", icon: TriangleAlert, tone: "danger" as const },
];
</script>

<template>
  <div class="overflow-hidden rounded-10 border border-border bg-surface-muted">
    <AcSideTabs v-model="section" :items="items" label="Database sections" :sticky="false">
      <template #default="{ active }">
        <div class="p-5">
          <h5>{{ items.find((i) => i.key === active)?.label }}</h5>
          <p class="mt-1 text-base text-muted">
            Settings for <code class="text-code">mongo-prod</code> in namespace <code class="text-code">demo</code>.
          </p>
        </div>
      </template>
    </AcSideTabs>
  </div>
</template>
