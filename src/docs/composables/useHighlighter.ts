import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

let highlighter: Promise<HighlighterCore> | undefined;

// One shared Shiki instance, loaded on first use, with only the languages the docs show.
export function getHighlighter() {
  highlighter ??= createHighlighterCore({
    themes: [import("shiki/themes/vitesse-light.mjs")],
    langs: [
      import("shiki/langs/vue.mjs"),
      import("shiki/langs/typescript.mjs"),
      import("shiki/langs/css.mjs"),
      import("shiki/langs/html.mjs"),
      import("shiki/langs/bash.mjs"),
      import("shiki/langs/json.mjs"),
    ],
    engine: createJavaScriptRegexEngine(),
  });
  return highlighter;
}

export async function highlight(code: string, lang: string) {
  const h = await getHighlighter();
  return h.codeToHtml(code, { lang, theme: "vitesse-light" });
}
