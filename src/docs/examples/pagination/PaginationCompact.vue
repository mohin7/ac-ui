<script setup lang="ts">
import { ref } from "vue";
import { AcPagination } from "@/lib";

const page = ref(3);
</script>

<template>
  <div class="max-w-100">
    <AcPagination v-model:page="page" :total="57" compact hide-page-size />
  </div>
</template>
