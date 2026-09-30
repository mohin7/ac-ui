<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from "vue";
import AcButton from "./AcButton.vue";
import type { ComputedRef } from "vue";

export interface Props {
  /** Text of the primary button. It's a `type="submit"` button, so it submits the surrounding form. */
  submitLabel?: string;
  /** Text of the secondary button. */
  cancelLabel?: string;
  /** Hides the Cancel button. */
  hideCancel?: boolean;
  /** Shows a spinner on the primary button and disables both buttons while a request runs. */
  loading?: boolean;
  /** Disables the primary button, e.g. until the form is valid. */
  disabled?: boolean;
  /**
   * `container` sticks to the bottom of the nearest scrolling area (the page, a side panel, a modal body) while the form is in view.
   * `viewport` is always pinned to the bottom of the window, lined up with the form's column. `none` sits after the fields.
   */
  sticky?: "container" | "viewport" | "none";
  /** `id` of a `<form>` to submit when the footer is rendered outside it. */
  form?: string;
}

const props = withDefaults(defineProps<Props>(), {
  submitLabel: "Save",
  cancelLabel: "Cancel",
  hideCancel: false,
  loading: false,
  disabled: false,
  sticky: "container",
  form: "",
});

const emit = defineEmits<{
  /** Cancel was clicked. */
  cancel: [];
  /** The primary button was clicked while the footer isn't inside a form (and has no `form` id). Inside AcForm, listen to the form's `submit` instead. */
  save: [];
}>();

defineSlots<{
  /** Left side: a status line ("Unsaved changes"), a Reset or Delete button. */
  left?: () => unknown;
  /** Right side. Replaces the default Cancel and Save buttons. */
  right?: () => unknown;
}>();

const formContext = inject<{ widthClass: ComputedRef<string> } | null>("ac-form", null);

const root = ref<HTMLElement | null>(null);
const bar = ref<HTMLElement | null>(null);
const fixedBox = ref({ left: 0, width: 0, height: 0 });
let observer: ResizeObserver | undefined;

const innerWidth = computed(() => formContext?.widthClass.value ?? "");

function onSave(e: MouseEvent) {
  if (!(e.currentTarget as HTMLButtonElement | null)?.form) emit("save");
}

function measure() {
  if (!root.value || !bar.value) return;
  const r = root.value.getBoundingClientRect();
  fixedBox.value = { left: r.left, width: r.width, height: bar.value.offsetHeight };
}

function startMeasuring() {
  stopMeasuring();
  if (props.sticky !== "viewport" || !root.value || !bar.value) return;
  measure();
  observer = new ResizeObserver(measure);
  observer.observe(root.value);
  observer.observe(bar.value);
  window.addEventListener("resize", measure);
}

function stopMeasuring() {
  observer?.disconnect();
  observer = undefined;
  window.removeEventListener("resize", measure);
}

watch(() => props.sticky, startMeasuring, { flush: "post" });

onMounted(startMeasuring);
onBeforeUnmount(stopMeasuring);
</script>

<template>
  <!-- In viewport mode the root keeps the bar's space in the flow, so the last field isn't hidden under it. -->
  <div
    ref="root"
    class="mt-4 w-full"
    :class="[sticky === 'container' && 'sticky bottom-0 z-10', sticky !== 'viewport' && innerWidth]"
    :style="sticky === 'viewport' ? { height: `${fixedBox.height}px` } : undefined"
    data-testid="ac-form-footer"
  >
    <div
      ref="bar"
      class="border-t border-border bg-surface py-3"
      :class="sticky === 'viewport' && 'fixed bottom-0 z-40 px-4'"
      :style="sticky === 'viewport' ? { left: `${fixedBox.left}px`, width: `${fixedBox.width}px` } : undefined"
    >
      <div class="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2" :class="innerWidth">
        <div class="flex min-w-0 items-center gap-2 text-base text-muted">
          <slot name="left" />
        </div>
        <div class="ml-auto flex items-center gap-2">
          <slot name="right">
            <AcButton v-if="!hideCancel" :title="cancelLabel" color="white" :disabled="loading" @click="emit('cancel')" />
            <AcButton :title="submitLabel" type="submit" :form="form || undefined" :loading="loading" :disabled="disabled" @click="onSave" />
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
