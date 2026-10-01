<script setup lang="ts">
import { AcNotificationMenu } from "@/lib";
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-8">
    <div class="flex items-center gap-2 text-xs text-muted">
      <AcNotificationMenu align="start" />
      Empty
    </div>
    <div class="flex items-center gap-2 text-xs text-muted">
      <AcNotificationMenu loading align="start" />
      Loading
    </div>
    <div class="flex items-center gap-2 text-xs text-muted">
      <AcNotificationMenu :unread-count="1280" align="start" />
      Count above 999
    </div>
  </div>
</template>
