import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";

// Every colour is a theme variable, so the editor follows `.dark` without being told.
// Names are written out in full: Tailwind only emits the theme variables it finds in the source.

export const editorTheme = EditorView.theme({
  "&": { color: "var(--color-body)", backgroundColor: "var(--color-surface)", fontSize: "12px", height: "100%" },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": {
    fontFamily: "var(--font-mono)",
    lineHeight: "20px",
    overflow: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "var(--color-slate-70) transparent",
  },
  ".cm-content": { padding: "8px 0", caretColor: "var(--color-heading)" },
  ".cm-line": { padding: "0 16px 0 8px" },
  ".cm-cursor, .cm-dropCursor": { borderLeftColor: "var(--color-heading)", borderLeftWidth: "1.5px" },
  ".cm-selectionBackground, &.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-content ::selection":
    { backgroundColor: "hsl(var(--primary-hue) 70% 50% / 0.2)" },
  ".cm-activeLine": { backgroundColor: "color-mix(in oklab, var(--color-slate-50) 7%, transparent)" },
  ".cm-placeholder": { color: "var(--color-muted)" },

  ".cm-gutters": { backgroundColor: "var(--color-surface-muted)", color: "var(--color-muted)", borderRight: "1px solid var(--color-border-light)" },
  ".cm-lineNumbers .cm-gutterElement": { minWidth: "36px", padding: "0 8px 0 12px" },
  ".cm-activeLineGutter": { backgroundColor: "transparent", color: "var(--color-heading)" },
  ".cm-foldGutter .cm-gutterElement": { width: "14px", color: "var(--color-muted)", cursor: "pointer" },
  ".cm-foldGutter .cm-gutterElement:hover": { color: "var(--color-heading)" },
  ".cm-foldPlaceholder": {
    backgroundColor: "var(--color-surface-sunken)",
    border: "none",
    borderRadius: "4px",
    color: "var(--color-muted)",
    padding: "0 4px",
    margin: "0 2px",
  },

  ".cm-matchingBracket, &.cm-focused .cm-matchingBracket": { backgroundColor: "var(--color-primary-90)", color: "inherit", outline: "none" },
  ".cm-nonmatchingBracket": { backgroundColor: "var(--color-red-90)", color: "inherit" },
  ".cm-selectionMatch": { backgroundColor: "var(--color-blue-90)" },
  ".cm-searchMatch": { backgroundColor: "var(--color-yellow-90)", outline: "1px solid var(--color-yellow-70)", borderRadius: "2px" },
  ".cm-searchMatch.cm-searchMatch-selected": { backgroundColor: "var(--color-yellow-80)" },

  // search panel (Ctrl/Cmd-F)
  ".cm-panels": { backgroundColor: "var(--color-surface-muted)", color: "var(--color-body)" },
  ".cm-panels.cm-panels-top": { borderBottom: "1px solid var(--color-border-light)" },
  ".cm-panels.cm-panels-bottom": { borderTop: "1px solid var(--color-border-light)" },
  ".cm-panel.cm-search": { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px", padding: "8px 36px 8px 12px", fontFamily: "var(--font-sans)", fontSize: "12px" },
  ".cm-panel.cm-search br": { display: "none" },
  ".cm-panel.cm-search label": { display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--color-label)", fontSize: "12px" },
  ".cm-panel.cm-search input[type=checkbox]": { accentColor: "var(--color-primary)", margin: "0" },
  ".cm-panel.cm-search [name=close]": {
    position: "absolute",
    top: "8px",
    right: "10px",
    width: "24px",
    height: "24px",
    borderRadius: "4px",
    color: "var(--color-muted)",
    fontSize: "16px",
    cursor: "pointer",
  },
  ".cm-panel.cm-search [name=close]:hover": { backgroundColor: "var(--color-surface-sunken)", color: "var(--color-heading)" },
  ".cm-textfield": {
    height: "28px",
    margin: "0",
    padding: "0 8px",
    border: "1px solid var(--color-border)",
    borderRadius: "6px",
    backgroundColor: "var(--color-surface)",
    color: "var(--color-heading)",
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
  },
  ".cm-textfield:focus": { outline: "none", borderColor: "var(--color-primary)", boxShadow: "0 0 0 3px var(--color-ring)" },
  ".cm-button": {
    height: "28px",
    margin: "0",
    padding: "0 10px",
    border: "1px solid var(--color-border)",
    borderRadius: "6px",
    backgroundColor: "var(--color-surface)",
    backgroundImage: "none",
    color: "var(--color-heading)",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
  },
  ".cm-button:hover": { borderColor: "var(--color-border-dark)" },
  ".cm-button:active": { backgroundImage: "none", backgroundColor: "var(--color-surface-sunken)" },
  ".cm-button:focus-visible, .cm-panel.cm-search [name=close]:focus-visible": { outline: "none", boxShadow: "0 0 0 3px var(--color-ring)" },

  // lint
  ".cm-lintRange-error": { backgroundImage: "none", textDecoration: "underline wavy var(--color-red-50)", textDecorationSkipInk: "none", textUnderlineOffset: "3px" },
  ".cm-lintRange-warning": { backgroundImage: "none", textDecoration: "underline wavy var(--color-yellow-50)", textDecorationSkipInk: "none", textUnderlineOffset: "3px" },
  ".cm-lintPoint:after": { borderBottomColor: "var(--color-red-50)" },
  ".cm-tooltip": {
    backgroundColor: "var(--color-surface)",
    color: "var(--color-body)",
    border: "1px solid var(--color-border)",
    borderRadius: "6px",
    boxShadow: "var(--shadow-md)",
    overflow: "hidden",
  },
  ".cm-tooltip-lint": { padding: "0" },
  ".cm-diagnostic": { padding: "6px 10px", fontFamily: "var(--font-sans)", fontSize: "12px", lineHeight: "16px", borderLeftWidth: "3px" },
  ".cm-diagnostic-error": { borderLeftColor: "var(--color-red-50)" },
  ".cm-diagnostic-warning": { borderLeftColor: "var(--color-yellow-50)" },
  ".cm-diagnosticSource": { display: "none" },
  ".cm-panel.cm-panel-lint ul [aria-selected]": { backgroundColor: "var(--color-surface-sunken)", color: "var(--color-heading)" },
  ".cm-panel.cm-panel-lint ul:focus [aria-selected]": { backgroundColor: "var(--color-primary-90)", color: "var(--color-heading)" },

  // diff (the Changes view)
  ".cm-insertedLine, &.cm-merge-b .cm-changedLine, .cm-inlineChangedLine": { backgroundColor: "var(--color-green-97)" },
  ".cm-deletedChunk, &.cm-merge-a .cm-changedLine": { backgroundColor: "var(--color-red-97)" },
  // Lines up deleted text with the .cm-line padding above.
  ".cm-deletedChunk": { paddingLeft: "8px" },
  "&.cm-merge-b .cm-changedText, .cm-insertedLine .cm-changedText": { backgroundColor: "var(--color-green-90)", backgroundImage: "none" },
  ".cm-deletedChunk .cm-deletedText, &.cm-merge-a .cm-changedText": { backgroundColor: "var(--color-red-90)", backgroundImage: "none" },
  ".cm-deletedChunk del, .cm-deletedLine del": { textDecoration: "none" },
  ".cm-changedLineGutter, &.cm-merge-b .cm-changedLineGutter": { backgroundColor: "var(--color-green-50)" },
  ".cm-deletedLineGutter, &.cm-merge-a .cm-changedLineGutter": { backgroundColor: "var(--color-red-50)" },
  ".cm-collapsedLines": {
    backgroundColor: "var(--color-surface-muted)",
    backgroundImage: "none",
    color: "var(--color-muted)",
    fontFamily: "var(--font-sans)",
    fontSize: "12px",
    padding: "4px 12px",
    borderBlock: "1px solid var(--color-border-light)",
  },
  ".cm-collapsedLines:hover": { backgroundColor: "var(--color-surface-sunken)", color: "var(--color-heading)" },
});

export const editorHighlight = syntaxHighlighting(
  HighlightStyle.define([
    { tag: [t.propertyName, t.definition(t.propertyName)], color: "var(--color-blue-40)" },
    { tag: [t.string, t.special(t.string)], color: "var(--color-green-30)" },
    // YAML's plain scalars; its parser doesn't tell numbers and booleans apart from text.
    { tag: [t.content, t.attributeValue], color: "var(--color-heading)" },
    { tag: [t.number, t.bool, t.null, t.atom], color: "var(--color-purple-50)" },
    { tag: [t.keyword, t.controlKeyword, t.operatorKeyword, t.modifier], color: "var(--color-purple-40)" },
    { tag: [t.variableName, t.special(t.variableName)], color: "var(--color-yellow-30)" },
    { tag: [t.labelName, t.typeName, t.meta, t.processingInstruction], color: "var(--color-red-40)" },
    { tag: [t.comment, t.lineComment, t.blockComment], color: "var(--color-slate-60)", fontStyle: "italic" },
    { tag: [t.punctuation, t.separator, t.bracket, t.squareBracket, t.brace, t.operator], color: "var(--color-slate-50)" },
    { tag: t.invalid, color: "var(--color-red-40)" },
  ]),
);

// CodeMirror's built-in labels are lower case; these match the rest of the system.
export const editorPhrases = EditorState.phrases.of({
  next: "Next",
  previous: "Previous",
  all: "All",
  "match case": "Match case",
  regexp: "Regex",
  "by word": "Whole word",
  replace: "Replace",
  "replace all": "Replace all",
  close: "Close",
  "current match": "Current match",
  "on line": "on line",
  "Folded lines": "Folded lines",
  "Unfolded lines": "Unfolded lines",
  "Fold line": "Fold line",
  "Unfold line": "Unfold line",
});
