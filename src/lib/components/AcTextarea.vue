<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useId, watch } from "vue";
import { CircleAlert } from "lucide-vue-next";

export interface Props {
  /** Floating label. It rests on the first line and rises on focus or when filled. */
  label: string;
  /** Native `name` attribute. */
  name?: string;
  /** Visible height in lines. With `autoResize` it's the starting (minimum) height. */
  rows?: number;
  /** Grows the field with its content instead of showing a scrollbar. */
  autoResize?: boolean;
  /** With `autoResize`, the height in lines after which the field scrolls. `0` means no limit. */
  maxRows?: number;
  /** Maximum number of characters. Shows a live `12 / 500` count under the field. */
  maxlength?: number;
  /** Monospace text, for certificates, keys, YAML and other pasted config. */
  mono?: boolean;
  /** Marks the field required and adds a red asterisk. */
  required?: boolean;
  /** Disables the field. */
  disabled?: boolean;
  /** Read-only field with a gray background. */
  readonly?: boolean;
  /** Error text under the field. Turns the border and label red and sets `aria-invalid`. */
  errorMsg?: string;
  /** Helper text under the field (hidden while `errorMsg` is set). */
  hint?: string;
}

const props = withDefaults(defineProps<Props>(), {
  name: "",
  rows: 4,
  autoResize: false,
  maxRows: 0,
  maxlength: undefined,
  mono: false,
  required: false,
  disabled: false,
  readonly: false,
  errorMsg: "",
  hint: "",
});

const model = defineModel<string>({ default: "" });

const id = useId();
const field = ref<HTMLTextAreaElement | null>(null);
const scrolls = ref(false);

const length = computed(() => (model.value ?? "").length);
const atLimit = computed(() => props.maxlength !== undefined && length.value >= props.maxlength);
const describedBy = computed(
  () => [props.errorMsg || props.hint ? `${id}-msg` : "", props.maxlength !== undefined ? `${id}-count` : ""].filter(Boolean).join(" ") || undefined,
);

function resize() {
  const el = field.value;
  if (!el || !props.autoResize) return;
  const style = getComputedStyle(el);
  const line = parseFloat(style.lineHeight) || 20;
  const chrome = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
  const min = props.rows * line + chrome;
  const max = props.maxRows > 0 ? props.maxRows * line + chrome : Infinity;
  // Collapse first so the field can shrink when text is deleted.
  el.style.height = "auto";
  const wanted = el.scrollHeight + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
  el.style.height = `${Math.min(Math.max(wanted, min), max)}px`;
  scrolls.value = wanted > max;
}

watch(model, () => nextTick(resize));
watch(() => [props.autoResize, props.rows, props.maxRows], () => {
  if (!props.autoResize && field.value) field.value.style.height = "";
  nextTick(resize);
});

onMounted(resize);

defineExpose({
  /** Moves focus to the textarea. */
  focus: () => field.value?.focus(),
});
</script>

<template>
  <div class="w-full" :class="disabled && 'opacity-60'" data-testid="ac-textarea">
    <div class="relative">
      <!-- placeholder=" " lets the label float with :placeholder-shown, as in AcInput -->
      <textarea
        :id="id"
        ref="field"
        v-model="model"
        :name="name"
        :rows="rows"
        :maxlength="maxlength"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-invalid="!!errorMsg || undefined"
        :aria-describedby="describedBy"
        placeholder=" "
        class="peer block w-full rounded-6 border bg-surface px-3 py-2 text-base text-heading shadow-xs transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-transparent disabled:cursor-not-allowed disabled:bg-surface-muted read-only:bg-surface-muted read-only:shadow-none"
        :class="[
          mono && 'font-mono text-xs leading-5',
          autoResize ? (scrolls ? 'ac-scrollbar resize-none' : 'resize-none overflow-hidden') : 'ac-scrollbar resize-y',
          errorMsg
            ? 'border-red-60 focus:border-danger focus:shadow-[0_0_0_3px_var(--color-red-90)]'
            : 'border-border hover:border-border-dark focus:focus-ring',
        ]"
      />
      <label
        :for="id"
        class="pointer-events-none absolute top-0 left-2.5 -translate-y-1/2 rounded-2 bg-surface px-1 text-xs font-medium text-label transition-all duration-150 ease-out peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-muted peer-focus:top-0 peer-focus:text-xs peer-focus:font-medium peer-focus:text-primary-20 peer-read-only:bg-linear-to-b peer-read-only:from-surface peer-read-only:from-50% peer-read-only:to-surface-muted peer-read-only:to-50% peer-disabled:bg-linear-to-b peer-disabled:from-surface peer-disabled:from-50% peer-disabled:to-surface-muted peer-disabled:to-50%"
        :class="errorMsg && 'text-red-30! peer-focus:text-red-30!'"
      >
        {{ label }}<span v-if="required" class="text-danger" aria-hidden="true"> *</span>
      </label>
    </div>
    <div v-if="errorMsg || hint || maxlength !== undefined" class="mt-1.5 flex items-start gap-3">
      <p v-if="errorMsg" :id="`${id}-msg`" class="flex min-w-0 flex-1 items-center gap-1 text-xs text-red-30">
        <CircleAlert class="size-3.5 shrink-0" aria-hidden="true" />
        {{ errorMsg }}
      </p>
      <p v-else-if="hint" :id="`${id}-msg`" class="min-w-0 flex-1 text-xs text-muted">{{ hint }}</p>
      <span v-else class="flex-1" />
      <p
        v-if="maxlength !== undefined"
        :id="`${id}-count`"
        class="shrink-0 text-xs tabular-nums"
        :class="atLimit ? 'font-medium text-red-30' : 'text-muted'"
      >
        <span class="sr-only">Characters used: </span>{{ length }} / {{ maxlength }}
      </p>
    </div>
  </div>
</template>
