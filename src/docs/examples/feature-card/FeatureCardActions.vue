<script setup lang="ts">
import { CircleCheck, DatabaseBackup, RefreshCw, TriangleAlert } from "lucide-vue-next";
import { AcButton, AcFeatureCard, AcTooltip, useToast } from "@/lib";

const { toast } = useToast();
</script>

<template>
  <div class="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-3">
    <AcFeatureCard
      title="Stash 2.0"
      description="aka KubeStash"
      :icon="DatabaseBackup"
      recommended
    >
      <template #title-extra>
        <CircleCheck class="size-4 text-green-30" aria-label="Ready" />
      </template>
      <template #actions>
        <AcTooltip content="Reconcile">
          <AcButton color="white" size="small" aria-label="Reconcile" @click="toast('Reconciling Stash 2.0')">
            <template #icon><RefreshCw /></template>
          </AcButton>
        </AcTooltip>
      </template>
    </AcFeatureCard>

    <AcFeatureCard
      title="Stash Presets"
      description="Preset values for Stash installations."
      :icon="DatabaseBackup"
      required
      recommended
      @click="toast('Open Stash Presets')"
    >
      <template #title-extra>
        <TriangleAlert class="size-4 text-yellow-30" aria-label="Not ready" />
      </template>
      <template #actions>
        <AcButton size="small" @click="toast('Enabled Stash Presets')">Enable</AcButton>
      </template>
    </AcFeatureCard>
  </div>
</template>
