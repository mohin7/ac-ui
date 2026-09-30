<script setup lang="ts">
import { ref } from "vue";
import { AcButton, AcEmptyState, useToast } from "@/lib";

const { success } = useToast();
const requested = ref(false);

function requestAccess() {
  requested.value = true;
  success("Access requested", { description: "The 3 admins of prod-us-east were notified. You'll get an email when they respond." });
}
</script>

<template>
  <div class="rounded-10 border border-border bg-surface shadow-xs">
    <AcEmptyState size="large" title="You don't have access to this cluster">
      <template #icon>
        <p class="font-mono text-[56px] leading-none font-semibold tracking-tight text-slate-70">403</p>
      </template>
      <strong>prod-us-east</strong> belongs to the Platform team. Ask an admin for the Viewer role or higher to see its databases.
      <template #actions>
        <AcButton :title="requested ? 'Request sent' : 'Request access'" :disabled="requested" @click="requestAccess" />
        <AcButton title="Switch cluster" color="white" href="#/examples/app-shell" />
      </template>
    </AcEmptyState>
  </div>
</template>
