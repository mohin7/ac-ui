<script setup lang="ts">
import { ref } from "vue";
import { AcSearchBar } from "@/lib";

const text = ref("");
const searched = ref("");
</script>

<template>
  <div class="max-w-72">
    <AcSearchBar v-model="text" placeholder="Search clusters" @search="searched = $event" />
    <p class="mt-3 text-xs text-muted">search emitted: “{{ searched }}” (300ms after typing stops)</p>
  </div>
</template>
