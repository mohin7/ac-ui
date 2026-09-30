<script setup lang="ts">
import { computed, ref, watch } from "vue";

export interface Props {
  /** Person or organisation name. Gives the initials, the colour and the default accessible name. */
  name?: string;
  /** Image URL. Falls back to the initials when it's empty or fails to load. */
  imgUrl?: string;
  /** Accessible name. Defaults to `name`; pass an empty string when the name is already written next to the avatar. */
  alt?: string;
  /** Diameter: `xs` 20px, `small` 24px, `normal` 32px, `large` 48px. */
  size?: "xs" | "small" | "normal" | "large";
  /** `circle` for people, `square` (rounded corners) for organisations, teams and products. */
  shape?: "circle" | "square";
  /** Adds a presence dot in the bottom-right corner. */
  status?: "online" | "away" | "busy" | "offline";
  /** Shows `+N` instead of a picture, as the last item of an avatar group. */
  overflowCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  name: "",
  imgUrl: "",
  alt: undefined,
  size: "normal",
  shape: "circle",
  status: undefined,
  overflowCount: 0,
});

const sizes = {
  xs: { box: "size-5 text-xm", dot: "size-1.5", square: "rounded-4" },
  small: { box: "size-6 text-sm", dot: "size-2", square: "rounded-4" },
  normal: { box: "size-8 text-xs", dot: "size-2.5", square: "rounded-6" },
  large: { box: "size-12 text-xl", dot: "size-3", square: "rounded-10" },
} as const;

// -90 tint with -20 text reads at about 7:1 in both themes. The tint is translucent in dark mode,
// so the root's bg-surface keeps overlapping avatars in a group from showing through.
const palette = [
  "bg-primary-90 text-primary-20",
  "bg-blue-90 text-blue-20",
  "bg-purple-90 text-purple-20",
  "bg-yellow-90 text-yellow-20",
  "bg-red-90 text-red-20",
  "bg-secondary-90 text-secondary-20",
] as const;

const statuses = {
  online: { dot: "bg-success", label: "Online" },
  away: { dot: "bg-warning", label: "Away" },
  busy: { dot: "bg-danger", label: "Busy" },
  offline: { dot: "bg-slate-60", label: "Offline" },
} as const;

const failed = ref(false);

const showImage = computed(() => !!props.imgUrl && !failed.value && !props.overflowCount);

const initials = computed(() => {
  const words = props.name.split("@")[0]!.split(/[\s._-]+/).filter(Boolean);
  if (!words.length) return "";
  const letters = words.length > 1 ? words[0]![0]! + words[1]![0]! : words[0]!.slice(0, 1);
  return letters.toUpperCase();
});

const colorClass = computed(() => {
  if (props.overflowCount || !props.name) return "bg-surface-sunken text-label";
  let hash = 0;
  for (const ch of props.name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return palette[hash % palette.length];
});

const accessibleName = computed(() => {
  if (props.overflowCount) return props.alt ?? `${props.overflowCount} more`;
  const base = props.alt ?? props.name;
  if (!base) return "";
  return props.status ? `${base} (${statuses[props.status].label})` : base;
});

const radius = computed(() => (props.shape === "circle" ? "rounded-full" : sizes[props.size].square));

watch(
  () => props.imgUrl,
  () => (failed.value = false),
);
</script>

<template>
  <span
    class="relative inline-flex shrink-0 bg-surface align-middle"
    :class="[sizes[size].box, radius]"
    :role="accessibleName ? 'img' : undefined"
    :aria-label="accessibleName || undefined"
    :aria-hidden="!accessibleName || undefined"
    data-testid="ac-avatar"
  >
    <span
      class="inline-flex size-full items-center justify-center overflow-hidden font-semibold tracking-[-0.01em] select-none"
      :class="[radius, showImage ? 'bg-surface-sunken' : colorClass]"
    >
      <img v-if="showImage" :src="imgUrl" alt="" class="size-full object-cover" @error="failed = true" />
      <span v-else-if="overflowCount" class="tabular-nums" aria-hidden="true">+{{ overflowCount }}</span>
      <span v-else aria-hidden="true">{{ initials }}</span>
    </span>
    <!-- a hairline so photos with white edges keep their shape -->
    <span class="pointer-events-none absolute inset-0 ring-1 ring-heading/8 ring-inset" :class="radius" aria-hidden="true" />
    <span
      v-if="status && !overflowCount"
      class="absolute right-0 bottom-0 rounded-full ring-2 ring-surface"
      :class="[sizes[size].dot, statuses[status].dot, shape === 'square' && 'translate-x-1/4 translate-y-1/4']"
      aria-hidden="true"
    />
  </span>
</template>
