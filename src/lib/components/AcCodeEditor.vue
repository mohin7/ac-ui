<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, useId, useSlots, watch } from "vue";
import { Check, CircleAlert, Copy, TriangleAlert } from "@lucide/vue";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap, indentWithTab, simplifySelection, temporarilySetTabFocusMode } from "@codemirror/commands";
import { json } from "@codemirror/lang-json";
import { yaml } from "@codemirror/lang-yaml";
import { bracketMatching, foldGutter, foldKeymap, indentOnInput, indentUnit, StreamLanguage } from "@codemirror/language";
import { shell } from "@codemirror/legacy-modes/mode/shell";
import { linter, lintGutter, lintKeymap } from "@codemirror/lint";
import type { MergeView } from "@codemirror/merge";
import { highlightSelectionMatches, search, searchKeymap } from "@codemirror/search";
import { Compartment, EditorState, Text, type Extension } from "@codemirror/state";
import {
  drawSelection,
  dropCursor,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers as lineNumberGutter,
  placeholder as placeholderText,
  type KeyBinding,
} from "@codemirror/view";
import AcSegmentedControl from "./AcSegmentedControl.vue";
import { editorHighlight, editorPhrases, editorTheme } from "../editor/theme";
import type { EditorLanguage, EditorProblem } from "../editor/validate";

export interface Props {
  /** `yaml`, `json`, `shell` for install scripts, or `text` for plain text. */
  language?: EditorLanguage;
  /** The saved version to compare against. Adds an Edit / Changes switch; with `readonly` only the diff shows. */
  original?: string;
  /** Text can be selected, searched and copied but not changed. */
  readonly?: boolean;
  /** Any CSS height, e.g. `320px` or `60vh`. `auto` grows with the content up to `max-height`. */
  height?: string;
  /** Where an `auto` editor stops growing and scrolls. */
  maxHeight?: string;
  /** JSON Schema that YAML or JSON is checked against, e.g. a CRD's `openAPIV3Schema`. */
  schema?: object;
  /** Checks YAML and JSON as you type and underlines problems. Turn off for templates that aren't valid until rendered. */
  validate?: boolean;
  /** Wraps long lines instead of scrolling sideways. */
  wrap?: boolean;
  /** Shows the line-number and fold gutter. */
  lineNumbers?: boolean;
  /** Text shown while the editor is empty. */
  placeholder?: string;
  /** Header text, usually the file name. */
  title?: string;
  /** Adds a copy button to the header. */
  copyable?: boolean;
  /** `unified` shows changes in one column; `split` puts the saved version on the left. */
  diffLayout?: "unified" | "split";
  /** Accessible name for the text area when there's no `title`, e.g. "Custom values". */
  label?: string;
  /** Draws the border and rounded corners. Turn off inside a card or modal body that has its own. */
  bordered?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  language: "yaml",
  original: undefined,
  readonly: false,
  height: "320px",
  maxHeight: undefined,
  schema: undefined,
  validate: true,
  wrap: true,
  lineNumbers: true,
  placeholder: "",
  title: "",
  copyable: false,
  diffLayout: "unified",
  label: "",
  bordered: true,
});

const model = defineModel<string>({ default: "" });
/** Which pane shows when `original` is set: `edit` or `changes`. */
const view = defineModel<"edit" | "changes">("view", { default: "edit" });

const emit = defineEmits<{
  /** Fires after each check with every problem found; an empty list means the text is valid. */
  validate: [problems: EditorProblem[]];
  focus: [];
  blur: [];
}>();

defineSlots<{
  /** Buttons at the right of the header, e.g. a YAML/JSON switch or Reset. */
  actions?: () => unknown;
}>();

const slots = useSlots();

// Loaded on first use: the diff only when `original` is set, the YAML parser at the first check.
let mergeModule: Promise<typeof import("@codemirror/merge")> | undefined;
const loadMerge = () => (mergeModule ??= import("@codemirror/merge"));
let validateModule: Promise<typeof import("../editor/validate")> | undefined;
const loadValidate = () => (validateModule ??= import("../editor/validate"));

const LANGUAGE_NAMES: Record<EditorLanguage, string> = { yaml: "YAML", json: "JSON", shell: "Shell", text: "Text" };
const DIFF_CONTEXT = { margin: 3, minSize: 6 };

const host = ref<HTMLElement>();
const diffHost = ref<HTMLElement>();
const editor = shallowRef<EditorView>();
let diff: EditorView | MergeView | undefined;
const problems = ref<EditorProblem[]>([]);
const changeCount = ref(0);
const copied = ref(false);
const problemsId = useId();

const showTabs = computed(() => props.original !== undefined && !props.readonly);
const diffOnly = computed(() => props.original !== undefined && props.readonly);
const showingChanges = computed(() => diffOnly.value || (showTabs.value && view.value === "changes"));
const hasHeader = computed(() => !!props.title || props.copyable || showTabs.value || diffOnly.value || !!slots.actions);
const checks = computed(() => props.validate && (props.language === "yaml" || props.language === "json"));
const accessibleName = computed(() => props.label || props.title || `${LANGUAGE_NAMES[props.language]} editor`);
const errorCount = computed(() => problems.value.filter((p) => p.severity === "error").length);
const viewOptions = computed(() => [
  { value: "edit" as const, label: "Edit" },
  { value: "changes" as const, label: changeCount.value ? `Changes · ${changeCount.value}` : "Changes" },
]);
const frameStyle = computed(() => ({
  height: props.height === "auto" ? undefined : props.height,
  maxHeight: props.maxHeight,
}));

const compartments = {
  language: new Compartment(),
  readonly: new Compartment(),
  wrap: new Compartment(),
  gutters: new Compartment(),
  lint: new Compartment(),
  placeholder: new Compartment(),
  attributes: new Compartment(),
};

function languageExtension(): Extension {
  if (props.language === "yaml") return yaml();
  if (props.language === "json") return json();
  if (props.language === "shell") return StreamLanguage.define(shell);
  return [];
}

function gutterExtension(): Extension {
  if (!props.lineNumbers) return [];
  return [lineNumberGutter(), foldGutter({ openText: "▾", closedText: "▸" }), highlightActiveLineGutter()];
}

function setProblems(next: EditorProblem[]) {
  if (JSON.stringify(next) === JSON.stringify(problems.value)) return;
  problems.value = next;
  emit("validate", next);
}

function lintExtension(): Extension {
  if (!checks.value) {
    setProblems([]);
    return [];
  }
  return [
    lintGutter(),
    linter(
      async (v) => {
        const text = v.state.doc.toString();
        const { checkDocument, toProblems } = await loadValidate();
        const diagnostics = await checkDocument(text, props.language, props.schema);
        // A slow schema check can finish after more typing; only report results for the current text.
        if (editor.value?.state.doc.toString() === text) setProblems(toProblems(diagnostics, v.state.doc));
        return diagnostics;
      },
      { delay: 300 },
    ),
  ];
}

function attributesExtension(): Extension {
  return EditorView.contentAttributes.of({
    "aria-label": accessibleName.value,
    ...(props.readonly ? { "aria-readonly": "true" } : {}),
    ...(errorCount.value ? { "aria-invalid": "true", "aria-describedby": problemsId } : {}),
  });
}

let lastEscape = 0;
// Tab indents, so Escape then Tab is the keyboard way out. A second Escape is left for an enclosing modal.
const escapeToLeave: KeyBinding = {
  key: "Escape",
  run: (v) => {
    const now = Date.now();
    if (now - lastEscape < 2000) return false;
    lastEscape = now;
    simplifySelection(v);
    return temporarilySetTabFocusMode(v);
  },
};

function createEditor() {
  editor.value = new EditorView({
    parent: host.value!,
    state: EditorState.create({
      doc: model.value,
      extensions: [
        editorTheme,
        editorHighlight,
        editorPhrases,
        history(),
        drawSelection(),
        dropCursor(),
        indentOnInput(),
        indentUnit.of("  "),
        EditorState.tabSize.of(2),
        bracketMatching(),
        closeBrackets(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        search({ top: true }),
        keymap.of([
          ...closeBracketsKeymap,
          ...searchKeymap,
          ...foldKeymap,
          ...lintKeymap,
          escapeToLeave,
          indentWithTab,
          ...historyKeymap,
          ...defaultKeymap,
        ]),
        compartments.language.of(languageExtension()),
        compartments.readonly.of(EditorState.readOnly.of(props.readonly)),
        compartments.wrap.of(props.wrap ? EditorView.lineWrapping : []),
        compartments.gutters.of(gutterExtension()),
        compartments.lint.of(lintExtension()),
        compartments.placeholder.of(props.placeholder ? placeholderText(props.placeholder) : []),
        compartments.attributes.of(attributesExtension()),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) model.value = update.state.doc.toString();
          if (update.focusChanged && update.view.hasFocus) emit("focus");
          else if (update.focusChanged) emit("blur");
        }),
      ],
    }),
  });
}

function reconfigure(compartment: Compartment, extension: Extension) {
  editor.value?.dispatch({ effects: compartment.reconfigure(extension) });
}

function diffExtensions(label: string): Extension[] {
  return [
    editorTheme,
    editorHighlight,
    languageExtension(),
    EditorState.readOnly.of(true),
    EditorState.tabSize.of(2),
    props.wrap ? EditorView.lineWrapping : [],
    props.lineNumbers ? lineNumberGutter() : [],
    EditorView.contentAttributes.of({ "aria-label": label, "aria-readonly": "true" }),
  ];
}

function destroyDiff() {
  diffRequest++;
  diff?.destroy();
  diff = undefined;
}

let diffRequest = 0;
async function createDiff() {
  const request = ++diffRequest;
  const { MergeView, unifiedMergeView } = await loadMerge();
  // A newer request, or leaving the Changes pane, wins over this one.
  if (request !== diffRequest || !showingChanges.value) return;
  destroyDiff();
  if (!diffHost.value) return;
  const original = props.original ?? "";
  if (props.diffLayout === "split") {
    diff = new MergeView({
      parent: diffHost.value,
      a: { doc: original, extensions: diffExtensions(`Saved version of ${accessibleName.value}`) },
      b: { doc: model.value, extensions: diffExtensions(`Changed version of ${accessibleName.value}`) },
      gutter: true,
      highlightChanges: true,
      collapseUnchanged: DIFF_CONTEXT,
    });
    return;
  }
  diff = new EditorView({
    parent: diffHost.value,
    doc: model.value,
    extensions: [
      diffExtensions(`Changes to ${accessibleName.value}`),
      unifiedMergeView({ original, mergeControls: false, gutter: true, highlightChanges: true, syntaxHighlightDeletions: true, collapseUnchanged: DIFF_CONTEXT }),
    ],
  });
}

let countTimer: ReturnType<typeof setTimeout> | undefined;
function countChanges() {
  clearTimeout(countTimer);
  if (props.original === undefined) {
    changeCount.value = 0;
    return;
  }
  countTimer = setTimeout(async () => {
    const { Chunk } = await loadMerge();
    if (props.original === undefined) return;
    changeCount.value = Chunk.build(Text.of(props.original.split("\n")), Text.of(model.value.split("\n"))).length;
  }, 250);
}

function focus() {
  editor.value?.focus();
}

function goTo(problem: EditorProblem) {
  const v = editor.value;
  if (!v) return;
  v.dispatch({ selection: { anchor: problem.from, head: problem.to }, scrollIntoView: true });
  v.focus();
}

let copiedTimer: ReturnType<typeof setTimeout> | undefined;
async function copy() {
  try {
    await navigator.clipboard.writeText(model.value);
    copied.value = true;
    clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => (copied.value = false), 1500);
  } catch {
    // clipboard blocked (insecure origin or denied permission)
  }
}

watch(model, (value) => {
  const v = editor.value;
  if (v && value !== v.state.doc.toString()) v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: value } });
});
watch(() => props.language, () => reconfigure(compartments.language, languageExtension()));
watch(() => props.readonly, (readonly) => reconfigure(compartments.readonly, EditorState.readOnly.of(readonly)));
watch(() => props.wrap, (wrap) => reconfigure(compartments.wrap, wrap ? EditorView.lineWrapping : []));
watch(() => props.lineNumbers, () => reconfigure(compartments.gutters, gutterExtension()));
watch(() => props.placeholder, (text) => reconfigure(compartments.placeholder, text ? placeholderText(text) : []));
watch([() => props.language, () => props.schema, () => props.validate], () => reconfigure(compartments.lint, lintExtension()));
watch([accessibleName, () => props.readonly, errorCount], () => reconfigure(compartments.attributes, attributesExtension()));
watch([() => props.original, model], countChanges, { immediate: true });
watch(
  [showingChanges, () => props.diffLayout, () => props.original, () => props.language, () => props.wrap],
  async ([showing]) => {
    if (!showing) return destroyDiff();
    await nextTick();
    createDiff();
  },
);
// The Changes pane is read-only, so the model only changes there when the parent sets it.
watch(model, () => showingChanges.value && createDiff());

onMounted(() => {
  createEditor();
  if (showingChanges.value) createDiff();
});

onBeforeUnmount(() => {
  clearTimeout(countTimer);
  clearTimeout(copiedTimer);
  destroyDiff();
  editor.value?.destroy();
});

defineExpose({
  /** Moves the cursor into the editor. */
  focus,
  /** The CodeMirror `EditorView`, for anything the props don't cover. */
  editor,
});
</script>

<template>
  <div
    class="flex min-w-0 flex-col overflow-hidden bg-surface"
    :class="bordered && 'rounded-10 border border-border shadow-xs transition-[border-color,box-shadow] has-[.cm-editor.cm-focused]:focus-ring'"
    data-ac-ds
    data-testid="ac-code-editor"
  >
    <div v-if="hasHeader" class="flex min-h-11 flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-border-light px-3 py-2">
      <span v-if="title" class="min-w-0 truncate font-mono text-xs font-medium text-heading">{{ title }}</span>
      <span v-if="language !== 'text'" class="rounded-4 bg-surface-sunken px-1.5 text-sm leading-5 font-medium text-muted">
        {{ LANGUAGE_NAMES[language] }}
      </span>
      <span v-if="diffOnly" class="text-xs text-muted">
        {{ changeCount ? `${changeCount} ${changeCount === 1 ? "change" : "changes"}` : "No changes" }}
      </span>
      <div class="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-2">
        <slot name="actions" />
        <AcSegmentedControl v-if="showTabs" v-model="view" :options="viewOptions" size="small" label="Editor view" />
        <button
          v-if="copyable"
          type="button"
          class="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-6 text-muted transition hover:bg-surface-sunken hover:text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
          :aria-label="copied ? 'Copied' : 'Copy to clipboard'"
          :title="copied ? 'Copied' : 'Copy'"
          @click="copy"
        >
          <Check v-if="copied" class="size-3.5 text-success" aria-hidden="true" />
          <Copy v-else class="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>

    <div
      v-show="!showingChanges"
      ref="host"
      class="min-h-0 flex-auto [&>.cm-editor]:max-h-[inherit]"
      :class="height === 'auto' && 'min-h-20'"
      :style="frameStyle"
    />
    <div
      v-if="showingChanges"
      ref="diffHost"
      class="min-h-0 flex-auto overflow-auto [&_.cm-mergeView]:h-full [&>.cm-editor]:max-h-[inherit]"
      :style="frameStyle"
    />

    <div v-if="problems.length && !showingChanges" :id="problemsId" class="border-t border-border-light bg-surface-muted">
      <p class="sr-only" aria-live="polite">{{ problems.length }} {{ problems.length === 1 ? "problem" : "problems" }}</p>
      <ul class="ac-scrollbar max-h-[calc(92px*var(--ac-scale))] py-1">
        <li v-for="(problem, i) in problems" :key="i">
          <button
            type="button"
            class="flex w-full cursor-pointer items-start gap-2 px-3 py-1 text-left text-xs leading-5 text-body hover:bg-surface-sunken focus-visible:bg-surface-sunken focus-visible:outline-none"
            @click="goTo(problem)"
          >
            <component
              :is="problem.severity === 'error' ? CircleAlert : TriangleAlert"
              class="mt-0.75 size-3.5 shrink-0"
              :class="problem.severity === 'error' ? 'text-red-50' : 'text-yellow-50'"
              aria-hidden="true"
            />
            <span class="shrink-0 font-mono text-muted">Ln {{ problem.line }}, Col {{ problem.column }}</span>
            <span class="min-w-0 [overflow-wrap:anywhere]">{{ problem.message }}</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
