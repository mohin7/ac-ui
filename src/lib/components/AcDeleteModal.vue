<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Trash2 } from "@lucide/vue";
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
        <Trash2 class="size-5" aria-hidden="true" />
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
      <AcButton title="Cancel" color="white" :disabled="loading" data-ac-ds data-testid="ac-delete-modal-cancel" @click="cancel" />
      <AcButton
        :title="confirmText"
        color="danger"
        :loading="loading"
        :disabled="!canConfirm"
        data-ac-ds
        data-testid="ac-delete-modal-confirm"
        @click="emit('confirm', itemName)"
      />
    </template>
  </AcModal>
</template>
