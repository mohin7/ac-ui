<script setup lang="ts">
import { BookOpen, LifeBuoy } from "@lucide/vue";
import { AcBadge, AcFeatureCard } from "@/lib";
</script>

<template>
  <div class="grid gap-3 sm:grid-cols-2">
    <AcFeatureCard
      title="KubeDB documentation"
      description="Guides for provisioning, scaling and upgrading every supported database."
      :icon="BookOpen"
      href="https://kubedb.com/docs/"
      target="_blank"
    >
      <template #footer>
        <span>kubedb.com/docs</span>
        <AcBadge label="v2026.9.30" variant="light" rounded />
      </template>
    </AcFeatureCard>
    <AcFeatureCard
      title="Contact support"
      description="Open a ticket with the AppsCode team. Enterprise plans get a 4-hour response."
      :icon="LifeBuoy"
      href="https://appscode.com/contact/"
      target="_blank"
    />
  </div>
</template>
