<script setup lang="ts">
import { AcButton, AcContentHeader, AcContentLayout } from "@/lib";
</script>

<template>
  <AcContentLayout>
    <template #header>
      <AcContentHeader title="Connection" subtitle="Use these details to connect from your app">
        <template #icon>
          <svg class="size-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 10 10 6M5 7.5 3.5 9a2.5 2.5 0 0 0 3.5 3.5L8.5 11M11 8.5 12.5 7A2.5 2.5 0 0 0 9 3.5L7.5 5" /></svg>
        </template>
        <AcButton title="Copy URI" color="white" size="small" />
      </AcContentHeader>
    </template>
    <dl class="grid grid-cols-[120px_1fr] gap-y-2 p-5">
      <dt class="text-label">Host</dt>
      <dd class="text-code">demo-postgres.demo.svc</dd>
      <dt class="text-label">Port</dt>
      <dd class="text-code">5432</dd>
      <dt class="text-label">User</dt>
      <dd class="text-code">postgres</dd>
    </dl>
  </AcContentLayout>
</template>
