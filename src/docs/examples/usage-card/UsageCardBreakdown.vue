<script setup lang="ts">
import { HardDrive } from "@lucide/vue";
import { AcButton, AcUsageCard } from "@/lib";
</script>

<template>
  <AcUsageCard
    class="max-w-lg"
    title="Backup storage"
    description="Repository ace-dr-backups on S3"
    :icon="HardDrive"
    :used="184"
    :limit="250"
    unit="GiB"
    :breakdown-headers="['Database', 'Snapshots', 'Size (GiB)']"
    :breakdown="[
      { label: 'demo-postgres', values: [42, 96.4] },
      { label: 'orders-mongo', values: [30, 61.2] },
      { label: 'cache-redis', values: [48, 18.9] },
      { label: 'Other', values: [12, 7.5] },
    ]"
  >
    <template #actions>
      <AcButton title="Add storage" size="small" color="white" />
    </template>
    <template #footer>
      <span>Retention: 30 daily, 14 weekly, 6 monthly</span>
    </template>
  </AcUsageCard>
</template>
