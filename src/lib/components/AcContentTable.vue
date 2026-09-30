<script setup lang="ts">
import AcContentHeader from "./AcContentHeader.vue";
import AcContentLayout from "./AcContentLayout.vue";
import AcSearchBar from "./AcSearchBar.vue";

export interface Props {
  /** Title above the table. */
  title?: string;
  /** Line under the title, e.g. a count. */
  subtitle?: string;
  /** Adds a search box to the header. Its text is passed to the default slot as `searchText`. */
  searchable?: boolean;
  /** Placeholder of the search box. */
  searchPlaceholder?: string;
  /** Hides the header entirely. */
  hideHeader?: boolean;
  /** Pads the content area. Turn off when the slot is a flush table. */
  padded?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: "",
  subtitle: "",
  searchable: false,
  searchPlaceholder: "Search",
  hideHeader: false,
  padded: true,
});

const emit = defineEmits<{ search: [value: string] }>();

defineSlots<{
  /** Right after the title. */
  "title-actions"?: () => unknown;
  /** Header controls before the search box, e.g. filters. */
  "left-controls"?: () => unknown;
  /** Header controls after the search box, e.g. the Create button. */
  "right-controls"?: () => unknown;
  /** The table. Receives the current `searchText`. */
  default?: (props: { searchText: string }) => unknown;
}>();

/** The search text. Bind with `v-model:search` to control or read it. */
const searchText = defineModel<string>("search", { default: "" });
</script>

<template>
  <AcContentLayout data-testid="ac-content-table">
    <template v-if="!hideHeader" #header>
      <AcContentHeader :title="title" :subtitle="subtitle">
        <template v-if="$slots['title-actions']" #title-actions><slot name="title-actions" /></template>
        <slot name="left-controls" />
        <div v-if="searchable" class="w-56">
          <AcSearchBar v-model="searchText" :placeholder="searchPlaceholder" @search="emit('search', $event)" />
        </div>
        <slot name="right-controls" />
      </AcContentHeader>
    </template>
    <div :class="padded && 'p-4'">
      <slot :search-text="searchText" />
    </div>
  </AcContentLayout>
</template>
