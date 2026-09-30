<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { AcToaster } from "@/lib";
import DocsHeader from "./layout/DocsHeader.vue";
import DocsSidebar from "./layout/DocsSidebar.vue";
import DocsToc from "./layout/DocsToc.vue";
import PageHeader from "./layout/PageHeader.vue";
import PrevNext from "./layout/PrevNext.vue";
import SearchPalette from "./layout/SearchPalette.vue";
import type { DocPage } from "./nav";

const route = useRoute();
const page = computed(() => route.meta.page as DocPage | undefined);
const menuOpen = ref(false);
const searchOpen = ref(false);
const toc = ref<InstanceType<typeof DocsToc> | null>(null);

const onKey = (e: KeyboardEvent) => {
  const target = e.target as HTMLElement;
  const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    searchOpen.value = !searchOpen.value;
  } else if (e.key === "/" && !typing) {
    e.preventDefault();
    searchOpen.value = true;
  }
};
onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));
</script>

<template>
  <DocsHeader @search="searchOpen = true" @menu="menuOpen = true" />
  <div class="mx-auto flex max-w-360 gap-12 px-4 lg:px-8">
    <DocsSidebar :open="menuOpen" @close="menuOpen = false" />
    <main class="min-w-0 flex-1 pt-10 pb-20">
      <div class="flex gap-12">
        <article id="doc-content" class="min-w-0 flex-1" :class="!page?.hideHeader && 'xl:max-w-200'">
          <PageHeader v-if="page && !page.hideHeader" :page="page" />
          <RouterView v-slot="{ Component }">
            <component :is="Component" @vue:mounted="toc?.collect()" />
          </RouterView>
          <PrevNext v-if="page" :page="page" />
        </article>
        <aside v-if="!page?.hideHeader" class="sticky top-15 hidden h-[calc(100dvh-60px)] w-52 shrink-0 overflow-y-auto pt-10 pb-10 [scrollbar-width:none] xl:block">
          <DocsToc ref="toc" />
        </aside>
      </div>
    </main>
  </div>
  <SearchPalette v-model="searchOpen" />
  <AcToaster />
</template>
