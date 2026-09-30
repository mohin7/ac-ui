import type { Diagnostic } from "@codemirror/lint";
import type { Text } from "@codemirror/state";
import type { ErrorObject, ValidateFunction } from "ajv";
import { isMap, isScalar, isSeq, parseAllDocuments, type Document } from "yaml";

export type EditorLanguage = "yaml" | "json" | "shell" | "text";

export interface EditorProblem {
  /** 1-based line of the problem. */
  line: number;
  /** 1-based column. */
  column: number;
  message: string;
  severity: "error" | "warning";
  /** `syntax` for text that doesn't parse, `schema` for valid text that breaks the JSON Schema. */
  source: "syntax" | "schema";
  /** Document offsets, for jumping to the problem. */
  from: number;
  to: number;
}

type Range = [number, number];

// Ajv is ~120 KB, so it's only fetched once an editor has a schema.
let ajv: Promise<{ compile(schema: object): ValidateFunction }> | undefined;
const compiled = new WeakMap<object, ValidateFunction | null>();

async function validatorFor(schema: object) {
  if (compiled.has(schema)) return compiled.get(schema)!;
  ajv ??= import("ajv").then(({ default: Ajv }) => new Ajv({ allErrors: true, strict: false }));
  let fn: ValidateFunction | null = null;
  try {
    fn = (await ajv).compile(schema);
  } catch (e) {
    console.warn("AcCodeEditor: the schema doesn't compile, so only syntax is checked.", e);
  }
  compiled.set(schema, fn);
  return fn;
}

function jsonSyntaxError(text: string): Diagnostic | null {
  try {
    JSON.parse(text);
    return null;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    const at = message.match(/at position (\d+)/);
    const lineCol = message.match(/line (\d+) column (\d+)/);
    let from = text.length;
    if (at) from = Number(at[1]);
    else if (lineCol) {
      const lines = text.split("\n").slice(0, Number(lineCol[1]) - 1);
      from = lines.reduce((n, l) => n + l.length + 1, 0) + Number(lineCol[2]) - 1;
    }
    from = Math.min(from, text.length);
    return { from, to: Math.min(from + 1, text.length), severity: "error", message: message.replace(/^JSON\.parse: /, "") };
  }
}

function rangeOf(node: unknown): Range | undefined {
  const range = (node as { range?: [number, number, number] } | null)?.range;
  return range ? [range[0], range[1]] : undefined;
}

/** Where an Ajv instance path points in the source: a scalar's value, or the key that opens a map or list. */
function locate(doc: Document, path: string[], preferKey: boolean): Range | undefined {
  let node: unknown = doc.contents;
  let best = rangeOf(node);
  for (const segment of path) {
    if (isMap(node)) {
      const pair = node.items.find((p) => String(isScalar(p.key) ? p.key.value : p.key) === segment);
      if (!pair) break;
      best = rangeOf(pair.key) ?? best;
      node = pair.value;
    } else if (isSeq(node)) {
      const item = node.items[Number(segment)];
      if (item === undefined) break;
      best = rangeOf(item) ?? best;
      node = item;
    } else break;
  }
  if (!preferKey && isScalar(node)) return rangeOf(node) ?? best;
  return best;
}

const unescapePointer = (s: string) => s.replace(/~1/g, "/").replace(/~0/g, "~");

function describe(error: ErrorObject) {
  const path = error.instancePath.split("/").slice(1).map(unescapePointer);
  const at = path.length ? `${path.join(".")}: ` : "";
  const params = error.params as Record<string, unknown>;
  switch (error.keyword) {
    case "required":
      return { path, preferKey: true, message: `${at}missing required field "${params.missingProperty}"` };
    case "additionalProperties":
      return { path: [...path, String(params.additionalProperty)], preferKey: true, message: `${at}unknown field "${params.additionalProperty}"` };
    case "enum":
      return { path, preferKey: false, message: `${at}must be one of ${(params.allowedValues as unknown[]).map((v) => JSON.stringify(v)).join(", ")}` };
    default:
      return { path, preferKey: false, message: `${at}${error.message ?? "is invalid"}` };
  }
}

/** Syntax problems, then JSON Schema problems for every document that parses. */
export async function checkDocument(text: string, language: EditorLanguage, schema?: object): Promise<Diagnostic[]> {
  if ((language !== "yaml" && language !== "json") || !text.trim()) return [];

  const diagnostics: Diagnostic[] = [];
  if (language === "json") {
    const error = jsonSyntaxError(text);
    if (error) return [error];
  }

  // JSON is valid YAML, so one parser gives source ranges for both languages.
  const docs = parseAllDocuments(text, { prettyErrors: false });

  for (const doc of docs) {
    // After the first syntax error the parser reports every following line too, so only the first is useful.
    const error = doc.errors[0];
    if (error) diagnostics.push({ from: error.pos[0], to: Math.max(error.pos[1], error.pos[0] + 1), severity: "error", message: error.message.split("\n")[0]! });
    for (const warning of doc.warnings) {
      diagnostics.push({ from: warning.pos[0], to: Math.max(warning.pos[1], warning.pos[0] + 1), severity: "warning", message: warning.message.split("\n")[0]! });
    }
  }
  if (!schema || diagnostics.some((d) => d.severity === "error")) return diagnostics;

  const validate = await validatorFor(schema);
  if (!validate) return diagnostics;
  for (const doc of docs) {
    if (doc.contents === null) continue;
    if (validate(doc.toJS())) continue;
    for (const error of validate.errors ?? []) {
      const { path, preferKey, message } = describe(error);
      const [from, to] = locate(doc, path, preferKey) ?? [0, 0];
      diagnostics.push({ from, to: Math.max(to, from + 1), severity: "error", message, source: "schema" });
    }
  }
  return diagnostics;
}

export function toProblems(diagnostics: readonly Diagnostic[], doc: Text): EditorProblem[] {
  return diagnostics.map((d) => {
    const from = Math.min(d.from, doc.length);
    const line = doc.lineAt(from);
    return {
      line: line.number,
      column: from - line.from + 1,
      message: d.message,
      severity: d.severity === "warning" ? "warning" : "error",
      source: d.source === "schema" ? "schema" : "syntax",
      from,
      to: Math.min(d.to, doc.length),
    };
  });
}
