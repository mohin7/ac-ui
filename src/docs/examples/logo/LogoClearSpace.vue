<script setup lang="ts">
import { AcLogo } from "@/lib";
</script>

<template>
  <div class="flex justify-center">
    <!-- The dashed box is the clear space: half the logo's height on every side. -->
    <div class="rounded-6 border border-dashed border-primary-60 bg-primary-97 p-5">
      <div class="bg-surface outline outline-primary-80">
        <AcLogo :size="40" label="" />
      </div>
    </div>
  </div>
</template>
