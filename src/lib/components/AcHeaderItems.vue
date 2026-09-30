<script setup lang="ts">
defineSlots<{
  /** `AcHeaderItem`s or controls, laid out in a row with an 8px gap. */
  default?: () => unknown;
}>();
</script>

<template>
  <div class="flex flex-wrap items-center gap-2" data-testid="ac-header-items"><slot /></div>
</template>
