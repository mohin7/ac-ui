<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, ref, useId, watch } from "vue";
import { ChevronDown, LogOut } from "@lucide/vue";
import AcFontScale from "./AcFontScale.vue";
import AcThemeMode from "./AcThemeMode.vue";
import type { Component } from "vue";

export interface UserMenuItem {
  /** Text of the row. */
  label: string;
  /** A Lucide icon component. */
  icon?: Component;
  /** Route; rendered as `RouterLink` when vue-router is installed. */
  to?: string | object;
  /** Plain URL. */
  href?: string;
  /** Greys the row out. */
  disabled?: boolean;
}

export interface Props {
  /** The person's name or username. The avatar shows its initials. */
  name: string;
  /** Second line in the menu header, usually the email address. */
  email?: string;
  /** Profile photo. Falls back to initials when it's missing or fails to load. */
  avatarUrl?: string;
  /** Makes the menu header a link to the profile page. */
  profileUrl?: string;
  /** Rows between the header and Sign out: `{ label, icon?, to?, href?, disabled? }`. Emits `select`. Use the default slot for anything custom. */
  items?: UserMenuItem[];
  /** Adds the Light / Dark / System switch (`AcThemeMode`). */
  showThemeMode?: boolean;
  /** Adds a text-size switch (`AcFontScale`) that scales the whole interface. */
  showFontScale?: boolean;
  /** Shows the name next to the avatar in the trigger (from 640px up). */
  showName?: boolean;
  /** Makes Sign out a link to this URL, e.g. `${accountsDomain}/user/logout`. `logout` is emitted either way. */
  logoutUrl?: string;
  /** Text of the sign-out row. */
  logoutLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  email: "",
  avatarUrl: "",
  profileUrl: "",
  items: () => [],
  showThemeMode: false,
  showFontScale: false,
  showName: true,
  logoutUrl: "",
  logoutLabel: "Sign out",
});

/** Whether the menu is open. Bind with `v-model:open`. */
const open = defineModel<boolean>("open", { default: false });

const emit = defineEmits<{
  select: [item: UserMenuItem];
  logout: [];
  "set:theme": [theme: "light" | "dark"];
}>();

defineSlots<{
  /** Custom rows after `items`. Give each focusable row `role="menuitem"`, `tabindex="-1"` and the `itemClass` classes; call `close()` after an action. */
  default?: (props: { close: () => void; itemClass: string }) => unknown;
}>();

const ITEM_CLASS =
  "flex h-8 w-full cursor-pointer items-center gap-2.5 rounded-6 px-2.5 text-left text-base text-body outline-none transition-colors hover:bg-surface-muted hover:text-heading focus-visible:bg-surface-muted focus-visible:text-heading aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-muted";
const TARGETS = '[role="menuitem"]:not([aria-disabled="true"]), [role="radio"]';

// Looked up on the app instead of imported, so vue-router stays optional.
const routerLink = getCurrentInstance()?.appContext.components.RouterLink as Component | undefined;

const id = useId();
const triggerId = `${id}-trigger`;
const menuId = `${id}-menu`;
const trigger = ref<HTMLElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const imageFailed = ref(false);
const placement = ref<{ top?: number; bottom?: number; right: number }>({ top: 0, right: 0 });

const initials = computed(() => {
  const words = props.name.trim().split(/[\s._-]+/).filter(Boolean);
  if (!words.length) return "?";
  const first = words[0]!.charAt(0);
  const last = words.length > 1 ? words[words.length - 1]!.charAt(0) : "";
  return (first + last).toUpperCase();
});
const showImage = computed(() => !!props.avatarUrl && !imageFailed.value);

function itemTag(item: UserMenuItem): Component | string {
  if (item.to && routerLink && !item.disabled) return routerLink;
  if (item.to || item.href) return "a";
  return "button";
}

function itemAttrs(item: UserMenuItem) {
  const tag = itemTag(item);
  if (tag === routerLink) return { to: item.to };
  if (tag === "a") return item.disabled ? { "aria-disabled": "true" } : { href: item.href ?? (typeof item.to === "string" ? item.to : undefined) };
  return { type: "button", "aria-disabled": item.disabled ? "true" : undefined };
}

function targets() {
  return [...(panel.value?.querySelectorAll<HTMLElement>(TARGETS) ?? [])];
}

function focusAt(index: number) {
  const list = targets();
  if (!list.length) return;
  list[(index + list.length) % list.length]!.focus();
}

function place() {
  const el = trigger.value;
  if (!el) return;
  const r = el.getBoundingClientRect();
  const gap = 6;
  const height = panel.value?.offsetHeight ?? 320;
  const right = Math.max(8, window.innerWidth - r.right);
  const below = window.innerHeight - r.bottom - gap - 8;
  placement.value =
    below < height && r.top > below ? { bottom: window.innerHeight - r.top + gap, right } : { top: r.bottom + gap, right };
}

async function openMenu(focus: "first" | "last" = "first") {
  open.value = true;
  await nextTick();
  place();
  focusAt(focus === "first" ? 0 : -1);
}

function close(refocus = true) {
  if (!open.value) return;
  open.value = false;
  if (refocus) trigger.value?.focus();
}

function onTriggerKeydown(e: KeyboardEvent) {
  if (["Enter", " ", "ArrowDown"].includes(e.key)) {
    e.preventDefault();
    openMenu("first");
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    openMenu("last");
  }
}

function onMenuKeydown(e: KeyboardEvent) {
  const list = targets();
  const current = list.indexOf(document.activeElement as HTMLElement);
  if (e.key === "ArrowDown") {
    e.preventDefault();
    focusAt(current + 1);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    focusAt(current - 1);
  } else if (e.key === "Home") {
    e.preventDefault();
    focusAt(0);
  } else if (e.key === "End") {
    e.preventDefault();
    focusAt(-1);
  } else if (e.key === "Escape") {
    e.preventDefault();
    e.stopPropagation();
    close();
  } else if (e.key === "Tab") {
    // Back on the trigger, the browser's own Tab then moves to the next control on the page.
    close();
  }
}

function choose(item: UserMenuItem) {
  if (item.disabled) return;
  emit("select", item);
  close();
}

function logout() {
  emit("logout");
  close(false);
}

function onPointerDown(e: PointerEvent) {
  const t = e.target as Node;
  if (trigger.value?.contains(t) || panel.value?.contains(t)) return;
  close(false);
}

function onViewportChange() {
  place();
}

function unlisten() {
  document.removeEventListener("pointerdown", onPointerDown, true);
  window.removeEventListener("scroll", onViewportChange, true);
  window.removeEventListener("resize", onViewportChange);
}

watch(open, (v) => {
  if (!v) return unlisten();
  document.addEventListener("pointerdown", onPointerDown, true);
  window.addEventListener("scroll", onViewportChange, true);
  window.addEventListener("resize", onViewportChange);
  nextTick(place);
});

watch(
  () => props.avatarUrl,
  () => (imageFailed.value = false),
);

onBeforeUnmount(unlisten);
</script>

<template>
  <div class="inline-flex" data-ac-ds data-testid="ac-user-menu">
    <button
      :id="triggerId"
      ref="trigger"
      type="button"
      aria-haspopup="menu"
      :aria-expanded="open"
      :aria-controls="open ? menuId : undefined"
      :aria-label="`${name}, account menu`"
      class="group inline-flex h-8 shrink-0 cursor-pointer items-center gap-2 rounded-50 p-0.5 transition-colors hover:bg-surface-sunken focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
      :class="[showName && 'sm:pr-2', open && 'bg-surface-sunken']"
      data-ac-ds
      data-testid="ac-user-menu-trigger"
      @click="open ? close() : openMenu()"
      @keydown="onTriggerKeydown"
    >
      <span
        class="inline-flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-90 text-xs font-semibold text-primary-20 ring-1 ring-border"
        aria-hidden="true"
      >
        <img v-if="showImage" :src="avatarUrl" alt="" class="size-full object-cover" @error="imageFailed = true" />
        <template v-else>{{ initials }}</template>
      </span>
      <template v-if="showName">
        <span class="hidden max-w-36 truncate text-base font-medium text-heading sm:block">{{ name }}</span>
        <ChevronDown
          class="hidden size-3.5 shrink-0 text-muted transition-transform duration-150 motion-reduce:transition-none sm:block"
          :class="open && 'rotate-180'"
          aria-hidden="true"
        />
      </template>
    </button>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-150 ease-out motion-reduce:transition-none"
        enter-from-class="opacity-0 -translate-y-1 scale-[0.98]"
        leave-active-class="transition duration-100 ease-in"
        leave-to-class="opacity-0"
      >
        <div
          v-if="open"
          :id="menuId"
          ref="panel"
          role="menu"
          :aria-labelledby="triggerId"
          class="fixed z-[90] w-72 max-w-[calc(100vw-16px)] overflow-hidden rounded-10 border border-border bg-surface shadow-lg"
          :style="{
            top: placement.top !== undefined ? `${placement.top}px` : undefined,
            bottom: placement.bottom !== undefined ? `${placement.bottom}px` : undefined,
            right: `${placement.right}px`,
          }"
          data-ac-ds
          data-testid="ac-user-menu-panel"
          @keydown="onMenuKeydown"
        >
          <component
            :is="profileUrl ? 'a' : 'div'"
            :href="profileUrl || undefined"
            :role="profileUrl ? 'menuitem' : 'presentation'"
            :tabindex="profileUrl ? -1 : undefined"
            class="flex items-center gap-3 border-b border-border-light px-3.5 py-3 outline-none"
            :class="profileUrl && 'transition-colors hover:bg-surface-muted focus-visible:bg-surface-muted'"
          >
            <span
              class="inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-90 text-base font-semibold text-primary-20 ring-1 ring-border"
              aria-hidden="true"
            >
              <img v-if="showImage" :src="avatarUrl" alt="" class="size-full object-cover" @error="imageFailed = true" />
              <template v-else>{{ initials }}</template>
            </span>
            <span class="min-w-0 flex-1">
              <span class="block truncate text-base font-medium text-heading">{{ name }}</span>
              <span v-if="email" class="block truncate text-xs text-muted">{{ email }}</span>
            </span>
          </component>

          <div v-if="items.length || $slots.default" role="group" class="flex flex-col gap-px p-1">
            <component
              :is="itemTag(item)"
              v-for="item in items"
              :key="item.label"
              v-bind="itemAttrs(item)"
              role="menuitem"
              tabindex="-1"
              :class="ITEM_CLASS"
              @click="choose(item)"
            >
              <component :is="item.icon" v-if="item.icon" aria-hidden="true" />
              <span class="min-w-0 flex-1 truncate">{{ item.label }}</span>
            </component>
            <slot :close="close" :item-class="ITEM_CLASS" />
          </div>

          <div v-if="showThemeMode" role="group" :aria-labelledby="`${id}-theme`" class="border-t border-border-light px-3.5 py-2.5">
            <p :id="`${id}-theme`" class="mb-1.5 text-xs font-medium text-label">Theme</p>
            <AcThemeMode display="labels" @set:theme="emit('set:theme', $event)" />
          </div>

          <div v-if="showFontScale" role="group" :aria-labelledby="`${id}-scale`" class="border-t border-border-light px-3.5 py-2.5">
            <p :id="`${id}-scale`" class="mb-1.5 text-xs font-medium text-label">Text size</p>
            <AcFontScale display="labels" />
          </div>

          <div role="group" class="border-t border-border-light p-1">
            <component
              :is="logoutUrl ? 'a' : 'button'"
              :href="logoutUrl || undefined"
              :type="logoutUrl ? undefined : 'button'"
              role="menuitem"
              tabindex="-1"
              :class="ITEM_CLASS"
              data-ac-ds
              data-testid="ac-user-menu-logout"
              @click="logout"
            >
              <LogOut aria-hidden="true" />
              <span>{{ logoutLabel }}</span>
            </component>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
