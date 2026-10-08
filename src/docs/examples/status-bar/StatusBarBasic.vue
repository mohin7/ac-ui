<script setup lang="ts">
import { Cpu, HardDrive, MemoryStick, RefreshCw, SquareTerminal } from "@lucide/vue";
import { AcBadge, AcStatusBar, useToast } from "@/lib";

const toast = useToast();

const items = [
  { label: "Connected", status: "success" as const, dot: true, priority: "high" as const },
  { label: "Cluster", value: "prod-us-east-1", mono: true, priority: "high" as const },
  { label: "MongoDB", value: "demo/mg-rs", mono: true },
  { label: "Version", value: "6.0.12", mono: true, priority: "low" as const },
  { label: "Age", value: "3d", priority: "low" as const },
  { label: "CPU", icon: Cpu, value: "420m / 1", meter: 42, align: "right" as const, priority: "low" as const },
  { label: "Memory", icon: MemoryStick, value: "1.6Gi / 2Gi", meter: 80, align: "right" as const, priority: "low" as const },
  { label: "Storage", icon: HardDrive, value: "18Gi / 20Gi", meter: 91, align: "right" as const, priority: "low" as const },
  { label: "TLS", status: "success" as const, align: "right" as const },
  { label: "Backup", status: "warning" as const, align: "right" as const },
  {
    label: "Open terminal",
    icon: SquareTerminal,
    iconOnly: true,
    align: "right" as const,
    priority: "high" as const,
    onClick: () => toast.info("Opening a shell in mg-rs-0"),
  },
  { label: "Refresh", icon: RefreshCw, iconOnly: true, align: "right" as const, onClick: () => toast.info("Refreshed") },
];
</script>

<template>
  <div class="overflow-hidden rounded-10 border border-border">
    <div class="h-32 bg-surface p-5 text-base text-muted">Database detail page</div>
    <AcStatusBar :items="items" label="mg-rs status">
      <template #right>
        <AcBadge label="Ready" color="success" variant="light" dot rounded class="ml-1" />
      </template>
    </AcStatusBar>
  </div>
</template>
