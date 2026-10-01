<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, useAttrs, useId, watch } from "vue";
import { Calendar, CalendarRange, ChevronLeft, ChevronRight, CircleAlert, Timer, X } from "lucide-vue-next";
import AcButton from "./AcButton.vue";

export interface DatePickerPreset {
  /** Button text, e.g. "Last 7 days". */
  label: string;
  /** A span back from now: `1h`, `24h`, `7d`, `30d`. In `duration` mode it is the value itself. */
  duration?: string;
  /** Or compute the value yourself, in the same format as `v-model`. */
  value?: () => string | [string, string];
}

export interface Props {
  /** Floating label. It rests inside the field and rises when a value is chosen or the popover opens. */
  label?: string;
  /** Text shown in the field when there's no label and no value. */
  placeholder?: string;
  /** `date` for a calendar day (`YYYY-MM-DD`), `datetime` for an instant with hours and minutes (UTC ISO 8601), or `duration` for a Go/Kubernetes duration such as `26h30m`. */
  mode?: "date" | "datetime" | "duration";
  /** Pick a start and an end; `v-model` becomes `[start, end]`. Works with `date` and `datetime`. */
  range?: boolean;
  /** Earliest choosable day or instant (`YYYY-MM-DD` or ISO 8601). A bare date as `maxDate` means the end of that day. */
  minDate?: string;
  /** Latest choosable day or instant (`YYYY-MM-DD` or ISO 8601). */
  maxDate?: string;
  /** Return `true` to block a day. It receives the day as `YYYY-MM-DD`. */
  isDateDisabled?: (day: string) => boolean;
  /** Quick picks shown beside the calendar, such as “Last 24 hours”. Choosing one applies it at once. */
  presets?: DatePickerPreset[];
  /** IANA time zone used to show and pick times, e.g. `UTC` or `Asia/Dhaka`. Defaults to the browser's. Values are always stored in UTC. */
  timeZone?: string;
  /** BCP 47 locale for month names, weekdays and the field text. Defaults to the browser's. */
  locale?: string;
  /** First column of the calendar, 0 = Sunday … 6 = Saturday. Defaults to the locale's. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Adds a seconds box to the time in `datetime` mode. */
  showSeconds?: boolean;
  /** Shows a clear button when there is a value. */
  clearable?: boolean;
  /** Disables the field. */
  disabled?: boolean;
  /** Marks the field required and adds a red asterisk. */
  required?: boolean;
  /** Error text under the field. */
  errorMsg?: string;
  /** Helper text under the field (hidden while `errorMsg` is set). */
  hint?: string;
  /** `small` 36px or `normal` 40px tall. */
  size?: "small" | "normal";
  /** Adds a hidden input with this name so plain form posts include the value. A range posts as `start/end`. */
  name?: string;
}

type DayKey = string;
interface Clock {
  h: number;
  m: number;
  s: number;
}
interface Spinner {
  key: string;
  label: string;
  min: number;
  max: number;
  wrap: boolean;
  padded: boolean;
  get: () => number;
  set: (n: number) => void;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Props>(), {
  label: "",
  placeholder: "",
  mode: "date",
  range: false,
  minDate: "",
  maxDate: "",
  isDateDisabled: undefined,
  presets: () => [],
  timeZone: "",
  locale: undefined,
  weekStartsOn: undefined,
  showSeconds: false,
  clearable: false,
  disabled: false,
  required: false,
  errorMsg: "",
  hint: "",
  size: "small",
  name: "",
});

/** `date`: `"2026-09-30"`. `datetime`: `"2026-09-30T14:05:00Z"` (UTC). `duration`: `"26h30m"`. With `range`: `[start, end]`. `null` when empty. */
const model = defineModel<string | [string, string] | null>({ default: null });
/** Whether the popover is open. */
const open = defineModel<boolean>("open", { default: false });

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const WALL_RE = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;
const UNIT_SECONDS: Record<string, number> = { w: 604800, d: 86400, h: 3600, m: 60, s: 1, ms: 1e-3, us: 1e-6, µs: 1e-6, ns: 1e-9 };
// 2023-01-01 was a Sunday; weekday headers are built from it.
const SUNDAY = Date.UTC(2023, 0, 1);

const id = useId();
const attrs = useAttrs();
const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }));
const controlAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});
const labelId = `${id}-label`;
const valueId = `${id}-value`;
const monthId = `${id}-month`;
const msgId = `${id}-msg`;
const zoneFormatters = new Map<string, Intl.DateTimeFormat>();

const root = ref<HTMLElement | null>(null);
const trigger = ref<HTMLButtonElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const placement = ref<{ top?: number; bottom?: number; left: number; maxHeight: number }>({ left: 0, maxHeight: 480 });
const viewMonth = ref<DayKey>("2026-01-01");
const focusDay = ref<DayKey>("2026-01-01");
const hoverDay = ref<DayKey | null>(null);
const draftStart = ref<DayKey | null>(null);
const draftEnd = ref<DayKey | null>(null);
const startTime = reactive<Clock>({ h: 0, m: 0, s: 0 });
const endTime = reactive<Clock>({ h: 23, m: 59, s: 59 });
const duration = reactive({ d: 0, h: 0, m: 0 });

const zone = computed(() => props.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone);
const isRange = computed(() => props.range && props.mode !== "duration");
const hasTime = computed(() => props.mode === "datetime");
const weekStart = computed(() => props.weekStartsOn ?? localeWeekStart());

const dayFormat = computed(() => new Intl.DateTimeFormat(props.locale, { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }));
const dateTimeFormat = computed(
  () =>
    new Intl.DateTimeFormat(props.locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: props.showSeconds ? "2-digit" : undefined,
      hourCycle: "h23",
      timeZone: zone.value,
      timeZoneName: "short",
    }),
);
const monthFormat = computed(() => new Intl.DateTimeFormat(props.locale, { month: "long", year: "numeric", timeZone: "UTC" }));
const fullDayFormat = computed(
  () => new Intl.DateTimeFormat(props.locale, { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }),
);
const dayNumberFormat = computed(() => new Intl.DateTimeFormat(props.locale, { day: "numeric", timeZone: "UTC" }));

const weekdays = computed(() => {
  const short = new Intl.DateTimeFormat(props.locale, { weekday: "short", timeZone: "UTC" });
  const long = new Intl.DateTimeFormat(props.locale, { weekday: "long", timeZone: "UTC" });
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(SUNDAY + ((weekStart.value + i) % 7) * 86400000);
    return { short: short.format(d), long: long.format(d) };
  });
});

const zoneName = computed(
  () =>
    new Intl.DateTimeFormat(props.locale, { timeZone: zone.value, timeZoneName: "short" })
      .formatToParts(Date.now())
      .find((p) => p.type === "timeZoneName")?.value ?? zone.value,
);

const today = computed(() => wall(Date.now()).day);
const minDay = computed(() => (props.minDate ? parseDay(props.minDate) : null));
const maxDay = computed(() => (props.maxDate ? parseDay(props.maxDate) : null));
const minMs = computed(() => (props.minDate ? parseInstant(props.minDate) : null));
const maxMs = computed(() => {
  if (!props.maxDate) return null;
  if (DAY_RE.test(props.maxDate)) return toInstant(addDays(props.maxDate, 1), 0, 0, 0) - 1000;
  return parseInstant(props.maxDate);
});

const parts = computed<(string | null)[]>(() => {
  const v = model.value;
  if (isRange.value) return Array.isArray(v) ? [v[0] || null, v[1] || null] : [null, null];
  return [typeof v === "string" && v ? v : null];
});
const hasValue = computed(() => parts.value.some(Boolean));

const displayText = computed(() => {
  const [a, b] = parts.value;
  if (!a) return "";
  if (props.mode === "duration") {
    const secs = parseDuration(a);
    return secs === null ? a : durationLabel(secs);
  }
  if (props.mode === "date") {
    const da = parseDay(a);
    const db = b ? parseDay(b) : null;
    if (!da) return a;
    if (!isRange.value) return dayFormat.value.format(utcDate(da));
    return db ? dayFormat.value.formatRange(utcDate(da), utcDate(db)) : `${dayFormat.value.format(utcDate(da))} –`;
  }
  const ma = parseInstant(a);
  const mb = b ? parseInstant(b) : null;
  if (ma === null) return a;
  if (!isRange.value) return dateTimeFormat.value.format(ma);
  return mb === null ? `${dateTimeFormat.value.format(ma)} –` : dateTimeFormat.value.formatRange(ma, mb);
});

const hiddenValue = computed(() => parts.value.filter(Boolean).join("/"));

const weeks = computed<DayKey[][]>(() => {
  const offset = (weekdayOf(viewMonth.value) - weekStart.value + 7) % 7;
  const start = addDays(viewMonth.value, -offset);
  return Array.from({ length: 6 }, (_, w) => Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d)));
});

const bandEnd = computed(() => {
  if (!isRange.value || !draftStart.value) return null;
  return draftEnd.value ?? hoverDay.value ?? null;
});

const startMs = computed(() => (draftStart.value ? toInstant(draftStart.value, startTime.h, startTime.m, startTime.s) : null));
const endMs = computed(() => (draftEnd.value ? toInstant(draftEnd.value, endTime.h, endTime.m, endTime.s) : null));

const draftError = computed(() => {
  if (!hasTime.value) return "";
  const checks = isRange.value ? [startMs.value, endMs.value] : [startMs.value];
  for (const ms of checks) {
    if (ms === null) continue;
    if (minMs.value !== null && ms < minMs.value) return `Choose a time from ${dateTimeFormat.value.format(minMs.value)}`;
    if (maxMs.value !== null && ms > maxMs.value) return `Choose a time up to ${dateTimeFormat.value.format(maxMs.value)}`;
  }
  if (isRange.value && startMs.value !== null && endMs.value !== null && endMs.value < startMs.value) return "The end must be after the start";
  return "";
});

const canApply = computed(() => {
  if (props.mode === "duration") return true;
  if (!draftStart.value || (isRange.value && !draftEnd.value)) return false;
  return !draftError.value;
});

const durationSeconds = computed(() => duration.d * 86400 + duration.h * 3600 + duration.m * 60);

const timeRows = computed(() => {
  const rows = [{ key: "start", label: isRange.value ? "Start" : "Time", clock: startTime }];
  if (isRange.value) rows.push({ key: "end", label: "End", clock: endTime });
  return rows.map((r) => ({ ...r, spinners: clockSpinners(r.clock, r.label) }));
});

const durationSpinners = computed<Spinner[]>(() => [
  spinner("d", "Days", 0, 999, false, false, () => duration.d, (n) => (duration.d = n)),
  spinner("h", "Hours", 0, 23, false, false, () => duration.h, (n) => (duration.h = n)),
  spinner("m", "Minutes", 0, 59, false, false, () => duration.m, (n) => (duration.m = n)),
]);

const hoisted = computed(() => !!props.label && (hasValue.value || open.value));
const describedBy = computed(() => (props.errorMsg || props.hint ? msgId : undefined));
const dialogLabel = computed(() => {
  if (props.mode === "duration") return props.label || "Choose duration";
  const what = isRange.value ? "date range" : hasTime.value ? "date and time" : "date";
  return props.label ? `${props.label}: choose ${what}` : `Choose ${what}`;
});
const triggerIcon = computed(() => (props.mode === "duration" ? Timer : isRange.value ? CalendarRange : Calendar));

// ---- calendar arithmetic on YYYY-MM-DD keys, done in UTC so DST never shifts a day
function pad(n: number) {
  return String(n).padStart(2, "0");
}
function keyOf(y: number, m: number, d: number): DayKey {
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}
function partsOf(key: DayKey) {
  const [y, m, d] = key.split("-").map(Number) as [number, number, number];
  return { y, m, d };
}
function utcDate(key: DayKey) {
  const { y, m, d } = partsOf(key);
  return new Date(Date.UTC(y, m - 1, d));
}
function addDays(key: DayKey, n: number) {
  const { y, m, d } = partsOf(key);
  return keyOf(y, m, d + n);
}
function addMonths(key: DayKey, n: number) {
  const { y, m, d } = partsOf(key);
  const last = new Date(Date.UTC(y, m - 1 + n + 1, 0)).getUTCDate();
  return keyOf(y, m + n, Math.min(d, last));
}
function monthOf(key: DayKey) {
  return `${key.slice(0, 7)}-01`;
}
function weekdayOf(key: DayKey) {
  return utcDate(key).getUTCDay();
}
function localeWeekStart() {
  try {
    const loc = new Intl.Locale(props.locale ?? navigator.language) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number };
      weekInfo?: { firstDay: number };
    };
    const first = (loc.getWeekInfo?.() ?? loc.weekInfo)?.firstDay;
    if (first) return first % 7;
  } catch {
    // Older engines have no week info; fall back to Sunday.
  }
  return 0;
}

// ---- time zones through Intl, no library
function wall(ms: number) {
  let f = zoneFormatters.get(zone.value);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone: zone.value,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    zoneFormatters.set(zone.value, f);
  }
  const p: Record<string, number> = {};
  for (const { type, value } of f.formatToParts(ms)) if (type !== "literal") p[type] = Number(value);
  return { day: keyOf(p.year!, p.month!, p.day!), h: p.hour! % 24, m: p.minute!, s: p.second! };
}
function offsetAt(ms: number) {
  const w = wall(ms);
  const { y, m, d } = partsOf(w.day);
  return Date.UTC(y, m - 1, d, w.h, w.m, w.s) - Math.floor(ms / 1000) * 1000;
}
function toInstant(day: DayKey, h: number, m: number, s: number) {
  const { y, m: mo, d } = partsOf(day);
  const guess = Date.UTC(y, mo - 1, d, h, m, s);
  const first = offsetAt(guess);
  const ms = guess - first;
  const second = offsetAt(ms);
  return second === first ? ms : guess - second;
}
function parseInstant(v: string): number | null {
  const local = WALL_RE.exec(v);
  if (local) return toInstant(local[1]!, Number(local[2]), Number(local[3]), Number(local[4] ?? 0));
  if (DAY_RE.test(v)) return toInstant(v, 0, 0, 0);
  const ms = Date.parse(v);
  return Number.isNaN(ms) ? null : ms;
}
function parseDay(v: string): DayKey | null {
  if (DAY_RE.test(v)) return v;
  const ms = parseInstant(v);
  return ms === null ? null : wall(ms).day;
}
function isoOf(ms: number) {
  return new Date(ms).toISOString().replace(/\.000Z$/, "Z");
}

// ---- Go durations (`1h30m`); `d` and `w` are accepted on input for convenience
function parseDuration(v: string): number | null {
  const s = v.replace(/\s+/g, "");
  if (!s) return null;
  if (s === "0") return 0;
  const re = /(\d+(?:\.\d+)?)(ns|us|µs|ms|w|d|h|m|s)/y;
  let total = 0;
  let consumed = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(s))) {
    total += Number(match[1]) * UNIT_SECONDS[match[2]!]!;
    consumed = re.lastIndex;
  }
  return consumed === s.length ? total : null;
}
function goDuration(total: number) {
  if (total <= 0) return null;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = Math.round(total % 60);
  return `${h ? `${h}h` : ""}${m ? `${m}m` : ""}${s ? `${s}s` : ""}` || null;
}
function durationLabel(total: number) {
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = Math.round(total % 60);
  const out = [d && `${d}d`, h && `${h}h`, m && `${m}m`, s && `${s}s`].filter(Boolean).join(" ");
  return out || "0m";
}

// ---- day state
function isDisabled(key: DayKey) {
  if (minDay.value && key < minDay.value) return true;
  if (maxDay.value && key > maxDay.value) return true;
  return props.isDateDisabled?.(key) ?? false;
}
function isEdge(key: DayKey) {
  if (key === draftStart.value) return true;
  return isRange.value && key === (draftEnd.value ?? bandEnd.value);
}
function inBand(key: DayKey) {
  const a = draftStart.value;
  const b = bandEnd.value;
  if (!a || !b) return false;
  const [lo, hi] = a <= b ? [a, b] : [b, a];
  return key >= lo && key <= hi;
}
function bandShape(key: DayKey) {
  const a = draftStart.value!;
  const b = bandEnd.value!;
  const [lo, hi] = a <= b ? [a, b] : [b, a];
  return [key === lo && "rounded-l-6", key === hi && "rounded-r-6"];
}

// ---- spin buttons for hours, minutes and duration parts (WAI-ARIA spinbutton)
function spinner(key: string, label: string, min: number, max: number, wrap: boolean, padded: boolean, get: () => number, set: (n: number) => void): Spinner {
  return { key, label, min, max, wrap, padded, get, set };
}
function clockSpinners(clock: Clock, prefix: string): Spinner[] {
  const list = [
    spinner("h", `${prefix} hours`, 0, 23, true, true, () => clock.h, (n) => (clock.h = n)),
    spinner("m", `${prefix} minutes`, 0, 59, true, true, () => clock.m, (n) => (clock.m = n)),
  ];
  if (props.showSeconds) list.push(spinner("s", `${prefix} seconds`, 0, 59, true, true, () => clock.s, (n) => (clock.s = n)));
  return list;
}
function show(s: Spinner) {
  return s.padded ? pad(s.get()) : String(s.get());
}
function onSpinKeydown(e: KeyboardEvent, s: Spinner) {
  const v = s.get();
  const span = s.max - s.min + 1;
  let next: number | null = null;
  if (e.key === "ArrowUp") next = v + 1;
  else if (e.key === "ArrowDown") next = v - 1;
  else if (e.key === "PageUp") next = v + 10;
  else if (e.key === "PageDown") next = v - 10;
  else if (e.key === "Home") next = s.min;
  else if (e.key === "End") next = s.max;
  if (next === null) return;
  e.preventDefault();
  next = s.wrap ? ((((next - s.min) % span) + span) % span) + s.min : Math.min(s.max, Math.max(s.min, next));
  s.set(next);
  (e.target as HTMLInputElement).value = show(s);
}
function onSpinInput(e: Event, s: Spinner) {
  const el = e.target as HTMLInputElement;
  const digits = el.value.replace(/\D/g, "").slice(0, String(s.max).length);
  el.value = digits;
  if (!digits) return;
  let n = Number(digits);
  // Typing "7" then "5" into minutes gives 75; keep the last digit instead of rejecting it.
  if (n > s.max) n = Number(digits.slice(-1));
  s.set(Math.max(s.min, n));
}
function onSpinBlur(e: Event, s: Spinner) {
  (e.target as HTMLInputElement).value = show(s);
}

// ---- open, close and position
function syncDraft() {
  hoverDay.value = null;
  if (props.mode === "duration") {
    const secs = parts.value[0] ? (parseDuration(parts.value[0]) ?? 0) : 0;
    duration.d = Math.floor(secs / 86400);
    duration.h = Math.floor((secs % 86400) / 3600);
    duration.m = Math.floor((secs % 3600) / 60);
    return;
  }
  const [a, b] = parts.value;
  draftStart.value = null;
  draftEnd.value = null;
  Object.assign(startTime, { h: 0, m: 0, s: 0 });
  Object.assign(endTime, { h: 23, m: 59, s: props.showSeconds ? 59 : 0 });
  if (hasTime.value) {
    const ma = a ? parseInstant(a) : null;
    const mb = b ? parseInstant(b) : null;
    if (ma !== null) {
      const w = wall(ma);
      draftStart.value = w.day;
      Object.assign(startTime, { h: w.h, m: w.m, s: w.s });
    }
    if (mb !== null) {
      const w = wall(mb);
      draftEnd.value = w.day;
      Object.assign(endTime, { h: w.h, m: w.m, s: w.s });
    }
  } else {
    draftStart.value = a ? parseDay(a) : null;
    draftEnd.value = b ? parseDay(b) : null;
  }
  let start = draftStart.value ?? today.value;
  if (!draftStart.value && minDay.value && start < minDay.value) start = minDay.value;
  if (!draftStart.value && maxDay.value && start > maxDay.value) start = maxDay.value;
  focusDay.value = start;
  viewMonth.value = monthOf(start);
}

function place() {
  const el = trigger.value;
  if (!el) return;
  const r = el.getBoundingClientRect();
  const w = panel.value?.offsetWidth ?? 300;
  const h = panel.value?.offsetHeight ?? 380;
  const gap = 6;
  const margin = 8;
  const below = window.innerHeight - r.bottom - gap - margin;
  const above = r.top - gap - margin;
  const flip = below < h && above > below;
  const left = Math.max(margin, Math.min(r.left, window.innerWidth - w - margin));
  placement.value = flip
    ? { bottom: window.innerHeight - r.top + gap, left, maxHeight: Math.max(200, above) }
    : { top: r.bottom + gap, left, maxHeight: Math.max(200, below) };
}

function openPanel() {
  if (props.disabled || open.value) return;
  open.value = true;
}

function closePanel(refocus = true) {
  if (!open.value) return;
  open.value = false;
  if (refocus) trigger.value?.focus();
}

async function onOpened() {
  syncDraft();
  place();
  listen();
  await nextTick();
  place();
  if (props.mode === "duration") panel.value?.querySelector<HTMLElement>("input")?.focus();
  else focusDayButton();
}

function focusDayButton() {
  nextTick(() => panel.value?.querySelector<HTMLElement>(`[data-day="${focusDay.value}"]`)?.focus());
}

// ---- choosing
function commit(value: string | [string, string] | null) {
  model.value = value;
  closePanel();
}

function selectDay(key: DayKey) {
  if (isDisabled(key)) return;
  focusDay.value = key;
  if (monthOf(key) !== viewMonth.value) {
    viewMonth.value = monthOf(key);
    focusDayButton();
  }
  if (!isRange.value) {
    draftStart.value = key;
    if (!hasTime.value) commit(key);
    return;
  }
  if (!draftStart.value || draftEnd.value) {
    draftStart.value = key;
    draftEnd.value = null;
    return;
  }
  if (key < draftStart.value) {
    draftEnd.value = draftStart.value;
    draftStart.value = key;
  } else {
    draftEnd.value = key;
  }
  hoverDay.value = null;
  if (!hasTime.value) commit([draftStart.value, draftEnd.value]);
}

function apply() {
  if (!canApply.value) return;
  if (props.mode === "duration") return commit(goDuration(durationSeconds.value));
  if (!hasTime.value) return commit(isRange.value ? [draftStart.value!, draftEnd.value!] : draftStart.value);
  commit(isRange.value ? [isoOf(startMs.value!), isoOf(endMs.value!)] : isoOf(startMs.value!));
}

function setNow() {
  const w = wall(Date.now());
  draftStart.value = w.day;
  Object.assign(startTime, { h: w.h, m: w.m, s: props.showSeconds ? w.s : 0 });
  focusDay.value = w.day;
  viewMonth.value = monthOf(w.day);
}

function pickToday() {
  selectDay(today.value);
}

function applyPreset(p: DatePickerPreset) {
  if (p.value) return commit(p.value());
  if (!p.duration) return;
  if (props.mode === "duration") return commit(goDuration(parseDuration(p.duration) ?? 0));
  const now = Math.floor(Date.now() / 1000) * 1000;
  const from = now - (parseDuration(p.duration) ?? 0) * 1000;
  if (props.mode === "date") return commit(isRange.value ? [wall(from).day, wall(now).day] : wall(from).day);
  commit(isRange.value ? [isoOf(from), isoOf(now)] : isoOf(from));
}

function clear() {
  model.value = null;
  trigger.value?.focus();
}

function changeMonth(n: number) {
  viewMonth.value = addMonths(viewMonth.value, n);
  focusDay.value = addMonths(focusDay.value, n);
}

// ---- keyboard
function onGridKeydown(e: KeyboardEvent) {
  const k = focusDay.value;
  const fromWeekStart = (weekdayOf(k) - weekStart.value + 7) % 7;
  const moves: Record<string, () => DayKey> = {
    ArrowLeft: () => addDays(k, -1),
    ArrowRight: () => addDays(k, 1),
    ArrowUp: () => addDays(k, -7),
    ArrowDown: () => addDays(k, 7),
    Home: () => addDays(k, -fromWeekStart),
    End: () => addDays(k, 6 - fromWeekStart),
    PageUp: () => addMonths(k, e.shiftKey ? -12 : -1),
    PageDown: () => addMonths(k, e.shiftKey ? 12 : 1),
  };
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    selectDay(k);
    return;
  }
  const move = moves[e.key];
  if (!move) return;
  e.preventDefault();
  focusDay.value = move();
  viewMonth.value = monthOf(focusDay.value);
  if (isRange.value && draftStart.value && !draftEnd.value) hoverDay.value = focusDay.value;
  focusDayButton();
}

function onPanelKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") {
    e.preventDefault();
    e.stopPropagation();
    closePanel();
    return;
  }
  if (e.key !== "Tab" || !panel.value) return;
  const items = [...panel.value.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled])")].filter(
    (el) => el.tabIndex >= 0,
  );
  if (!items.length) return;
  const first = items[0]!;
  const last = items[items.length - 1]!;
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function onTriggerKeydown(e: KeyboardEvent) {
  if (e.key === "ArrowDown" || (e.key === "ArrowUp" && e.altKey)) {
    e.preventDefault();
    openPanel();
  }
}

// ---- outside click, scroll and resize while open
function onPointerDown(e: PointerEvent) {
  const t = e.target as Node;
  if (root.value?.contains(t) || panel.value?.contains(t)) return;
  closePanel(false);
}
function onViewportChange(e?: Event) {
  if (e && panel.value?.contains(e.target as Node)) return;
  place();
}
function listen() {
  document.addEventListener("pointerdown", onPointerDown, true);
  window.addEventListener("scroll", onViewportChange, true);
  window.addEventListener("resize", onViewportChange);
}
function unlisten() {
  document.removeEventListener("pointerdown", onPointerDown, true);
  window.removeEventListener("scroll", onViewportChange, true);
  window.removeEventListener("resize", onViewportChange);
}

watch(open, (v) => (v ? onOpened() : unlisten()));

onMounted(() => {
  if (open.value) onOpened();
});
onBeforeUnmount(unlisten);

defineExpose({
  /** Moves focus to the field. */
  focus: () => trigger.value?.focus(),
});
</script>

<template>
  <div ref="root" v-bind="rootAttrs" class="w-full" :class="disabled && 'opacity-60'" data-testid="ac-date-picker">
    <div class="relative">
      <button
        :id="`${id}-trigger`"
        ref="trigger"
        v-bind="controlAttrs"
        type="button"
        :disabled="disabled"
        aria-haspopup="dialog"
        :aria-expanded="open"
        :aria-labelledby="label ? `${labelId} ${valueId}` : valueId"
        :aria-describedby="describedBy"
        :aria-invalid="!!errorMsg || undefined"
        :aria-required="required || undefined"
        class="flex w-full items-center rounded-6 border bg-surface pr-16 pl-3 text-left text-base text-heading shadow-xs transition-[border-color,box-shadow] duration-150 outline-none disabled:cursor-not-allowed disabled:bg-surface-muted"
        :class="[
          size === 'small' ? 'h-9' : 'h-10',
          disabled ? '' : 'cursor-pointer',
          errorMsg ? 'border-red-60' : open ? 'focus-ring' : 'border-border hover:border-border-dark focus-visible:focus-ring',
        ]"
        @click="open ? closePanel() : openPanel()"
        @keydown="onTriggerKeydown"
      >
        <span :id="valueId" class="truncate tabular-nums" :class="!displayText && 'text-muted'">
          {{ displayText || (label ? "" : placeholder || (mode === "duration" ? "Choose duration" : "Choose date")) }}
        </span>
      </button>

      <label
        v-if="label"
        :id="labelId"
        :for="`${id}-trigger`"
        class="pointer-events-none absolute left-2.5 rounded-2 px-1 transition-all duration-150 ease-out"
        :class="[
          disabled ? 'bg-linear-to-b from-surface from-50% to-surface-muted to-50%' : 'bg-surface',
          hoisted ? 'top-0 -translate-y-1/2 text-xs font-medium' : 'top-1/2 -translate-y-1/2 text-base text-muted',
          hoisted && (errorMsg ? 'text-red-30' : open ? 'text-primary-20' : 'text-label'),
        ]"
      >
        {{ label }}<span v-if="required" class="text-danger" aria-hidden="true"> *</span>
      </label>

      <span class="pointer-events-none absolute inset-y-0 right-2 flex items-center gap-0.5 text-muted">
        <button
          v-if="clearable && hasValue && !disabled"
          type="button"
          class="pointer-events-auto inline-flex size-6 cursor-pointer items-center justify-center rounded-4 transition hover:bg-surface-sunken hover:text-heading focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:outline-none"
          :aria-label="label ? `Clear ${label}` : 'Clear'"
          @click="clear"
        >
          <X class="size-3.5" aria-hidden="true" />
        </button>
        <component :is="triggerIcon" class="mx-1 size-4" :class="open && 'text-heading'" aria-hidden="true" />
      </span>
    </div>

    <p v-if="errorMsg" :id="msgId" class="mt-1.5 flex items-center gap-1 text-xs text-red-30">
      <CircleAlert class="size-3.5 shrink-0" aria-hidden="true" />
      {{ errorMsg }}
    </p>
    <p v-else-if="hint" :id="msgId" class="mt-1.5 text-xs text-muted">{{ hint }}</p>

    <input v-if="name" type="hidden" :name="name" :value="hiddenValue" />

    <!-- attached to <body> so modals and scroll containers don't clip it -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-150 ease-out motion-reduce:transition-opacity"
        enter-from-class="opacity-0 -translate-y-1 scale-[0.98]"
        leave-active-class="transition duration-100 ease-in"
        leave-to-class="opacity-0"
      >
        <div
          v-if="open"
          ref="panel"
          role="dialog"
          aria-modal="true"
          :aria-label="dialogLabel"
          class="ac-scrollbar fixed z-[90] flex max-w-[calc(100vw-16px)] flex-col rounded-10 border border-border bg-surface shadow-lg sm:flex-row"
          :style="{
            top: placement.top !== undefined ? `${placement.top}px` : undefined,
            bottom: placement.bottom !== undefined ? `${placement.bottom}px` : undefined,
            left: `${placement.left}px`,
            maxHeight: `${placement.maxHeight}px`,
          }"
          data-testid="ac-date-picker-panel"
          @keydown="onPanelKeydown"
        >
          <!-- presets -->
          <div
            v-if="presets.length"
            class="flex shrink-0 flex-wrap gap-1 border-b border-border-light p-2 sm:w-40 sm:flex-col sm:flex-nowrap sm:border-r sm:border-b-0"
            role="group"
            aria-label="Presets"
          >
            <button
              v-for="p in presets"
              :key="p.label"
              type="button"
              class="cursor-pointer rounded-6 px-2.5 py-1.5 text-left text-base text-heading transition-colors hover:bg-surface-muted focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:outline-none max-sm:border max-sm:border-border max-sm:py-1 max-sm:text-xs"
              @click="applyPreset(p)"
            >
              {{ p.label }}
            </button>
          </div>

          <div class="max-w-full min-w-0" :class="mode === 'duration' ? 'w-72' : 'w-[276px]'">
            <!-- duration -->
            <div v-if="mode === 'duration'" class="p-4">
              <p class="text-base font-medium text-heading">{{ label || "Duration" }}</p>
              <p class="text-xs text-muted tabular-nums" aria-live="polite">{{ durationLabel(durationSeconds) }}</p>
              <div class="mt-3 grid grid-cols-3 gap-2">
                <label v-for="s in durationSpinners" :key="s.key" class="block">
                  <span class="mb-1 block text-xs font-medium text-label">{{ s.label }}</span>
                  <input
                    type="text"
                    inputmode="numeric"
                    role="spinbutton"
                    autocomplete="off"
                    :value="show(s)"
                    :aria-valuenow="s.get()"
                    :aria-valuemin="s.min"
                    :aria-valuemax="s.max"
                    class="h-9 w-full rounded-6 border border-border bg-surface px-2.5 text-center text-base text-heading tabular-nums shadow-xs transition-[border-color,box-shadow] outline-none hover:border-border-dark focus:focus-ring"
                    @keydown="onSpinKeydown($event, s)"
                    @input="onSpinInput($event, s)"
                    @blur="onSpinBlur($event, s)"
                    @focus="($event.target as HTMLInputElement).select()"
                  />
                </label>
              </div>
              <p class="mt-2 text-xs text-muted">↑ ↓ to adjust, or type a number.</p>
            </div>

            <!-- calendar -->
            <div v-else class="p-3">
              <div class="mb-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  class="inline-flex size-8 cursor-pointer items-center justify-center rounded-6 text-muted transition hover:bg-surface-muted hover:text-heading focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:outline-none"
                  aria-label="Previous month"
                  @click="changeMonth(-1)"
                >
                  <ChevronLeft class="size-4" aria-hidden="true" />
                </button>
                <p :id="monthId" class="text-base font-semibold text-heading" aria-live="polite">{{ monthFormat.format(utcDate(viewMonth)) }}</p>
                <button
                  type="button"
                  class="inline-flex size-8 cursor-pointer items-center justify-center rounded-6 text-muted transition hover:bg-surface-muted hover:text-heading focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:outline-none"
                  aria-label="Next month"
                  @click="changeMonth(1)"
                >
                  <ChevronRight class="size-4" aria-hidden="true" />
                </button>
              </div>

              <table role="grid" :aria-labelledby="monthId" class="border-collapse" @keydown="onGridKeydown">
                <thead>
                  <tr>
                    <th v-for="w in weekdays" :key="w.long" scope="col" :abbr="w.long" class="h-8 w-9 text-center text-xs font-medium text-muted">
                      {{ w.short.slice(0, 2) }}
                    </th>
                  </tr>
                </thead>
                <tbody @mouseleave="hoverDay = null">
                  <tr v-for="(week, wi) in weeks" :key="wi">
                    <td
                      v-for="day in week"
                      :key="day"
                      role="gridcell"
                      :aria-selected="isEdge(day) || inBand(day)"
                      class="p-0 py-0.5"
                    >
                      <div :class="inBand(day) && ['bg-primary-95', ...bandShape(day)]">
                        <button
                          type="button"
                          :data-day="day"
                          :tabindex="day === focusDay ? 0 : -1"
                          :aria-label="fullDayFormat.format(utcDate(day))"
                          :aria-disabled="isDisabled(day) || undefined"
                          :aria-current="day === today ? 'date' : undefined"
                          class="relative inline-flex size-9 items-center justify-center rounded-6 text-base tabular-nums transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
                          :class="[
                            isDisabled(day)
                              ? 'cursor-not-allowed text-slate-70 line-through'
                              : isEdge(day)
                                ? 'cursor-pointer bg-primary font-semibold text-white shadow-button'
                                : [
                                    'cursor-pointer hover:bg-surface-sunken',
                                    monthOf(day) !== viewMonth ? 'text-muted' : day === today ? 'font-semibold text-primary-20' : 'text-heading',
                                  ],
                          ]"
                          @click="selectDay(day)"
                          @mouseenter="isRange && draftStart && !draftEnd && (hoverDay = day)"
                        >
                          {{ dayNumberFormat.format(utcDate(day)) }}
                          <span
                            v-if="day === today && !isEdge(day)"
                            class="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-primary"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- time -->
              <div v-if="hasTime" class="mt-2 space-y-2 border-t border-border-light pt-3">
                <div v-for="row in timeRows" :key="row.key" class="flex items-center justify-between gap-3" role="group" :aria-label="`${row.label} time`">
                  <span class="text-xs font-medium text-label">{{ row.label }}</span>
                  <span class="flex items-center gap-1">
                    <template v-for="(s, i) in row.spinners" :key="s.key">
                      <span v-if="i > 0" class="text-muted" aria-hidden="true">:</span>
                      <input
                        type="text"
                        inputmode="numeric"
                        role="spinbutton"
                        autocomplete="off"
                        maxlength="2"
                        :value="show(s)"
                        :aria-label="s.label"
                        :aria-valuenow="s.get()"
                        :aria-valuemin="s.min"
                        :aria-valuemax="s.max"
                        class="h-8 w-10 rounded-6 border border-border bg-surface text-center text-base text-heading tabular-nums shadow-xs transition-[border-color,box-shadow] outline-none hover:border-border-dark focus:focus-ring"
                        @keydown="onSpinKeydown($event, s)"
                        @input="onSpinInput($event, s)"
                        @blur="onSpinBlur($event, s)"
                        @focus="($event.target as HTMLInputElement).select()"
                      />
                    </template>
                  </span>
                </div>
                <p class="text-xs text-muted">Times in {{ zoneName }}<template v-if="zoneName !== zone"> ({{ zone }})</template></p>
              </div>
            </div>

            <!-- footer -->
            <div
              v-if="hasTime || mode === 'duration' || !isRange"
              class="flex flex-wrap items-center gap-2 border-t border-border-light px-3 py-2.5"
            >
              <button
                v-if="mode !== 'duration' && !isRange"
                type="button"
                class="cursor-pointer rounded-4 text-xs font-medium text-primary-20 hover:underline focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="isDisabled(today)"
                @click="hasTime ? setNow() : pickToday()"
              >
                {{ hasTime ? "Now" : "Today" }}
              </button>
              <p v-if="draftError" class="basis-full text-xs text-red-30" role="alert">{{ draftError }}</p>
              <span class="flex-1" />
              <template v-if="hasTime || mode === 'duration'">
                <AcButton title="Cancel" color="white" size="small" @click="closePanel()" />
                <AcButton title="Apply" size="small" :disabled="!canApply" @click="apply" />
              </template>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
