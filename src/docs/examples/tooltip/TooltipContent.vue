<script setup lang="ts">
import { AcTooltip } from "@/lib";
import { CircleHelp } from "lucide-vue-next";
</script>

<template>
  <div class="flex flex-wrap items-center gap-8 text-base">
    <span class="inline-flex items-center gap-1.5 text-label">
      Storage class
      <AcTooltip placement="right">
        <button type="button" class="inline-flex cursor-help rounded-full text-muted hover:text-heading" aria-label="About storage classes">
          <CircleHelp class="size-3.5" aria-hidden="true" />
        </button>
        <template #content>
          Sets the disk type for each replica.<br />
          <span class="opacity-75">Can't be changed after creation.</span>
        </template>
      </AcTooltip>
    </span>

    <AcTooltip content="appscode-kubedb-demo-postgres-primary-0.demo.svc.cluster.local">
      <span tabindex="0" class="block max-w-48 truncate rounded-4 font-mono text-xs text-heading">
        appscode-kubedb-demo-postgres-primary-0.demo.svc.cluster.local
      </span>
    </AcTooltip>
  </div>
</template>
