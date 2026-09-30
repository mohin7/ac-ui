<script setup lang="ts">
withDefaults(defineProps<{ type?: "tip" | "note" | "warning" }>(), { type: "note" });
</script>

<template>
  <div
    class="my-5 flex gap-3 rounded-10 border px-4 py-3.5 text-lg leading-6 [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2"
    :class="{
      'border-primary-90 bg-primary-97 text-primary-10': type === 'tip',
      'border-blue-90 bg-blue-97 text-blue-10': type === 'note',
      'border-yellow-80 bg-yellow-97 text-yellow-10': type === 'warning',
    }"
  >
    <svg
      class="mt-1 size-4 shrink-0"
      :class="{ 'text-primary': type === 'tip', 'text-blue-50': type === 'note', 'text-yellow-50': type === 'warning' }"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        v-if="type === 'warning'"
        fill-rule="evenodd"
        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        clip-rule="evenodd"
      />
      <path
        v-else-if="type === 'tip'"
        d="M10 1a6 6 0 0 0-3.815 10.631C7.237 12.5 8 13.443 8 14.456v.644a.75.75 0 0 0 .572.729 6.016 6.016 0 0 0 2.856 0A.75.75 0 0 0 12 15.1v-.644c0-1.013.762-1.957 1.815-2.825A6 6 0 0 0 10 1ZM8.863 17.414a.75.75 0 0 0-.226 1.483 9.066 9.066 0 0 0 2.726 0 .75.75 0 0 0-.226-1.483 7.553 7.553 0 0 1-2.274 0Z"
      />
      <path
        v-else
        fill-rule="evenodd"
        d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
        clip-rule="evenodd"
      />
    </svg>
    <div class="min-w-0 flex-1"><slot /></div>
  </div>
</template>
