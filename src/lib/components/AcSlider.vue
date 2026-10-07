<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { CircleAlert } from "@lucide/vue";

export interface SliderMark {
  /** Where the mark sits, between `min` and `max`. */
  value: number;
  /** Text under the mark. Defaults to the value with its unit. */
  label?: string;
}

export interface Props {
  /** Label above the slider. It also names the thumbs for screen readers, so set it even when the context seems obvious. */
  label?: string;
  /** A second line under the label, like the old `subtitle`: what the value controls. */
  description?: string;
  /** Smallest value. */
  min?: number;
  /** Largest value. */
  max?: number;
  /** Distance between allowed values. Decimals such as `0.5` work. */
  step?: number;
  /** Two thumbs; `v-model` becomes `[from, to]`. The thumbs can meet but not cross. */
  range?: boolean;
  /** Ticks with labels under the track. Pass numbers, or `{ value, label }` for custom text. Clicking a label jumps there. */
  marks?: (number | SliderMark)[];
  /** Unit shown after every value, e.g. `%` or `GiB`. Words get a space before them; symbols don't. */
  unit?: string;
  /** Formats a value for the bubble, marks, header and `aria-valuetext`. Overrides `unit`. */
  formatValue?: (value: number) => string;
  /** Adds a number input for typing an exact value (two for `range`). */
  showInput?: boolean;
  /** Value bubble over the thumb: `auto` on hover, focus and drag; `always`; or `never`. */
  tooltip?: "auto" | "always" | "never";
  /** Disables the slider and its inputs. */
  disabled?: boolean;
  /** Adds a red asterisk to the label. */
  required?: boolean;
  /** Error text under the slider. Turns the track red and sets `aria-invalid`. */
  errorMsg?: string;
  /** Helper text under the slider (hidden while `errorMsg` is set). */
  hint?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  description: "",
  min: 0,
  max: 100,
  step: 1,
  range: false,
  marks: () => [],
  unit: "",
  formatValue: undefined,
  showInput: false,
  tooltip: "auto",
  disabled: false,
  required: false,
  errorMsg: "",
  hint: "",
});

/** The value: a number, or `[from, to]` with `range`. Out-of-range values are shown clamped. */
const model = defineModel<number | [number, number] | null>({ default: null });

const emit = defineEmits<{
  /** Fires once the viewer settles on a value: drag released, key pressed or input committed. Use it for API calls instead of `update:modelValue`. */
  change: [value: number | [number, number]];
}>();

const id = useId();
const labelId = `${id}-label`;
const msgId = `${id}-msg`;
const track = ref<HTMLElement | null>(null);
const thumbs = ref<HTMLElement[]>([]);
const dragging = ref<number | null>(null);

const span = computed(() => Math.max(props.max - props.min, Number.EPSILON));
const decimals = computed(() => Math.max(countDecimals(props.step), countDecimals(props.min)));
const bigStep = computed(() => Math.max(props.step, Math.round(span.value / 10 / props.step) * props.step));

const values = computed<number[]>(() => {
  const v = model.value;
  if (props.range) {
    const [a, b] = Array.isArray(v) ? v : [props.min, props.max];
    const lo = clamp(Math.min(a, b));
    const hi = clamp(Math.max(a, b));
    return [lo, hi];
  }
  return [clamp(typeof v === "number" ? v : Array.isArray(v) ? v[0] : props.min)];
});

const fill = computed(() =>
  props.range
    ? { left: `${percent(values.value[0]!)}%`, width: `${percent(values.value[1]!) - percent(values.value[0]!)}%` }
    : { left: "0%", width: `${percent(values.value[0]!)}%` },
);

const markList = computed(() =>
  props.marks
    .map((m) => (typeof m === "number" ? { value: m, label: format(m) } : { value: m.value, label: m.label ?? format(m.value) }))
    .filter((m) => m.value >= props.min && m.value <= props.max),
);

// Native spinners crowd a narrow input; arrow keys still step the value.
const numberInputClass =
  "h-9 rounded-6 border bg-surface px-2.5 text-base text-heading tabular-nums shadow-xs transition-[border-color,box-shadow] outline-none [appearance:textfield] disabled:cursor-not-allowed disabled:bg-surface-muted [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

const describedBy = computed(() => (props.errorMsg || props.hint ? msgId : undefined));

function countDecimals(n: number) {
  const s = String(n);
  return s.includes(".") ? s.split(".")[1]!.length : 0;
}

function clamp(v: number) {
  return Math.min(props.max, Math.max(props.min, Number.isFinite(v) ? v : props.min));
}

function snap(raw: number) {
  const stepped = Math.round((clamp(raw) - props.min) / props.step) * props.step + props.min;
  return clamp(Number(stepped.toFixed(decimals.value)));
}

function percent(v: number) {
  return ((v - props.min) / span.value) * 100;
}

function format(v: number) {
  if (props.formatValue) return props.formatValue(v);
  if (!props.unit) return String(v);
  return /^[a-z]/i.test(props.unit) ? `${v} ${props.unit}` : `${v}${props.unit}`;
}

function current(): number | [number, number] {
  return props.range ? [values.value[0]!, values.value[1]!] : values.value[0]!;
}

function thumbBounds(index: number) {
  if (!props.range) return { lo: props.min, hi: props.max };
  return index === 0 ? { lo: props.min, hi: values.value[1]! } : { lo: values.value[0]!, hi: props.max };
}

function setValue(index: number, raw: number) {
  const { lo, hi } = thumbBounds(index);
  const v = Math.min(hi, Math.max(lo, snap(raw)));
  if (!props.range) {
    if (v !== values.value[0]) model.value = v;
    return;
  }
  const next: [number, number] = [values.value[0]!, values.value[1]!];
  next[index] = v;
  if (next[0] !== values.value[0] || next[1] !== values.value[1] || !Array.isArray(model.value)) model.value = next;
}

function valueAt(clientX: number) {
  const r = track.value!.getBoundingClientRect();
  const ratio = r.width ? (clientX - r.left) / r.width : 0;
  return props.min + Math.min(1, Math.max(0, ratio)) * span.value;
}

function nearestThumb(v: number) {
  if (!props.range) return 0;
  const [a, b] = values.value as [number, number];
  if (a === b) return v < a ? 0 : 1;
  return Math.abs(v - a) <= Math.abs(v - b) ? 0 : 1;
}

function onPointerDown(e: PointerEvent) {
  if (props.disabled || e.button !== 0 || !track.value) return;
  e.preventDefault();
  const v = valueAt(e.clientX);
  const index = nearestThumb(v);
  dragging.value = index;
  setValue(index, v);
  track.value.setPointerCapture(e.pointerId);
  thumbs.value[index]?.focus({ preventScroll: true });
}

function onPointerMove(e: PointerEvent) {
  if (dragging.value === null) return;
  setValue(dragging.value, valueAt(e.clientX));
}

function onPointerUp(e: PointerEvent) {
  if (dragging.value === null) return;
  dragging.value = null;
  if (track.value?.hasPointerCapture(e.pointerId)) track.value.releasePointerCapture(e.pointerId);
  emit("change", current());
}

function onKeydown(e: KeyboardEvent, index: number) {
  if (props.disabled) return;
  const v = values.value[index]!;
  const { lo, hi } = thumbBounds(index);
  const next: Record<string, number> = {
    ArrowRight: v + props.step,
    ArrowUp: v + props.step,
    ArrowLeft: v - props.step,
    ArrowDown: v - props.step,
    PageUp: v + bigStep.value,
    PageDown: v - bigStep.value,
    Home: lo,
    End: hi,
  };
  if (!(e.key in next)) return;
  e.preventDefault();
  setValue(index, next[e.key]!);
  emit("change", current());
}

function onMarkClick(v: number) {
  if (props.disabled) return;
  const index = nearestThumb(v);
  setValue(index, v);
  thumbs.value[index]?.focus();
  emit("change", current());
}

function onInputChange(e: Event, index: number) {
  const el = e.target as HTMLInputElement;
  const n = el.valueAsNumber;
  if (Number.isFinite(n)) {
    setValue(index, n);
    emit("change", current());
  }
  // Reflect clamping even when the model didn't change.
  el.value = String(values.value[index]);
}

function thumbLabel(index: number) {
  const name = props.label || "Value";
  if (!props.range) return props.label ? undefined : name;
  return `${name}, ${index === 0 ? "minimum" : "maximum"}`;
}

function setThumbRef(el: unknown, index: number) {
  if (el) thumbs.value[index] = el as HTMLElement;
}

defineExpose({
  /** Moves focus to the first thumb. */
  focus: () => thumbs.value[0]?.focus(),
});
</script>

<template>
  <div class="w-full" :class="disabled && 'opacity-60'" data-ac-ds data-testid="ac-slider">
    <div v-if="label || description || (!showInput && !range)" class="mb-2 flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p v-if="label" :id="labelId" class="text-base font-medium text-heading">
          {{ label }}<span v-if="required" class="text-danger" aria-hidden="true"> *</span>
        </p>
        <p v-if="description" class="mt-0.5 text-xs text-muted">{{ description }}</p>
      </div>
      <span v-if="!showInput" class="shrink-0 text-base font-medium text-heading tabular-nums" aria-hidden="true">
        {{ range ? `${format(values[0]!)} – ${format(values[1]!)}` : format(values[0]!) }}
      </span>
    </div>
    <div v-else-if="!showInput && range" class="mb-2 text-right text-base font-medium text-heading tabular-nums" aria-hidden="true">
      {{ format(values[0]!) }} – {{ format(values[1]!) }}
    </div>

    <div class="flex items-center gap-3" :class="markList.length > 0 && 'pb-5'">
      <input
        v-if="showInput && range"
        type="number"
        :value="values[0]"
        :min="min"
        :max="values[1]"
        :step="step"
        :disabled="disabled"
        :aria-label="`${label || 'Value'}, minimum`"
        :aria-invalid="!!errorMsg || undefined"
        class="shrink-0"
        :class="[numberInputClass, 'w-16', errorMsg ? 'border-red-60' : 'border-border hover:border-border-dark focus:focus-ring']"
        @change="onInputChange($event, 0)"
      />

      <div class="relative min-w-0 flex-1">
        <div :class="tooltip === 'always' && 'pt-8'">
          <!-- touch-none lets touch drags move the thumb instead of scrolling the page -->
          <div
            ref="track"
            class="relative flex h-5 touch-none items-center select-none"
            :class="disabled ? 'cursor-not-allowed' : 'cursor-pointer'"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointercancel="onPointerUp"
          >
            <div class="relative h-1.5 w-full rounded-full" :class="errorMsg ? 'bg-red-90' : 'bg-slate-90'">
              <div class="absolute inset-y-0 rounded-full" :class="errorMsg ? 'bg-danger' : 'bg-primary'" :style="fill" />
              <span
                v-for="m in markList"
                :key="m.value"
                class="absolute top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full"
                :class="
                  (range ? m.value >= values[0]! && m.value <= values[1]! : m.value <= values[0]!)
                    ? 'bg-primary-90'
                    : 'bg-slate-70'
                "
                :style="{ left: `${percent(m.value)}%` }"
                aria-hidden="true"
              />
            </div>

            <div
              v-for="(v, i) in values"
              :key="i"
              :ref="(el) => setThumbRef(el, i)"
              role="slider"
              :tabindex="disabled ? -1 : 0"
              :aria-valuemin="thumbBounds(i).lo"
              :aria-valuemax="thumbBounds(i).hi"
              :aria-valuenow="v"
              :aria-valuetext="format(v)"
              aria-orientation="horizontal"
              :aria-labelledby="!range && label ? labelId : undefined"
              :aria-label="thumbLabel(i)"
              :aria-describedby="describedBy"
              :aria-disabled="disabled || undefined"
              :aria-invalid="!!errorMsg || undefined"
              :aria-required="required || undefined"
              class="group/thumb absolute top-1/2 size-4.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-surface shadow-sm transition-[box-shadow,scale] duration-150 outline-none focus-visible:ring-[3px] focus-visible:ring-ring motion-safe:hover:scale-110"
              :class="[
                errorMsg ? 'border-danger' : 'border-primary',
                dragging === i && 'ring-[3px] ring-ring motion-safe:scale-110',
                range && values[0] === values[1] && i === 1 && 'z-10',
              ]"
              :style="{ left: `${percent(v)}%` }"
              @keydown="onKeydown($event, i)"
            >
              <span
                v-if="tooltip !== 'never'"
                class="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-6 bg-slate-10 px-2 py-1 text-xs font-medium whitespace-nowrap text-slate-95 tabular-nums shadow-md transition-opacity duration-100 dark:bg-slate-80 dark:text-slate-10 dark:ring-1 dark:ring-slate-70"
                :class="
                  tooltip === 'always' || dragging === i
                    ? 'opacity-100'
                    : 'opacity-0 group-hover/thumb:opacity-100 group-focus-visible/thumb:opacity-100'
                "
                aria-hidden="true"
              >
                {{ format(v) }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="markList.length" class="absolute inset-x-0 top-full mt-1 h-4" aria-hidden="true">
          <span
            v-for="(m, i) in markList"
            :key="m.value"
            class="absolute top-0 text-xs whitespace-nowrap text-muted tabular-nums transition-colors"
            :class="[
              i === 0 && percent(m.value) < 5 ? '' : i === markList.length - 1 && percent(m.value) > 95 ? '-translate-x-full' : '-translate-x-1/2',
              !disabled && 'cursor-pointer hover:text-heading',
            ]"
            :style="{ left: `${percent(m.value)}%` }"
            @click="onMarkClick(m.value)"
          >
            {{ m.label }}
          </span>
        </div>
      </div>

      <div v-if="showInput" class="relative shrink-0">
        <input
          type="number"
          :value="values[range ? 1 : 0]"
          :min="range ? values[0] : min"
          :max="max"
          :step="step"
          :disabled="disabled"
          :aria-label="range ? `${label || 'Value'}, maximum` : label || 'Value'"
          :aria-invalid="!!errorMsg || undefined"
          :aria-describedby="describedBy"
          :class="[
            numberInputClass,
            range ? 'w-16' : 'w-20',
            errorMsg ? 'border-red-60' : 'border-border hover:border-border-dark focus:focus-ring',
            unit && !formatValue && !range && 'pr-8',
          ]"
          @change="onInputChange($event, range ? 1 : 0)"
        />
        <span
          v-if="unit && !formatValue && !range"
          class="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-xs text-muted"
          aria-hidden="true"
        >
          {{ unit.trim() }}
        </span>
      </div>
    </div>

    <p v-if="errorMsg" :id="msgId" class="mt-1.5 flex items-center gap-1 text-xs text-red-30">
      <CircleAlert class="size-3.5 shrink-0" aria-hidden="true" />
      {{ errorMsg }}
    </p>
    <p v-else-if="hint" :id="msgId" class="mt-1.5 text-xs text-muted">{{ hint }}</p>
  </div>
</template>

