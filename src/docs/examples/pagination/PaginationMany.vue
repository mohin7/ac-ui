<script setup lang="ts">
import { ref } from "vue";
import { AcPagination } from "@/lib";

const page = ref(12);
const wide = ref(12);
</script>

<template>
  <div class="grid gap-6">
    <AcPagination v-model:page="page" :total="480" hide-page-size item-label="events" />
    <AcPagination v-model:page="wide" :total="480" :siblings="2" hide-page-size item-label="events" />
  </div>
</template>
