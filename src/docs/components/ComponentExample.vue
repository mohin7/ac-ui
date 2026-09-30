<script setup lang="ts">
import { computed, ref, type Component } from "vue";
import CodeBlock from "./CodeBlock.vue";

// Every example is a real SFC in src/docs/examples; the preview runs it and the code shows its exact source.
const components = import.meta.glob<Component>("../examples/**/*.vue", { eager: true, import: "default" });
const sources = import.meta.glob<string>("../examples/**/*.vue", { eager: true, query: "?raw", import: "default" });

const props = withDefaults(defineProps<{ name: string; center?: boolean; padded?: boolean }>(), {
  center: false,
  padded: true,
});

const key = computed(() => `../examples/${props.name}.vue`);
const component = computed(() => components[key.value]);
const expanded = ref(false);
const COLLAPSE_AT = 16;

const code = computed(() =>
  (sources[key.value] ?? `<!-- missing example: ${props.name} -->`).replace(/^<!--[\s\S]*?-->\n/, ""),
);
const long = computed(() => code.value.trim().split("\n").length > COLLAPSE_AT);
</script>

<template>
  <div class="mt-4 mb-8 overflow-hidden rounded-12 border border-border bg-white shadow-xs">
    <div
      class="preview-canvas"
      :class="[padded && 'px-6 py-8 sm:px-10', center && 'flex min-h-32 flex-wrap items-center justify-center gap-3']"
    >
      <component :is="component" v-if="component" />
    </div>
    <div class="relative border-t border-border">
      <div :class="long && !expanded && 'max-h-72 overflow-hidden'">
        <CodeBlock :code="code" flush />
      </div>
      <div
        v-if="long"
        class="flex justify-center py-2.5"
        :class="!expanded && 'absolute inset-x-0 bottom-0 bg-linear-to-t from-[#fbfcfd] from-30% to-transparent pt-16'"
      >
        <button
          type="button"
          class="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-50 border border-border bg-white px-3 text-xs font-medium text-heading shadow-sm transition hover:border-border-dark"
          :aria-expanded="expanded"
          @click="expanded = !expanded"
        >
          <svg class="size-3 transition-transform" :class="expanded && 'rotate-180'" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="m2.5 4.5 3.5 3.5 3.5-3.5" /></svg>
          {{ expanded ? "Collapse code" : "Expand code" }}
        </button>
      </div>
    </div>
  </div>
</template>
