<script setup lang="ts">
import { AcAvatar } from "@/lib";
</script>

<template>
  <div class="flex flex-wrap items-center gap-8">
    <div class="flex items-center gap-3">
      <AcAvatar name="Nadia Islam" size="large" />
      <AcAvatar name="Arif Chowdhury" size="large" />
      <span class="text-xs text-muted">circle · people</span>
    </div>
    <div class="flex items-center gap-3">
      <AcAvatar name="KubeDB" img-url="https://github.com/kubedb.png" shape="square" size="large" />
      <AcAvatar name="Platform Team" shape="square" size="large" />
      <span class="text-xs text-muted">square · organisations and teams</span>
    </div>
  </div>
</template>
