<script lang="ts">
import type { EditorLanguage } from "../editor/validate";

export interface EditorFile {
  /** Unique within the list. Shown in the list and the editor header, e.g. `postgres.yaml`. */
  name: string;
  /** The text. With `encoding: "base64"`, the base64 value as a Secret stores it. */
  content: string;
  /** The saved version, in the same encoding as `content`. Marks the file as changed and adds an Edit / Changes switch. */
  original?: string;
  /** Overrides the language guessed from the extension (`.yaml`/`.yml`, `.json`, `.sh`; anything else is text). */
  language?: EditorLanguage;
  /** JSON Schema this file is checked against, e.g. its CRD's `openAPIV3Schema`. */
  schema?: object;
  /** Hides the value until someone chooses Show value. It's hidden again when they open another file. */
  secret?: boolean;
  /** `base64`: `content` and `original` are base64. The editor shows the decoded text and encodes edits back. */
  encoding?: "base64";
  /** This file can't be edited. */
  readonly?: boolean;
  /** Kind shown under the name, e.g. `Postgres` or `Secret`. */
  kind?: string;
  /** More detail after the kind, e.g. the namespace. */
  description?: string;
}

export interface Props {
  /** Shows a skeleton list and editor while the files load. */
  loading?: boolean;
  /** No file can be edited. Files with an `original` then show only their changes. */
  readonly?: boolean;
  /** Any CSS height for the whole editor, e.g. `480px` or `calc(100vh - 240px)`. */
  height?: string;
  /** Shows a search box above the list. `auto` shows it once there are more than 8 files. */
  searchable?: boolean | "auto";
  /** Adds a YAML / JSON switch to the header. Edits in the other format are converted back; YAML comments don't survive that. */
  formatSwitch?: boolean;
  /** Checks YAML and JSON files as you type, against their `schema` too. Turn off for templates that aren't valid until rendered. */
  validate?: boolean;
  /** Adds a copy button to the header. */
  copyable?: boolean;
  /** Wraps long lines instead of scrolling sideways. */
  wrap?: boolean;
  /** Accessible name for the file list, e.g. "Secret keys". */
  label?: string;
  /** Title shown when there are no files. */
  emptyText?: string;
}
</script>

<script setup lang="ts" generic="F extends EditorFile">
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, useId, watch } from "vue";
import { CircleAlert, Eye, EyeOff, FileBraces, FileCode, FileLock, FileTerminal, FileText, Lock, TriangleAlert } from "lucide-vue-next";
import { Text } from "@codemirror/state";
import AcButton from "./AcButton.vue";
import AcCodeEditor from "./AcCodeEditor.vue";
import AcEmptyState from "./AcEmptyState.vue";
import AcSearchBar from "./AcSearchBar.vue";
import AcSegmentedControl from "./AcSegmentedControl.vue";
import AcSelect from "./AcSelect.vue";
import AcSkeleton from "./AcSkeleton.vue";
import type { EditorProblem } from "../editor/validate";

type Format = "yaml" | "json";

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  readonly: false,
  height: "480px",
  searchable: "auto",
  formatSwitch: false,
  validate: true,
  copyable: true,
  wrap: true,
  label: "Files",
  emptyText: "No files to show",
});

/** The files: `{ name, content, original?, language?, schema?, secret?, encoding?, readonly?, kind?, description? }`. Edits replace the edited file with a copy, so extra fields such as `gvr` are kept. */
const files = defineModel<F[]>("files", { default: () => [] });
/** The `name` of the open file. When it's empty or doesn't match a file, the first file opens. */
const active = defineModel<string>("active", { default: "" });
/** The list's search text. Bind it to drive the search from your own search box. */
const search = defineModel<string>("search", { default: "" });
/** With `format-switch`, which format YAML and JSON files are shown in. */
const format = defineModel<"yaml" | "json">("format", { default: "yaml" });
/** For a file with an `original`, whether its text or its changes show. */
const view = defineModel<"edit" | "changes">("view", { default: "edit" });

const emit = defineEmits<{
  /** Fires after files are checked, with each file's problems keyed by name. A file without problems has an empty list. */
  validate: [problems: Record<string, EditorProblem[]>];
}>();

defineSlots<{
  /** Buttons at the right of the editor header, e.g. Save or Delete for the open file. */
  actions?: (props: { file: F }) => unknown;
  /** Replaces the empty state shown when there are no files. */
  empty?: () => unknown;
}>();

const AUTO_SEARCH_AFTER = 8;
const LIST_SKELETON = ["70%", "55%", "80%", "45%", "65%", "50%", "75%"];
const ICONS = { yaml: FileCode, json: FileBraces, shell: FileTerminal, text: FileText } as const;
const EXTENSIONS: Record<string, EditorLanguage> = { yaml: "yaml", yml: "yaml", json: "json", sh: "shell", bash: "shell" };

let validateModule: Promise<typeof import("../editor/validate")> | undefined;
const loadValidate = () => (validateModule ??= import("../editor/validate"));

const id = useId();
const paneId = `${id}-pane`;
const searchWrap = ref<HTMLElement>();
const editorRef = ref<InstanceType<typeof AcCodeEditor>>();
const revealButton = ref<InstanceType<typeof AcButton>>();
const optionEls = new Map<string, HTMLElement>();
const yamlLib = shallowRef<typeof import("yaml")>();
const revealed = ref(false);
// What someone typed in the converted view, kept while it doesn't parse. `basis` is the content it was converted from.
const draft = ref<{ name: string; language: EditorLanguage; text: string; basis: string; broken: boolean } | null>(null);
const editorProblems = ref<{ name: string; problems: EditorProblem[] } | null>(null);
const checked = ref<Record<string, EditorProblem[]> | null>(null);

const activeFile = computed(() => files.value.find((f) => f.name === active.value));
const showSearch = computed(() => (props.searchable === "auto" ? files.value.length > AUTO_SEARCH_AFTER : props.searchable));
const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return files.value;
  // Secret values aren't searched, so a search can't be used to guess them.
  return files.value.filter((f) =>
    [f.name, f.kind, f.description, f.secret ? "" : f.content].some((s) => s?.toLowerCase().includes(q)),
  );
});
const tabStop = computed(() => (filtered.value.some((f) => f.name === active.value) ? active.value : filtered.value[0]?.name));

const pane = computed(() => {
  const file = activeFile.value;
  if (!file) return null;
  const native = languageOf(file);
  const decoded = decode(file, file.content);
  const undecodable = decoded === null;
  const text = decoded ?? file.content;
  const original = file.original === undefined ? undefined : (decode(file, file.original) ?? file.original);
  const switchable = props.formatSwitch && !undecodable && (native === "yaml" || native === "json");
  const other: Format = native === "json" ? "yaml" : "json";
  const converted = switchable ? convert(text, native, other) : null;
  const shown = switchable && format.value !== native && converted !== null;
  return {
    file,
    native,
    switchable,
    convertible: converted !== null,
    language: shown ? other : native,
    text: shown ? converted : text,
    original: shown && original !== undefined ? (convert(original, native, other) ?? undefined) : original,
    undecodable,
    readonly: props.readonly || !!file.readonly || undecodable,
  };
});
const editorText = computed(() => {
  const p = pane.value;
  if (!p) return "";
  const d = draft.value;
  return d && d.name === p.file.name && d.language === p.language && d.basis === p.file.content ? d.text : p.text;
});
const hidden = computed(() => !!activeFile.value?.secret && !revealed.value);
const draftBroken = computed(() => !!draft.value?.broken && editorText.value === draft.value.text);
const formatOptions = computed(() => {
  const p = pane.value;
  // Switching away from text that doesn't parse would lose it.
  return (["yaml", "json"] as const).map((value) => ({
    value,
    label: value.toUpperCase(),
    disabled: !!p && value !== p.language && (draftBroken.value || (value !== p.native && !p.convertible)),
  }));
});
const problems = computed(() => {
  if (!checked.value) return null;
  const p = pane.value;
  const e = editorProblems.value;
  // In the converted view the editor checks what's on screen, which may not parse yet.
  if (p && p.language !== p.native && e?.name === p.file.name) return { ...checked.value, [p.file.name]: e.problems };
  return checked.value;
});
const changedCount = computed(() => files.value.filter(isChanged).length);
const problemCount = computed(() => files.value.filter((f) => problemsOf(f).length).length);
const selectOptions = computed(() =>
  files.value.map((f) => ({ value: f.name, label: f.name, description: [subtitle(f), statusText(f)].filter(Boolean).join(" · ") || undefined })),
);

function languageOf(file: EditorFile): EditorLanguage {
  if (file.language) return file.language;
  const ext = file.name.includes(".") ? file.name.split(".").pop()!.toLowerCase() : "";
  return EXTENSIONS[ext] ?? "text";
}

function decode(file: EditorFile, stored: string): string | null {
  if (file.encoding !== "base64") return stored;
  try {
    const bytes = Uint8Array.from(atob(stored.replace(/\s/g, "")), (c) => c.charCodeAt(0));
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

function encode(file: EditorFile, text: string) {
  if (file.encoding !== "base64") return text;
  let binary = "";
  for (const byte of new TextEncoder().encode(text)) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function convert(text: string, from: EditorLanguage, to: Format): string | null {
  const lib = yamlLib.value;
  if (!lib) return null;
  if (!text.trim()) return "";
  try {
    const value = from === "json" ? JSON.parse(text) : lib.parse(text);
    return to === "json" ? JSON.stringify(value, null, 2) + "\n" : lib.stringify(value, { lineWidth: 0 });
  } catch {
    return null;
  }
}

function isChanged(file: EditorFile) {
  return file.original !== undefined && file.content !== file.original;
}

function problemsOf(file: EditorFile) {
  return problems.value?.[file.name] ?? [];
}

function hasErrors(file: EditorFile) {
  return problemsOf(file).some((p) => p.severity === "error");
}

function subtitle(file: EditorFile) {
  return [file.kind, file.description].filter(Boolean).join(" · ");
}

function statusText(file: EditorFile) {
  const count = problemsOf(file).length;
  return [isChanged(file) && "Changed", count && `${count} ${count === 1 ? "problem" : "problems"}`].filter(Boolean).join(", ");
}

function iconOf(file: EditorFile) {
  return file.secret ? FileLock : ICONS[languageOf(file)];
}

function write(name: string, content: string) {
  files.value = files.value.map((f) => (f.name === name ? { ...f, content } : f));
}

function onInput(text: string) {
  const p = pane.value;
  if (!p || text === editorText.value) return;
  if (p.language === p.native) return write(p.file.name, encode(p.file, text));
  const back = convert(text, p.language, p.native as Format);
  const basis = back === null ? p.file.content : encode(p.file, back);
  draft.value = { name: p.file.name, language: p.language, text, basis, broken: back === null };
  if (basis !== p.file.content) write(p.file.name, basis);
}

function onEditorValidate(list: EditorProblem[]) {
  if (pane.value) editorProblems.value = { name: pane.value.file.name, problems: list };
}

function setFormat(value: Format | null) {
  if (!value) return;
  draft.value = null;
  format.value = value;
}

function setOptionEl(name: string, el: unknown) {
  if (el instanceof HTMLElement) optionEls.set(name, el);
  else optionEls.delete(name);
}

function pick(name: string, moveFocus = false) {
  active.value = name;
  if (moveFocus) optionEls.get(name)?.focus();
}

let typed = "";
let typedTimer: ReturnType<typeof setTimeout> | undefined;
function typeAhead(key: string, from: number) {
  clearTimeout(typedTimer);
  typed += key.toLowerCase();
  typedTimer = setTimeout(() => (typed = ""), 500);
  const list = filtered.value;
  for (let n = 1; n <= list.length; n++) {
    // A repeated first letter cycles through the matches.
    const file = list[(from + (typed.length === 1 ? n : n - 1)) % list.length]!;
    if (file.name.toLowerCase().startsWith(typed)) return pick(file.name, true);
  }
}

function onOptionKeydown(e: KeyboardEvent, index: number) {
  const list = filtered.value;
  const moves: Record<string, number> = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: list.length - 1 };
  if (e.key in moves) {
    e.preventDefault();
    if (e.key === "ArrowUp" && index === 0 && showSearch.value) return searchWrap.value?.querySelector("input")?.focus();
    const next = list[Math.min(Math.max(moves[e.key]!, 0), list.length - 1)];
    if (next) pick(next.name, true);
  } else if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    pick(list[index]!.name);
    if (e.key === "Enter") nextTick(focus);
  } else if (e.key.length === 1 && e.key !== " " && !e.ctrlKey && !e.metaKey && !e.altKey) {
    typeAhead(e.key, index);
  }
}

function onSearchKeydown(e: KeyboardEvent) {
  if (e.key !== "ArrowDown" || !tabStop.value) return;
  e.preventDefault();
  pick(tabStop.value, true);
}

function reveal(show: boolean) {
  revealed.value = show;
  nextTick(() => (show ? editorRef.value?.focus() : (revealButton.value?.$el as HTMLElement | undefined)?.focus()));
}

let checkTimer: ReturnType<typeof setTimeout> | undefined;
let checkRun = 0;
const cache = new Map<string, { text: string; language: EditorLanguage; schema?: object; problems: EditorProblem[] }>();
async function checkAll() {
  const run = ++checkRun;
  const next: Record<string, EditorProblem[]> = {};
  const needsCheck = props.validate && files.value.some((f) => ["yaml", "json"].includes(languageOf(f)));
  const module = needsCheck ? await loadValidate() : undefined;
  for (const file of files.value) {
    const language = languageOf(file);
    const text = decode(file, file.content);
    if (!module || text === null || (language !== "yaml" && language !== "json")) {
      next[file.name] = [];
      continue;
    }
    const hit = cache.get(file.name);
    if (hit && hit.text === text && hit.language === language && hit.schema === file.schema) {
      next[file.name] = hit.problems;
      continue;
    }
    const diagnostics = await module.checkDocument(text, language, file.schema);
    if (run !== checkRun) return;
    const list = module.toProblems(diagnostics, Text.of(text.split("\n")));
    cache.set(file.name, { text, language, schema: file.schema, problems: list });
    next[file.name] = list;
  }
  if (run === checkRun) checked.value = next;
}

function scheduleCheck() {
  clearTimeout(checkTimer);
  checkTimer = setTimeout(checkAll, checked.value ? 300 : 0);
}

function focus() {
  if (hidden.value) (revealButton.value?.$el as HTMLElement | undefined)?.focus();
  else editorRef.value?.focus();
}

watch(
  [() => files.value.map((f) => f.name).join("\n"), active],
  () => {
    if (files.value.length && !activeFile.value) active.value = files.value[0]!.name;
  },
  { immediate: true },
);
watch(active, (name) => {
  revealed.value = false;
  draft.value = null;
  editorProblems.value = null;
  nextTick(() => optionEls.get(name)?.scrollIntoView({ block: "nearest" }));
});
watch(
  () => props.formatSwitch,
  async (on) => {
    if (on && !yamlLib.value) yamlLib.value = await import("yaml");
  },
  { immediate: true },
);
watch([files, () => props.validate], scheduleCheck, { deep: true, immediate: true });

let lastEmitted = "";
watch(problems, (next) => {
  if (!next) return;
  const serialized = JSON.stringify(next);
  if (serialized === lastEmitted) return;
  lastEmitted = serialized;
  emit("validate", next);
});

onBeforeUnmount(() => {
  clearTimeout(checkTimer);
  clearTimeout(typedTimer);
});

defineExpose({
  /** Moves focus into the open file's editor, or to its Show value button while a secret is hidden. */
  focus,
});
</script>

<template>
  <div
    class="@container min-w-0 overflow-hidden rounded-10 border border-border bg-surface shadow-xs"
    :style="{ height }"
    :aria-busy="loading || undefined"
    data-ac-ds
    data-testid="ac-file-editor"
  >
    <div v-if="loading" class="flex h-full flex-col @2xl:flex-row">
      <div class="hidden w-60 shrink-0 flex-col gap-1 border-r border-border-light bg-surface-muted p-2 @2xl:flex @4xl:w-72" aria-hidden="true">
        <div v-for="(width, i) in LIST_SKELETON" :key="i" class="flex h-11 items-center gap-2.5 px-2.5">
          <AcSkeleton shape="rect" width="16px" height="16px" label="" />
          <div class="flex min-w-0 flex-1 flex-col gap-1.5">
            <AcSkeleton :width="width" height="10px" label="" />
            <AcSkeleton width="35%" height="8px" label="" />
          </div>
        </div>
      </div>
      <div class="border-b border-border-light p-2 @2xl:hidden" aria-hidden="true">
        <AcSkeleton shape="rect" height="36px" label="" />
      </div>
      <AcSkeleton
        shape="editor"
        height="100%"
        label="Loading files"
        class="min-h-0 min-w-0 flex-1 [&>div]:rounded-none [&>div]:border-0 [&>div]:shadow-none"
      />
    </div>

    <div v-else-if="!files.length" class="flex h-full items-center justify-center overflow-auto">
      <slot name="empty">
        <AcEmptyState :title="emptyText" />
      </slot>
    </div>

    <div v-else class="flex h-full flex-col @2xl:flex-row">
      <div class="hidden w-60 shrink-0 flex-col border-r border-border-light bg-surface-muted @2xl:flex @4xl:w-72">
        <div v-if="showSearch" ref="searchWrap" class="border-b border-border-light p-2" @keydown="onSearchKeydown">
          <AcSearchBar v-model="search" placeholder="Search files" :debounce="0" />
        </div>
        <ul
          v-if="filtered.length"
          role="listbox"
          :aria-label="label"
          :aria-controls="paneId"
          class="ac-scrollbar flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto p-1.5"
        >
          <li
            v-for="(file, index) in filtered"
            :key="file.name"
            :ref="(el) => setOptionEl(file.name, el)"
            role="option"
            :aria-selected="file.name === active"
            :tabindex="file.name === tabStop ? 0 : -1"
            :title="file.name"
            class="flex min-h-9 shrink-0 cursor-pointer items-center gap-2.5 rounded-6 px-2.5 py-1.5 transition-[background-color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
            :class="file.name === active ? 'bg-surface text-heading shadow-xs ring-1 ring-border' : 'text-body hover:bg-surface-sunken'"
            @click="pick(file.name, true)"
            @keydown="onOptionKeydown($event, index)"
          >
            <component :is="iconOf(file)" class="size-4 shrink-0" :class="file.name === active ? 'text-primary' : 'text-muted'" aria-hidden="true" />
            <span class="flex min-w-0 flex-1 flex-col">
              <span class="truncate text-base leading-5 font-medium">{{ file.name }}</span>
              <span v-if="subtitle(file)" class="truncate text-xs leading-4 text-muted">{{ subtitle(file) }}</span>
            </span>
            <span v-if="problemsOf(file).length" class="inline-flex shrink-0 items-center gap-1 text-xs font-medium tabular-nums" :class="hasErrors(file) ? 'text-red-40' : 'text-yellow-30'">
              <component :is="hasErrors(file) ? CircleAlert : TriangleAlert" class="size-3.5" aria-hidden="true" />
              {{ problemsOf(file).length }}
            </span>
            <span v-if="isChanged(file)" class="size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            <span v-if="statusText(file)" class="sr-only">, {{ statusText(file) }}</span>
          </li>
        </ul>
        <div v-else class="min-h-0 flex-1 overflow-auto">
          <AcEmptyState variant="search" size="small" :query="search.trim()" description="Try a file name, kind or a word in the file." />
        </div>
        <p class="border-t border-border-light px-3 py-2 text-xs text-muted">
          {{ files.length }} {{ files.length === 1 ? "file" : "files" }}<template v-if="changedCount"> · {{ changedCount }} changed</template
          ><template v-if="problemCount"> · <span class="text-red-40">{{ problemCount }} with problems</span></template>
        </p>
      </div>

      <div class="border-b border-border-light bg-surface-muted p-2 @2xl:hidden">
        <AcSelect
          :model-value="active"
          :options="selectOptions"
          :searchable="files.length > AUTO_SEARCH_AFTER"
          :placeholder="label"
          size="compact"
          @update:model-value="(v) => typeof v === 'string' && pick(v)"
        />
      </div>

      <section v-if="pane" :id="paneId" :aria-label="pane.file.name" class="flex min-h-0 min-w-0 flex-1 flex-col">
        <p v-if="pane.undecodable" class="border-b border-yellow-90 bg-yellow-97 px-3 py-2 text-xs text-yellow-10">
          This value isn't base64-encoded text, so it's shown as stored and can't be edited here.
        </p>

        <template v-if="hidden">
          <div class="flex min-h-11 flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-border-light px-3 py-2">
            <span class="min-w-0 truncate font-mono text-xs font-medium text-heading">{{ pane.file.name }}</span>
            <span class="inline-flex items-center gap-1 rounded-4 bg-surface-sunken px-1.5 text-sm leading-5 font-medium text-muted">
              <Lock class="size-3" aria-hidden="true" />Secret
            </span>
            <div class="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-2">
              <slot name="actions" :file="pane.file" />
            </div>
          </div>
          <div class="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-surface-muted">
            <AcEmptyState :icon="Lock" title="Value hidden" description="Secret values stay hidden until you show them." size="small">
              <template #actions>
                <AcButton ref="revealButton" title="Show value" color="white" size="small" @click="reveal(true)">
                  <template #icon><Eye /></template>
                </AcButton>
              </template>
            </AcEmptyState>
          </div>
        </template>

        <AcCodeEditor
          v-else
          ref="editorRef"
          :key="`${pane.file.name}:${pane.language}`"
          v-model:view="view"
          :model-value="editorText"
          :language="pane.language"
          :original="pane.original"
          :schema="pane.file.schema"
          :readonly="pane.readonly"
          :validate="validate"
          :wrap="wrap"
          :copyable="copyable"
          :title="pane.file.name"
          :bordered="false"
          height="100%"
          class="h-full min-h-0 flex-1"
          @update:model-value="onInput"
          @validate="onEditorValidate"
        >
          <template #actions>
            <slot name="actions" :file="pane.file" />
            <AcSegmentedControl
              v-if="pane.switchable"
              :model-value="pane.language as Format"
              :options="formatOptions"
              size="small"
              label="Format"
              @update:model-value="setFormat"
            />
            <button
              v-if="pane.file.secret"
              type="button"
              class="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-6 text-muted transition hover:bg-surface-sunken hover:text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
              aria-label="Hide value"
              title="Hide value"
              @click="reveal(false)"
            >
              <EyeOff class="size-3.5" aria-hidden="true" />
            </button>
          </template>
        </AcCodeEditor>
      </section>
    </div>
  </div>
</template>
