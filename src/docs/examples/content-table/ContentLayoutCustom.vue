<script setup lang="ts">
import { Link } from "@lucide/vue";
import { AcButton, AcContentHeader, AcContentLayout } from "@/lib";
</script>

<template>
  <AcContentLayout>
    <template #header>
      <AcContentHeader title="Connection" subtitle="Use these details to connect from your app">
        <template #icon>
          <Link class="size-4" />
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
