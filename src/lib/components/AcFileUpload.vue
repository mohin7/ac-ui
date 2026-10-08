<script setup lang="ts">
import { computed, nextTick, ref, useId } from "vue";
import { CircleAlert, FileText, Upload, X } from "@lucide/vue";

export interface FileRejection {
  /** The file that was turned away. */
  file: File;
  /** `type` when it doesn't match `accept`, `size` when it's bigger than `maxSize`. */
  reason: "type" | "size";
  /** A sentence you can show as is. */
  message: string;
}

export interface Props {
  /** Label above the field, e.g. "Kubeconfig". Also names the picker button for screen readers. */
  label?: string;
  /** File types to allow, as for the native input: `.yaml,.yml`, `image/*`, `application/json`. */
  accept?: string;
  /** Allow several files. Without it, a new file replaces the current one. */
  multiple?: boolean;
  /** Largest allowed file in bytes, e.g. `1024 * 1024` for 1 MB. `0` means no limit. */
  maxSize?: number;
  /** Single-line field with a "Choose file" button instead of the drop zone. For tight forms. */
  small?: boolean;
  /** Line under the prompt. Defaults to the allowed types and size, e.g. ".yaml, .yml · up to 1 MB". */
  description?: string;
  /** Native `name` attribute of the file input. */
  name?: string;
  /** Marks the field required and adds a red asterisk to the label. */
  required?: boolean;
  /** Disables picking, dropping and removing. */
  disabled?: boolean;
  /** Error text under the field, e.g. from server-side validation. Type and size errors are shown automatically. */
  errorMsg?: string;
  /** Helper text under the field (hidden while there's an error). */
  hint?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  accept: "",
  multiple: false,
  maxSize: 0,
  small: false,
  description: "",
  name: "",
  required: false,
  disabled: false,
  errorMsg: "",
  hint: "",
});

/** The chosen files. Always an array, even without `multiple`. */
const model = defineModel<File[]>({ default: () => [] });

const emit = defineEmits<{
  /** Files that passed the checks and were added. */
  add: [files: File[]];
  /** A file was removed from the list. */
  remove: [file: File];
  /** Files turned away because of `accept` or `maxSize`. */
  reject: [rejections: FileRejection[]];
}>();

const id = useId();
const input = ref<HTMLInputElement | null>(null);
const browseButton = ref<HTMLButtonElement | null>(null);
const list = ref<HTMLElement | null>(null);
const dragDepth = ref(0);
const rejections = ref<FileRejection[]>([]);
const announcement = ref("");

const dragging = computed(() => dragDepth.value > 0);
const acceptTokens = computed(() =>
  props.accept
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean),
);
const autoDescription = computed(() => {
  const parts: string[] = [];
  if (acceptTokens.value.length) parts.push(acceptTokens.value.join(", "));
  if (props.maxSize) parts.push(`up to ${formatSize(props.maxSize)}`);
  return parts.join(" · ");
});
const shownDescription = computed(() => props.description || autoDescription.value);
const rejectionText = computed(() => rejections.value.map((r) => r.message).join(" "));
const error = computed(() => props.errorMsg || rejectionText.value);
const describedBy = computed(() => (error.value || props.hint ? `${id}-msg` : undefined));
const smallSummary = computed(() => {
  if (!model.value.length) return "";
  return model.value.length === 1 ? model.value[0]!.name : `${model.value.length} files`;
});

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let n = bytes / 1024;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n >= 10 || Number.isInteger(n) ? Math.round(n) : n.toFixed(1)} ${units[i]}`;
}

function matchesAccept(file: File) {
  if (!acceptTokens.value.length) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return acceptTokens.value.some((t) => {
    if (t.startsWith(".")) return name.endsWith(t);
    if (t.endsWith("/*")) return type.startsWith(t.slice(0, -1));
    return type === t;
  });
}

function sameFile(a: File, b: File) {
  return a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;
}

function addFiles(incoming: File[]) {
  if (props.disabled || !incoming.length) return;
  const accepted: File[] = [];
  const rejected: FileRejection[] = [];
  for (const file of props.multiple ? incoming : incoming.slice(0, 1)) {
    if (!matchesAccept(file)) {
      rejected.push({ file, reason: "type", message: `${file.name} isn't an allowed file type.` });
    } else if (props.maxSize && file.size > props.maxSize) {
      rejected.push({ file, reason: "size", message: `${file.name} is larger than ${formatSize(props.maxSize)}.` });
    } else {
      accepted.push(file);
    }
  }
  rejections.value = rejected;
  if (rejected.length) emit("reject", rejected);
  if (!accepted.length) {
    announcement.value = rejectionText.value;
    return;
  }
  const fresh = props.multiple ? accepted.filter((f) => !model.value.some((m) => sameFile(m, f))) : accepted;
  // New array — the model may be readonly.
  model.value = props.multiple ? [...model.value, ...fresh] : accepted;
  emit("add", fresh);
  announcement.value = `${fresh.length === 1 ? fresh[0]!.name : `${fresh.length} files`} added. ${rejectionText.value}`.trim();
}

function openPicker() {
  if (!props.disabled) input.value?.click();
}

function onInputChange(e: Event) {
  const el = e.target as HTMLInputElement;
  addFiles([...(el.files ?? [])]);
  // Reset so choosing the same file again still fires `change`.
  el.value = "";
}

function onDragEnter(e: DragEvent) {
  if (props.disabled || !e.dataTransfer?.types.includes("Files")) return;
  e.preventDefault();
  dragDepth.value++;
}

function onDragOver(e: DragEvent) {
  if (props.disabled || !e.dataTransfer?.types.includes("Files")) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
}

function onDragLeave() {
  dragDepth.value = Math.max(0, dragDepth.value - 1);
}

function onDrop(e: DragEvent) {
  if (props.disabled) return;
  e.preventDefault();
  dragDepth.value = 0;
  addFiles([...(e.dataTransfer?.files ?? [])]);
}

async function removeAt(index: number) {
  const file = model.value[index];
  if (!file || props.disabled) return;
  model.value = model.value.filter((_, i) => i !== index);
  rejections.value = [];
  emit("remove", file);
  announcement.value = `${file.name} removed.`;
  await nextTick();
  // Keep focus in the list so keyboard users don't land at the top of the page.
  const buttons = list.value?.querySelectorAll<HTMLButtonElement>("button");
  const next = buttons?.[Math.min(index, buttons.length - 1)];
  (next ?? browseButton.value)?.focus();
}

function clear() {
  const removed = [...model.value];
  model.value = [];
  rejections.value = [];
  removed.forEach((f) => emit("remove", f));
  announcement.value = "File removed.";
  browseButton.value?.focus();
}

defineExpose({
  /** Opens the native file picker. */
  open: openPicker,
});
</script>

<template>
  <div class="w-full" :class="disabled && 'opacity-60'" data-ac-ds data-testid="ac-file-upload">
    <p v-if="label" :id="`${id}-label`" class="mb-1.5 text-xs font-medium text-label">
      {{ label }}<span v-if="required" class="text-danger" aria-hidden="true"> *</span>
    </p>

    <input
      :id="`${id}-input`"
      ref="input"
      type="file"
      class="hidden"
      tabindex="-1"
      aria-hidden="true"
      :name="name || undefined"
      :accept="accept || undefined"
      :multiple="multiple"
      :disabled="disabled"
      @change="onInputChange"
    />

    <!-- small: one line, a button and the chosen file name -->
    <div
      v-if="small"
      class="flex h-9 w-full items-center rounded-6 border bg-surface shadow-xs transition-[border-color,box-shadow] duration-150"
      :class="[
        error ? 'border-red-60' : dragging ? 'border-primary shadow-[0_0_0_3px_var(--color-ring)]' : 'border-border hover:border-border-dark',
        disabled && 'bg-surface-muted',
      ]"
      @dragenter="onDragEnter"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <button
        ref="browseButton"
        type="button"
        class="ml-1 inline-flex h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-4 border border-border bg-surface-muted px-2.5 text-xs font-medium text-heading transition hover:bg-surface-sunken focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed"
        :disabled="disabled"
        :aria-describedby="describedBy"
        :aria-label="label ? `${multiple ? 'Choose files' : 'Choose file'} for ${label}` : undefined"
        @click="openPicker"
      >
        <Upload class="size-3.5" aria-hidden="true" />
        {{ multiple ? "Choose files" : "Choose file" }}
      </button>
      <span class="min-w-0 flex-1 truncate px-2.5 text-base" :class="smallSummary ? 'text-heading' : 'text-muted'" :title="model.map((f) => f.name).join(', ')">
        {{ smallSummary || (multiple ? "No files chosen" : "No file chosen") }}
      </span>
      <button
        v-if="model.length && !disabled"
        type="button"
        class="mr-1.5 inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-4 text-muted transition hover:bg-surface-sunken hover:text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
        :aria-label="model.length === 1 ? `Remove ${model[0]!.name}` : 'Remove all files'"
        @click="clear"
      >
        <X class="size-3.5" aria-hidden="true" />
      </button>
    </div>

    <!-- drop zone -->
    <div
      v-else
      class="flex flex-col items-center justify-center gap-3 rounded-10 border border-dashed px-6 py-7 text-center transition-colors duration-150"
      :class="[
        disabled ? 'cursor-not-allowed border-border bg-surface-muted' : 'cursor-pointer',
        !disabled && (dragging ? 'border-primary bg-primary-97' : error ? 'border-red-60 bg-surface hover:bg-surface-muted' : 'border-border-dark bg-surface hover:bg-surface-muted'),
      ]"
      @click.self="openPicker"
      @dragenter="onDragEnter"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <span
        class="pointer-events-none inline-flex size-10 items-center justify-center rounded-10 border shadow-xs transition-colors"
        :class="dragging ? 'border-primary-80 bg-surface text-primary' : 'border-border bg-surface text-muted'"
        aria-hidden="true"
      >
        <Upload class="size-4.5" />
      </span>
      <p class="pointer-events-none text-base text-heading">
        <span class="font-medium">{{ dragging ? "Drop to upload" : multiple ? "Drag and drop files here" : "Drag and drop a file here" }}</span>
        <span v-if="!dragging" class="text-muted"> or</span>
      </p>
      <button
        ref="browseButton"
        type="button"
        class="inline-flex h-8 cursor-pointer items-center gap-2 rounded-6 border border-border bg-surface px-3 text-base font-medium text-heading shadow-xs transition hover:border-border-dark hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed"
        :disabled="disabled"
        :aria-describedby="describedBy"
        :aria-label="label ? `Browse files for ${label}` : undefined"
        @click="openPicker"
      >
        Browse files
      </button>
      <p v-if="shownDescription" class="pointer-events-none -mt-1 text-xs text-muted">{{ shownDescription }}</p>
    </div>

    <p v-if="error" :id="`${id}-msg`" class="mt-1.5 flex items-start gap-1 text-xs text-red-30">
      <CircleAlert class="mt-px size-3.5 shrink-0" aria-hidden="true" />
      {{ error }}
    </p>
    <p v-else-if="hint" :id="`${id}-msg`" class="mt-1.5 text-xs text-muted">{{ hint }}</p>

    <ul
      v-if="!small && model.length"
      ref="list"
      class="mt-3 divide-y divide-border-light overflow-hidden rounded-8 border border-border bg-surface"
      :aria-label="label ? `${label} files` : 'Chosen files'"
    >
      <li v-for="(file, i) in model" :key="`${file.name}-${file.size}-${file.lastModified}`" class="flex items-center gap-3 py-2 pr-2 pl-3">
        <FileText class="size-4 shrink-0 text-muted" aria-hidden="true" />
        <span class="min-w-0 flex-1 truncate text-base text-heading" :title="file.name">{{ file.name }}</span>
        <span class="shrink-0 text-xs text-muted tabular-nums">{{ formatSize(file.size) }}</span>
        <button
          type="button"
          class="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-4 text-muted transition hover:bg-surface-sunken hover:text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed"
          :aria-label="`Remove ${file.name}`"
          :disabled="disabled"
          @click="removeAt(i)"
        >
          <X class="size-3.5" aria-hidden="true" />
        </button>
      </li>
    </ul>

    <span class="sr-only" aria-live="polite">{{ announcement }}</span>
  </div>
</template>
