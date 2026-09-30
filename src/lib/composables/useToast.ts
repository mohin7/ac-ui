import { readonly, ref } from "vue";

export type ToastTone = "neutral" | "success" | "error" | "warning" | "info";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  /** A second line under the title. */
  description?: string;
  /** Milliseconds before it closes on its own. 0 keeps it until dismissed. Default 5000. */
  duration?: number;
  /** One button in the toast, e.g. `{ label: "Undo", onClick }`. Clicking it also closes the toast. */
  action?: ToastAction;
  /** Shows the close button. Default true. */
  dismissible?: boolean;
  /** Reuse an id to update a toast in place, e.g. "Backing up…" → "Backup complete". */
  id?: string;
}

export interface Toast extends Required<Pick<ToastOptions, "duration" | "dismissible">> {
  id: string;
  tone: ToastTone;
  title: string;
  description?: string;
  action?: ToastAction;
  /** Bumped on every update so the toaster restarts the timer. */
  version: number;
}

const DEFAULT_DURATION = 5000;

// One queue for the whole app, so any component or plain module can raise a toast.
const toasts = ref<Toast[]>([]);
let counter = 0;

function add(tone: ToastTone, title: string, options: ToastOptions = {}) {
  const id = options.id ?? `toast-${++counter}`;
  const existing = toasts.value.find((t) => t.id === id);
  const next: Toast = {
    id,
    tone,
    title,
    description: options.description,
    action: options.action,
    duration: options.duration ?? DEFAULT_DURATION,
    dismissible: options.dismissible ?? true,
    version: (existing?.version ?? 0) + 1,
  };
  toasts.value = existing ? toasts.value.map((t) => (t.id === id ? next : t)) : [...toasts.value, next];
  return id;
}

function dismiss(id: string) {
  toasts.value = toasts.value.filter((t) => t.id !== id);
}

function clear() {
  toasts.value = [];
}

/**
 * Raise toasts from anywhere. Mount `<AcToaster />` once in the app root to show them.
 * Each call returns the toast's id for `dismiss(id)` or for updating it with `{ id }`.
 */
export function useToast() {
  return {
    /** Every toast currently queued, oldest first. Read-only; used by AcToaster. */
    toasts: readonly(toasts),
    toast: (title: string, options?: ToastOptions) => add("neutral", title, options),
    success: (title: string, options?: ToastOptions) => add("success", title, options),
    error: (title: string, options?: ToastOptions) => add("error", title, options),
    warning: (title: string, options?: ToastOptions) => add("warning", title, options),
    info: (title: string, options?: ToastOptions) => add("info", title, options),
    dismiss,
    clear,
  };
}
