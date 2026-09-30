<script setup lang="ts">
import { AcAvatar } from "@/lib";
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <AcAvatar name="AppsCode" img-url="https://github.com/appscode.png" shape="square" />
    <AcAvatar name="Nadia Islam" />
    <AcAvatar name="rafiul.hasan@appscode.com" />
    <!-- a broken image falls back to the initials -->
    <AcAvatar name="Arif Chowdhury" img-url="https://example.invalid/arif.png" />
    <AcAvatar />
  </div>
</template>
