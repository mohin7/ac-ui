<script setup lang="ts">
import { AcBanner } from "@/lib";
</script>

<template>
  <div class="overflow-hidden rounded-10 border border-border">
    <AcBanner color="primary" variant="solid" action-label="See what's new" action-href="#/components/banner">
      AppsCode Platform 2026.10 is out, with a new backup dashboard.
    </AcBanner>
    <AcBanner color="warning" variant="solid" title="Trial ends in 3 days" action-label="Choose a plan" action-href="#/components/banner" />
    <AcBanner color="danger" variant="solid" action-label="Retry" class="border-b-0">
      Lost connection to cluster <strong>prod-eks-us-east</strong>.
    </AcBanner>
  </div>
</template>
