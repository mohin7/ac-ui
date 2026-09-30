<script setup lang="ts">
import { AcSectionContent } from "@/lib";

// In an app: const router = useRouter(); router.back()
function goBack() {}
</script>

<template>
  <AcSectionContent title="Edit Resource Limits" back-button @back="goBack">
    <p>Change CPU and memory for each replica.</p>
  </AcSectionContent>
</template>
