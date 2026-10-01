// A separate entry (`@appscode/design-system/editor`) so apps that never show an editor don't bundle CodeMirror.
export { default as AcCodeEditor } from "../components/AcCodeEditor.vue";
export { default as AcFileEditor } from "../components/AcFileEditor.vue";
export type { EditorFile } from "../components/AcFileEditor.vue";
export type { EditorLanguage, EditorProblem } from "./validate";
