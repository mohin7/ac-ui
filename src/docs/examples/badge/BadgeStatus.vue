<script setup lang="ts">
import { AcBadge } from "@/lib";
</script>

<template>
  <AcBadge label="Ready" color="success" variant="light" rounded dot />
  <AcBadge label="Provisioning" color="info" variant="light" rounded dot />
  <AcBadge label="Halted" color="warning" variant="light" rounded dot />
  <AcBadge label="Critical" color="danger" variant="light" rounded dot />
</template>
