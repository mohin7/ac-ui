<script setup lang="ts">
withDefaults(defineProps<{ id: string; level?: 2 | 3 }>(), { level: 2 });
</script>

<template>
  <component
    :is="`h${level}`"
    :id="id"
    class="group scroll-mt-20"
    :class="level === 2 ? 'mt-16 mb-3 text-[22px] leading-[30px] tracking-[-0.025em] first:mt-0' : 'mt-10 mb-2 text-[16px] leading-6 tracking-[-0.015em]'"
    :data-toc="level"
  >
    <RouterLink :to="{ hash: `#${id}` }" class="relative no-underline">
      <span
        class="absolute top-1/2 -left-5 hidden -translate-y-1/2 font-normal text-slate-60 opacity-0 transition-opacity group-hover:opacity-100 lg:inline"
        aria-hidden="true"
        >#</span
      >
      <slot />
    </RouterLink>
  </component>
</template>
