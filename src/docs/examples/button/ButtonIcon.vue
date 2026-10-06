<script setup lang="ts">
import { ArrowRight, Plus } from "lucide-vue-next";
import { AcButton } from "@/lib";
</script>

<template>
  <AcButton title="Create Database">
    <template #icon>
      <Plus class="size-4" />
    </template>
  </AcButton>
  <AcButton color="white" aria-label="Add">
    <template #icon>
      <Plus class="size-4" />
    </template>
  </AcButton>
  <AcButton title="Continue" color="white">
    <template #icon-right>
      <ArrowRight class="size-4" />
    </template>
  </AcButton>
</template>
