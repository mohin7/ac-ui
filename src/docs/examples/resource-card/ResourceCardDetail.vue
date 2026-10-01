<script setup lang="ts">
import { Archive, Play, ShieldCheck } from "lucide-vue-next";
import { AcBadge, AcButton, AcResourceCard } from "@/lib";
</script>

<template>
  <div class="grid gap-3 lg:grid-cols-2">
    <AcResourceCard
      name="Backup storage"
      subtitle="Where KubeStash writes snapshots"
      :icon="Archive"
      status="Reachable"
      status-color="success"
      :details="[
        { label: 'Provider', value: 'S3 · us-east-1' },
        { label: 'Bucket', value: 'ace-dr-backups', mono: true },
        { label: 'Encryption', value: 'SSE-KMS' },
        { label: 'Retention', value: '30 / 14d / 6m' },
        { label: 'Used storage', value: '184 GiB' },
        { label: 'Off-site copy', value: 'GCS', key: 'offsite' },
      ]"
    >
      <template #detail-offsite="{ detail }">
        {{ detail.value }} <span class="font-mono text-xs font-normal text-green-30">11m lag</span>
      </template>
    </AcResourceCard>

    <AcResourceCard
      name="Disaster drill"
      subtitle="Monthly, every 4th Sunday at 02:00"
      :icon="ShieldCheck"
      :details="[
        { label: 'Scenario', value: 'Isolated namespace clone' },
        { label: 'Last result', key: 'last' },
        { label: 'Duration', value: '4m 12s', mono: true },
        { label: 'Next drill', value: '2026-10-25 02:00', mono: true },
      ]"
    >
      <template #actions>
        <AcButton title="Run drill" size="small" color="white">
          <template #icon><Play aria-hidden="true" /></template>
        </AcButton>
      </template>
      <template #detail-last>
        <AcBadge label="Passed" color="success" variant="light" rounded dot />
      </template>
      <template #footer>
        <span>SOC 2 Type II and ISO 27001 audit ready</span>
        <a href="https://appscode.com" class="font-medium text-heading underline underline-offset-2">Export audit packet</a>
      </template>
    </AcResourceCard>
  </div>
</template>
