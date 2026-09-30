<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from "vue";
import { TextAlignStart } from "lucide-vue-next";
import { useRoute } from "vue-router";

interface Item {
  id: string;
  text: string;
  level: number;
}

const route = useRoute();
const items = ref<Item[]>([]);
const active = ref("");
let observer: IntersectionObserver | undefined;

// Collect the page's DocHeading elements after each navigation and track which one is on screen.
const collect = async () => {
  await nextTick();
  await new Promise((r) => setTimeout(r, 50));
  observer?.disconnect();
  const els = [...document.querySelectorAll<HTMLElement>("#doc-content [data-toc]")];
  items.value = els.map((el) => ({ id: el.id, text: el.textContent?.trim().replace(/^#\s*/, "") ?? "", level: Number(el.dataset.toc) }));
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) active.value = visible[0].target.id;
    },
    { rootMargin: "-64px 0px -70% 0px" },
  );
  els.forEach((el) => observer!.observe(el));
  active.value = items.value[0]?.id ?? "";
};

watch(() => route.path, collect, { immediate: true });
onBeforeUnmount(() => observer?.disconnect());
defineExpose({ collect });
</script>

<template>
  <nav v-if="items.length" aria-label="On this page">
    <p class="mb-3 flex items-center gap-2 text-xs font-semibold text-heading">
      <TextAlignStart class="size-3.5 text-muted" aria-hidden="true" />
      On this page
    </p>
    <ul class="space-y-0.5 border-l border-border-light">
      <li v-for="item in items" :key="item.id">
        <RouterLink
          :to="{ hash: `#${item.id}` }"
          class="-ml-px block border-l py-1 text-[12.5px] leading-5 transition-colors duration-150"
          :class="[
            item.level === 3 ? 'pl-6' : 'pl-3',
            active === item.id ? 'border-primary font-medium text-heading' : 'border-transparent text-muted hover:text-heading',
          ]"
          >{{ item.text }}</RouterLink
        >
      </li>
    </ul>
  </nav>
</template>
