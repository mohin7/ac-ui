<script setup lang="ts">
import { computed, ref } from "vue";
import { AcCheckBox } from "@/lib";

const accepted = ref<string[]>([]);
const error = computed(() => (accepted.value.includes("terms") ? "" : "You must accept the terms to continue."));
</script>

<template>
  <AcCheckBox v-model="accepted" :options="[{ value: 'terms', label: 'I accept the terms of service' }]" :error-msg="error" />
</template>
