<script setup lang="ts">
import { AcBanner } from "@/lib";
</script>

<template>
  <div class="overflow-hidden rounded-10 border border-border">
    <AcBanner color="info" title="KubeDB v2026.9.30 is available">Upgrade the operator to get PostgreSQL 17 support.</AcBanner>
    <AcBanner color="warning" title="Scheduled maintenance">The console is read-only on Oct 4, 01:00–02:00 UTC.</AcBanner>
    <AcBanner color="danger" title="License expired">Databases keep running, but you can't create new ones until you renew.</AcBanner>
    <AcBanner color="primary" title="New">Point-in-time recovery is now available for MongoDB.</AcBanner>
    <AcBanner color="neutral" class="border-b-0">You're viewing the <strong>demo</strong> organization as a guest.</AcBanner>
  </div>
</template>
