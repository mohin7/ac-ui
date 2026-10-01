<script setup lang="ts">
import { Activity, DatabaseBackup, KeyRound, ShieldCheck } from "lucide-vue-next";
import { AcFeatureCard, useToast } from "@/lib";

const { toast } = useToast();

const featureSets = [
  { name: "monitoring", title: "Monitoring", description: "Prometheus, Grafana and alert rules for every database in the cluster.", icon: Activity, status: "Enabled", color: "success" as const, required: true },
  { name: "backup", title: "Backup & Recovery", description: "Scheduled backups, point-in-time recovery and restore drills with KubeStash.", icon: DatabaseBackup, status: "Partially enabled", color: "warning" as const },
  { name: "security", title: "Security", description: "TLS certificates, network policies and runtime scanning.", icon: ShieldCheck, status: "Not enabled", color: "default" as const },
  { name: "secrets", title: "Secret Management", description: "Store database credentials in Vault and rotate them automatically.", icon: KeyRound, status: "Failed", color: "danger" as const },
];
</script>

<template>
  <div class="grid grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))] gap-3">
    <AcFeatureCard
      v-for="f in featureSets"
      :key="f.name"
      :title="f.title"
      :description="f.description"
      :icon="f.icon"
      :status="f.status"
      :status-color="f.color"
      :required="f.required"
      @click="toast(`Open ${f.title} settings`)"
    />
  </div>
</template>
