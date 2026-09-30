<script setup lang="ts">
import { AcButton, AcSectionContent } from "@/lib";
</script>

<template>
  <AcSectionContent title="Backup Configuration" subtitle="Stash · every 6 hours">
    <template #actions>
      <AcButton title="Edit" color="white" size="small" />
    </template>
    <p>Last backup completed 2 hours ago. Next run at 18:00 UTC.</p>
  </AcSectionContent>
</template>
