<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { ChevronDown } from "lucide-vue-next";
import CodeBlock from "./CodeBlock.vue";

export interface Control {
  prop: string;
  type: "select" | "boolean" | "text";
  options?: (string | number)[];
}

const props = withDefaults(
  defineProps<{
    /** The component to render. */
    // `object` rather than Component so generic SFCs such as AcTable are accepted.
    component: object;
    /** Tag used in the generated code, e.g. "AcButton". */
    tag: string;
    controls: Control[];
    /** Starting values for the controls. */
    initial?: Record<string, unknown>;
    /** The component's defaults: values equal to these are left out of the code. */
    defaults?: Record<string, unknown>;
    /** Default-slot text. */
    slotText?: string;
    /** Extra props passed to the component but not controlled (arrays, objects). */
    extra?: Record<string, unknown>;
    /** How the extra props appear in the code, e.g. ':options="options"'. */
    extraCode?: string;
    /** A `script setup` body shown above the template in the code. */
    script?: string;
    /** Module the component is imported from in the code. */
    importFrom?: string;
  }>(),
  { initial: () => ({}), defaults: () => ({}), slotText: "", extra: () => ({}), extraCode: "", script: "", importFrom: "@/lib" },
);

const state = reactive<Record<string, unknown>>({ ...props.initial });

// When `extra` carries a modelValue, the playground owns it so v-model components stay interactive.
const hasModel = "modelValue" in props.extra;
const model = ref(props.extra.modelValue);
const bound = computed(() => ({
  ...props.extra,
  ...state,
  ...(hasModel ? { modelValue: model.value, "onUpdate:modelValue": (v: unknown) => (model.value = v) } : {}),
}));

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

const code = computed(() => {
  const attrs: string[] = [];
  for (const c of props.controls) {
    const v = state[c.prop];
    if (v === undefined || v === "" || v === props.defaults[c.prop]) continue;
    if (v === true) attrs.push(kebab(c.prop));
    else if (v === false) attrs.push(`:${kebab(c.prop)}="false"`);
    else if (typeof v === "number") attrs.push(`:${kebab(c.prop)}="${v}"`);
    else attrs.push(`${kebab(c.prop)}="${String(v)}"`);
  }
  if (props.extraCode) attrs.push(props.extraCode);
  const open = `<${props.tag}${attrs.length ? " " + attrs.join(" ") : ""}`;
  const tpl = props.slotText ? `${open}>${props.slotText}</${props.tag}>` : `${open} />`;
  const imports = `import { ${props.tag} } from "${props.importFrom}";`;
  const script = `${"<"}script setup lang="ts">\n${imports}\n${props.script ? props.script.trim() + "\n" : ""}</` + `script>\n\n`;
  return `${script}<template>\n  ${tpl}\n</template>`;
});
</script>

<template>
  <div class="mt-4 mb-8 overflow-hidden rounded-12 border border-border bg-surface shadow-xs">
    <div v-if="controls.length" class="flex flex-wrap items-center gap-x-5 gap-y-2.5 border-b border-border bg-surface px-4 py-3">
      <label v-for="c in controls" :key="c.prop" class="inline-flex items-center gap-2 text-xs">
        <span class="font-mono text-[11.5px] text-muted">{{ c.prop }}</span>
        <span v-if="c.type === 'select'" class="relative">
          <select
            v-model="state[c.prop]"
            class="h-7 cursor-pointer appearance-none rounded-6 border border-border bg-surface pr-7 pl-2.5 text-xs font-medium text-heading shadow-xs transition hover:border-border-dark focus:focus-ring"
          >
            <option v-for="o in c.options" :key="o" :value="o">{{ o }}</option>
          </select>
          <ChevronDown class="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
        </span>
        <input
          v-else-if="c.type === 'boolean'"
          v-model="state[c.prop]"
          type="checkbox"
          class="size-3.5 cursor-pointer accent-primary"
        />
        <input
          v-else
          v-model="state[c.prop]"
          type="text"
          class="h-7 w-36 rounded-6 border border-border bg-surface px-2.5 text-xs text-heading shadow-xs transition hover:border-border-dark focus:focus-ring"
        />
      </label>
    </div>
    <div class="preview-canvas flex min-h-40 items-center justify-center px-6 py-10 sm:px-10">
      <component :is="component" v-bind="bound">
        <template v-if="slotText">{{ slotText }}</template>
      </component>
    </div>
    <div class="border-t border-border">
      <CodeBlock :code="code" flush />
    </div>
  </div>
</template>
