<script setup lang="ts">
defineSlots<{
  /** One control in a header row. */
  default?: () => unknown;
}>();
</script>

<template>
  <div class="flex items-center" data-ac-ds data-testid="ac-header-item"><slot /></div>
</template>
