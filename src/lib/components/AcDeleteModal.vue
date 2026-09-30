<script setup lang="ts">
import { computed, ref, watch } from "vue";
import AcButton from "./AcButton.vue";
import AcInput from "./AcInput.vue";
import AcModal from "./AcModal.vue";

export interface Props {
  /** Heading, e.g. "Delete Database". */
  title?: string;
  /** The question. The item name is shown in bold after it. */
  message?: string;
  /** Name of the thing being deleted, e.g. `demo-postgres`. */
  itemName?: string;
  /** Extra consequence shown under the question, e.g. "Backups are kept for 7 days." */
  detail?: string;
  /** Label of the destructive button. */
  confirmText?: string;
  /** Requires typing `itemName` before the delete button enables. Use for irreversible deletes. */
  confirmByTyping?: boolean;
  /** Shows a spinner on the delete button and blocks closing while the request runs. */
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Delete",
  message: "Are you sure you want to delete",
  itemName: "",
  detail: "",
  confirmText: "Delete",
  confirmByTyping: false,
  loading: false,
});

const emit = defineEmits<{ confirm: [itemName: string]; cancel: [] }>();

defineSlots<{
  /** Extra content under the message, e.g. a "Also delete backups" checkbox. */
  default?: () => unknown;
}>();

/** Whether the dialog is open. Bind with `v-model:open`. */
const open = defineModel<boolean>("open", { default: false });

const typed = ref("");
watch(open, (v) => v && (typed.value = ""));
const canConfirm = computed(() => !props.confirmByTyping || typed.value === props.itemName);

const cancel = () => {
  open.value = false;
  emit("cancel");
};
</script>

<template>
  <AcModal v-model:open="open" :title="title" size="small" :closable="!loading" :close-on-outside-click="!loading" @close="emit('cancel')">
    <div class="flex gap-4">
      <span class="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-red-95 text-red-40 ring-8 ring-red-97" aria-hidden="true">
        <svg class="size-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3.5 5.5h13M8 5.5V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5M5.5 5.5l.7 10.1a1.5 1.5 0 0 0 1.5 1.4h4.6a1.5 1.5 0 0 0 1.5-1.4l.7-10.1M8.5 9v4.5M11.5 9v4.5" />
        </svg>
      </span>
      <div class="min-w-0 flex-1 pt-0.5">
        <p class="text-lg leading-6 text-heading">
          {{ message }}<template v-if="itemName">{{ " " }}<strong class="font-semibold break-all">{{ itemName }}</strong></template>?
        </p>
        <p v-if="detail" class="mt-1 text-base text-label">{{ detail }}</p>
        <div v-if="confirmByTyping && itemName" class="mt-4">
          <p class="mb-2 text-xs text-label">
            Type <code class="rounded-4 bg-surface-muted px-1 py-0.5 font-mono text-heading ring-1 ring-border">{{ itemName }}</code> to confirm.
          </p>
          <AcInput v-model="typed" :label="`Resource name`" autocomplete="off" />
        </div>
        <div v-if="$slots.default" class="mt-4"><slot /></div>
      </div>
    </div>
    <template #footer>
      <AcButton title="Cancel" color="white" :disabled="loading" data-testid="ac-delete-modal-cancel" @click="cancel" />
      <AcButton
        :title="confirmText"
        color="danger"
        :loading="loading"
        :disabled="!canConfirm"
        data-testid="ac-delete-modal-confirm"
        @click="emit('confirm', itemName)"
      />
    </template>
  </AcModal>
</template>
