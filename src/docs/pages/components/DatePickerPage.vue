<script setup lang="ts">
import { AcDatePicker } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const script = 'import { ref } from "vue";\n\nconst value = ref<string | null>(null);';

const dos = [
  "Store `datetime` values as they come out — UTC ISO 8601 — and send them to Kubernetes unchanged.",
  "Set `time-zone=\"UTC\"` when the value is compared with server logs or `kubectl` output.",
  "Bound the calendar with `min-date` and `max-date` when only part of time is valid, like a recoverable window.",
];
const donts = [
  "Don't build a time range from two separate pickers — use `range`, which keeps the end after the start.",
  "Don't use presets for one-off dates; they suit filters and dashboards.",
  "Don't format the value yourself for display in the field; the picker already uses the viewer's locale.",
];
const formats: [string, string, string][] = [
  ["date", "Calendar day", '"2026-09-30"'],
  ["date + range", "First and last day, inclusive", '["2026-09-01", "2026-09-30"]'],
  ["datetime", "Instant, UTC, seconds", '"2026-09-30T08:05:00Z"'],
  ["datetime + range", "Two instants", '["2026-09-30T00:00:00Z", "2026-09-30T23:59:00Z"]'],
  ["duration", "Go / metav1.Duration", '"26h30m"'],
];
const theme: [string, string][] = [
  ["rounded-6 border-border shadow-xs", "Field"],
  ["focus-ring", "Open / focused field"],
  ["rounded-10 shadow-lg", "Popover"],
  ["bg-primary text-white shadow-button", "Selected day, range start and end"],
  ["bg-primary-95", "Days inside a range"],
  ["text-primary-20 + bg-primary dot", "Today"],
  ["text-slate-70 line-through", "Disabled day"],
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use a date picker for a day, a date range, an exact instant (point-in-time recovery, token expiry) or a duration (OpsRequest timeouts). The field looks like <RouterLink to="/components/input">Input</RouterLink> and opens a calendar in a popover; the value is a plain string you can put straight into a manifest.</p>
  <ComponentPlayground
    tag="AcDatePicker"
    :component="AcDatePicker"
    :controls="[
      { prop: 'label', type: 'text' },
      { prop: 'mode', type: 'select', options: ['date', 'datetime', 'duration'] },
      { prop: 'range', type: 'boolean' },
      { prop: 'clearable', type: 'boolean' },
      { prop: 'required', type: 'boolean' },
      { prop: 'disabled', type: 'boolean' },
      { prop: 'errorMsg', type: 'text' },
    ]"
    :initial="{ label: 'Backup Date', mode: 'date', range: false, clearable: true, required: false, disabled: false, errorMsg: '' }"
    :defaults="{ label: '', mode: 'date', range: false, clearable: false, required: false, disabled: false, errorMsg: '' }"
    :extra="{ modelValue: null, class: 'max-w-80' }"
    extra-code='v-model="value"'
    :script="script"
  />
  <Callout type="note">Switching <code class="prose-code">mode</code> or <code class="prose-code">range</code> changes the shape of <code class="prose-code">v-model</code>, so clear the value when you do it at runtime.</Callout>

  <DocHeading id="value-format">Value format</DocHeading>
  <p><code class="prose-code">v-model</code> is always a string (or a pair of strings), never a <code class="prose-code">Date</code>, so it round-trips through YAML, JSON and URLs. It is <code class="prose-code">null</code> when empty. Incoming values are read leniently: any ISO 8601 string works, and a wall-clock string without an offset such as <code class="prose-code">2026-09-30T14:05</code> (what <code class="prose-code">&lt;input type="datetime-local"&gt;</code> produced) is read in <code class="prose-code">time-zone</code>.</p>
  <div class="mb-8 overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Mode</th><th class="h-9 px-4 font-medium">Meaning</th><th class="h-9 px-4 font-medium">v-model</th></tr>
      </thead>
      <tbody>
        <tr v-for="[mode, meaning, example] in formats" :key="mode" class="border-t border-border-light first:border-0">
          <td class="px-4 py-3 whitespace-nowrap"><code class="prose-code">{{ mode }}</code></td>
          <td class="px-4 py-3">{{ meaning }}</td>
          <td class="px-4 py-3 whitespace-nowrap"><code class="prose-code">{{ example }}</code></td>
        </tr>
      </tbody>
    </table>
  </div>

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="date" :level="3">Date</DocHeading>
  <p>The default mode picks a calendar day. <code class="prose-code">min-date</code> greys out earlier days; <code class="prose-code">clearable</code> adds an ✕.</p>
  <ComponentExample name="date-picker/DatePickerBasic" />
  <DocHeading id="datetime" :level="3">Date and time</DocHeading>
  <p><code class="prose-code">mode="datetime"</code> adds hours and minutes (24-hour), and <code class="prose-code">show-seconds</code> a seconds box. Times are shown and picked in <code class="prose-code">time-zone</code> but stored in UTC. A time outside <code class="prose-code">min-date</code>/<code class="prose-code">max-date</code> can't be applied. Here it bounds a point-in-time recovery to the archiver's window.</p>
  <ComponentExample name="date-picker/DatePickerDateTime" />
  <DocHeading id="range" :level="3">Date range and presets</DocHeading>
  <p><code class="prose-code">range</code> picks a start and an end with two clicks. <code class="prose-code">presets</code> list quick picks; a preset's <code class="prose-code">duration</code> counts back from now, or give a <code class="prose-code">value()</code> function.</p>
  <ComponentExample name="date-picker/DatePickerRange" />
  <DocHeading id="datetime-range" :level="3">Time window</DocHeading>
  <p>Combine <code class="prose-code">mode="datetime"</code> and <code class="prose-code">range</code> for log and metrics windows. Presets apply at once; a custom window needs Apply.</p>
  <ComponentExample name="date-picker/DatePickerDateTimeRange" />
  <DocHeading id="disabled-dates" :level="3">Disabled days and locale</DocHeading>
  <p><code class="prose-code">is-date-disabled</code> receives each day as <code class="prose-code">YYYY-MM-DD</code>. <code class="prose-code">locale</code> and <code class="prose-code">week-starts-on</code> change month names, weekday order and the field text.</p>
  <ComponentExample name="date-picker/DatePickerDisabledDates" />
  <DocHeading id="duration" :level="3">Duration</DocHeading>
  <p><code class="prose-code">mode="duration"</code> replaces the form-builder <code class="prose-code">time-picker</code>. People set days, hours and minutes; <code class="prose-code">v-model</code> is a Go duration (<code class="prose-code">26h30m</code>) that Kubernetes accepts for fields such as <code class="prose-code">spec.timeout</code>. Days fold into hours because Go durations have no day unit.</p>
  <ComponentExample name="date-picker/DatePickerDuration" />
  <DocHeading id="states" :level="3">Error, disabled and sizes</DocHeading>
  <ComponentExample name="date-picker/DatePickerStates" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>The field is a button with <code class="prose-code">aria-haspopup="dialog"</code> and <code class="prose-code">aria-expanded</code>; its name is the label plus the current value. ↓ also opens it.</li>
    <li>The popover is a modal <code class="prose-code">role="dialog"</code> following the WAI-ARIA date picker dialog pattern. Focus moves to the selected day (or today), Tab stays inside, and Escape or choosing a day closes it and returns focus to the field.</li>
    <li>The calendar is a <code class="prose-code">role="grid"</code> labelled by the month. ← → move a day, ↑ ↓ a week, Home / End to the start or end of the week, Page Up / Page Down a month, Shift + Page Up / Page Down a year, Enter or Space selects.</li>
    <li>Each day has its full date as its name, today is marked <code class="prose-code">aria-current="date"</code>, and disabled days are <code class="prose-code">aria-disabled</code> but still reachable so the grid stays navigable.</li>
    <li>Hours, minutes and duration parts are <code class="prose-code">role="spinbutton"</code> inputs: ↑ ↓ step, Page Up / Page Down step by 10, or type digits.</li>
  </ul>

  <ApiTables component="AcDatePicker" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr v-for="[cls, use] in theme" :key="cls" class="border-t border-border-light first:border-0">
          <td class="px-4 py-3"><code class="prose-code">{{ cls }}</code></td>
          <td class="px-4 py-3">{{ use }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
