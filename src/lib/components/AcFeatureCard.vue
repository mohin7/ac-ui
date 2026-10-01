<script setup lang="ts">
import { computed, getCurrentInstance, useId } from "vue";
import { ArrowRight, ArrowUpRight, Check } from "lucide-vue-next";
import AcBadge from "./AcBadge.vue";
import type { Component } from "vue";
import type { Tone } from "./types";

export interface Props {
  /** Name of the feature, product or option. Also the card's accessible name. */
  title: string;
  /** One or two sentences on what it does. Clamped to three lines. Old `card-sub-title` slot. */
  description?: string;
  /** A Lucide icon, shown in a tinted tile. Or use the `icon` slot. */
  icon?: Component;
  /** Logo image URL, e.g. a product or cloud-provider logo. Takes the place of `icon`. */
  logo?: string;
  /** Alt text for `logo`. Leave empty when the title already names it. */
  logoAlt?: string;
  /** A short status shown as a badge, e.g. "Enabled" or "Not installed". */
  status?: string;
  /** Colour of the `status` badge. */
  statusColor?: Tone | "default";
  /** Adds a "Required" badge. Old `isRequired`. */
  required?: boolean;
  /** Logo on top and centred text, for picking a provider or database type from a grid. Replaces the old Vendor card. */
  centered?: boolean;
  /** Makes the card a checkbox. Bind `v-model:checked`. Old CheckItemCard. */
  selectable?: boolean;
  /** Greys the card out and turns off its link, click and checkbox. */
  disabled?: boolean;
  /** Makes the card a `RouterLink` to this route. Needs vue-router in the app; without it a string is used as `href`. */
  to?: string | Record<string, unknown>;
  /** Makes the card a plain link. */
  href?: string;
  /** Link target for `href`, e.g. `_blank`. `_blank` shows an external-link arrow. */
  target?: string;
}

const props = withDefaults(defineProps<Props>(), {
  description: "",
  icon: undefined,
  logo: "",
  logoAlt: "",
  status: "",
  statusColor: "default",
  required: false,
  centered: false,
  selectable: false,
  disabled: false,
  to: undefined,
  href: undefined,
  target: undefined,
});

/** Whether a `selectable` card is ticked. Bind with `v-model:checked`. */
const checked = defineModel<boolean>("checked", { default: false });

const emit = defineEmits<{
  /** Fires when the card is clicked. Listening to it turns the card into a button. */
  click: [e: MouseEvent];
}>();

defineSlots<{
  /** Extra content under the description, e.g. "2 unaligned clusters". */
  default?: () => unknown;
  /** Replaces the icon or logo. */
  icon?: () => unknown;
  /** Replaces the `status` badge, e.g. with several badges. */
  status?: () => unknown;
  /** A row at the bottom of the card, e.g. a version or "Covers 4 topologies". */
  footer?: () => unknown;
}>();

const instance = getCurrentInstance();
// Looked up at runtime so the library doesn't depend on vue-router.
const routerLink = instance?.appContext.components.RouterLink as Component | undefined;
const id = useId();

const link = computed(() => {
  if (props.disabled || props.selectable) return null;
  if (props.to !== undefined && routerLink) return { is: routerLink, to: props.to };
  const href = props.href ?? (typeof props.to === "string" ? props.to : undefined);
  if (href) return { is: "a", href, target: props.target, rel: props.target === "_blank" ? "noopener noreferrer" : undefined };
  return null;
});

function isButton() {
  return !link.value && !props.disabled && !props.selectable && !!instance?.vnode.props?.onClick;
}

function isInteractive() {
  return !!link.value || isButton() || (props.selectable && !props.disabled);
}

function onClick(e: MouseEvent) {
  emit("click", e);
}
</script>

<template>
  <component
    :is="selectable ? 'label' : 'div'"
    :for="selectable ? `${id}-input` : undefined"
    class="group relative flex min-w-0 flex-col rounded-10 border border-border bg-surface p-4 shadow-xs transition-[border-color,box-shadow,background-color] duration-150 has-[[data-ac-card-link]:focus-visible]:ring-[3px] has-[[data-ac-card-link]:focus-visible]:ring-ring"
    :class="[
      centered && 'items-center text-center',
      isInteractive() && 'cursor-pointer hover:border-border-dark hover:shadow-sm',
      selectable &&
        'has-checked:border-primary has-checked:bg-primary-97 has-checked:shadow-[0_0_0_1px_var(--color-primary)] has-focus-visible:ring-[3px] has-focus-visible:ring-ring',
      disabled && 'cursor-not-allowed opacity-60',
    ]"
    data-testid="ac-feature-card"
  >
    <div class="flex w-full min-w-0 gap-3" :class="centered ? 'flex-col items-center' : 'items-start'">
      <span
        v-if="$slots.icon || logo || icon"
        class="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-8"
        :class="[
          centered ? 'size-12' : 'size-10',
          logo ? 'border border-border-light bg-surface-muted p-1.5' : 'bg-primary-95 text-primary-30 [&_svg]:size-5',
        ]"
        :aria-hidden="logo && logoAlt ? undefined : 'true'"
      >
        <slot name="icon">
          <img v-if="logo" :src="logo" :alt="logoAlt" class="size-full object-contain" />
          <component :is="icon" v-else />
        </slot>
      </span>

      <div class="min-w-0 flex-1" :class="centered && 'w-full'">
        <div class="flex min-w-0 items-start gap-2" :class="centered ? 'justify-center' : 'justify-between'">
          <div class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1" :class="centered && 'justify-center'">
            <h3 :id="`${id}-title`" class="min-w-0 text-lg leading-6 font-semibold tracking-[-0.01em] text-heading">
              <component
                :is="link.is"
                v-if="link"
                v-bind="{ ...link, is: undefined }"
                :aria-describedby="description ? `${id}-desc` : undefined"
                data-ac-card-link
                class="outline-none after:absolute after:inset-0 after:rounded-10"
                @click="onClick"
              >
                {{ title }}
              </component>
              <button
                v-else-if="isButton()"
                type="button"
                :aria-describedby="description ? `${id}-desc` : undefined"
                data-ac-card-link
                class="cursor-pointer text-left outline-none after:absolute after:inset-0 after:rounded-10"
                @click="onClick"
              >
                {{ title }}
              </button>
              <template v-else>{{ title }}</template>
            </h3>
            <template v-if="!centered">
              <AcBadge v-if="required" label="Required" color="warning" variant="light" rounded />
              <slot name="status">
                <AcBadge v-if="status" :label="status" :color="statusColor" variant="light" rounded dot />
              </slot>
            </template>
          </div>
          <component
            :is="target === '_blank' ? ArrowUpRight : ArrowRight"
            v-if="!centered && (link || isButton())"
            class="mt-1 size-4 shrink-0 text-slate-60 transition-[color,transform] duration-150 group-hover:text-heading motion-safe:group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </div>

        <p
          v-if="description"
          :id="`${id}-desc`"
          class="mt-1 line-clamp-3 text-base text-muted"
          :title="description"
        >
          {{ description }}
        </p>
        <div v-if="$slots.default" class="mt-2 text-base text-body">
          <slot />
        </div>
        <div v-if="centered && (required || status || $slots.status)" class="mt-2 flex flex-wrap justify-center gap-2">
          <AcBadge v-if="required" label="Required" color="warning" variant="light" rounded />
          <slot name="status">
            <AcBadge v-if="status" :label="status" :color="statusColor" variant="light" rounded dot />
          </slot>
        </div>
      </div>

      <span v-if="selectable" class="relative inline-flex size-4 shrink-0" :class="centered ? 'absolute! top-3 right-3' : 'mt-1'">
        <input
          :id="`${id}-input`"
          v-model="checked"
          type="checkbox"
          :disabled="disabled"
          :aria-labelledby="`${id}-title`"
          :aria-describedby="description ? `${id}-desc` : undefined"
          class="peer size-4 cursor-pointer appearance-none rounded-4 border border-border-dark bg-surface shadow-xs transition-[background-color,border-color] duration-150 outline-none group-hover:border-slate-60 checked:border-primary checked:bg-primary checked:shadow-button disabled:cursor-not-allowed"
        />
        <Check
          class="pointer-events-none absolute inset-0 m-auto size-3 scale-75 text-white opacity-0 transition duration-150 peer-checked:scale-100 peer-checked:opacity-100"
          :stroke-width="3"
          aria-hidden="true"
        />
      </span>
    </div>

    <div
      v-if="$slots.footer"
      class="mt-auto flex w-full min-w-0 flex-wrap items-center gap-x-3 gap-y-1 pt-3 text-xs text-muted"
      :class="centered ? 'justify-center' : 'justify-between'"
    >
      <slot name="footer" />
    </div>
  </component>
</template>
