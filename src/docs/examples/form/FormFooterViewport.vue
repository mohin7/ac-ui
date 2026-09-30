<script setup lang="ts">
import { ref } from "vue";
import { AcButton, AcFormFooter } from "@/lib";

const pinned = ref(false);
</script>

<template>
  <div>
    <AcButton :title="pinned ? 'Unpin footer' : 'Pin footer to the window'" color="white" @click="pinned = !pinned" />
    <!-- sticky="viewport" stays at the bottom of the window, lined up with this column. -->
    <AcFormFooter v-if="pinned" sticky="viewport" submit-label="Create Database" @cancel="pinned = false" @save="pinned = false">
      <template #left>Scroll the page — the bar stays put.</template>
    </AcFormFooter>
  </div>
</template>
