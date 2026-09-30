<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
import { AcButton, AcEmptyState } from "@/lib";
</script>

<template>
  <div class="rounded-10 border border-border bg-surface shadow-xs">
    <AcEmptyState size="large" title="Database not found">
      <template #icon>
        <p class="font-mono text-[56px] leading-none font-semibold tracking-tight text-slate-70">404</p>
      </template>
      <code class="font-mono text-xs text-heading">demo-postgres-old</code> doesn't exist in namespace <code class="font-mono text-xs text-heading">demo</code>. It may have been
      deleted, or the link is out of date.
      <template #actions>
        <AcButton title="Back to databases" href="#/examples/databases">
          <template #icon><ArrowLeft /></template>
        </AcButton>
        <AcButton title="Cluster overview" color="white" href="#/examples/app-shell" />
      </template>
    </AcEmptyState>
  </div>
</template>
