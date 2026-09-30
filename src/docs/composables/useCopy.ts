import { ref } from "vue";

export function useCopy(timeout = 1500) {
  const copied = ref(false);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API unavailable (http, iframe): fall back to a hidden textarea.
      const ta = Object.assign(document.createElement("textarea"), { value: text });
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.append(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    copied.value = true;
    clearTimeout(timer);
    timer = setTimeout(() => (copied.value = false), timeout);
  };
  return { copied, copy };
}
