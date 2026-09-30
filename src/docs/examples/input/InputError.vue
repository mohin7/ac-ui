<script setup lang="ts">
import { computed, ref } from "vue";
import { AcInput } from "@/lib";

const ns = ref("Demo_NS");
const error = computed(() =>
  /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/.test(ns.value) ? "" : "Use lowercase letters, numbers and hyphens.",
);
</script>

<template>
  <div class="max-w-80">
    <AcInput v-model="ns" label="Namespace" required :error-msg="error" />
  </div>
</template>
