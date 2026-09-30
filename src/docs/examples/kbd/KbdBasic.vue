<script setup lang="ts">
import { AcKbd } from "@/lib";
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <AcKbd>/</AcKbd>
    <AcKbd>Esc</AcKbd>
    <AcKbd :keys="['mod', 'k']" />
    <AcKbd :keys="['ctrl', 'shift', 'p']" />
    <AcKbd :keys="['up']" />
    <AcKbd :keys="['cmd', 'enter']" separator="" />
  </div>
</template>
