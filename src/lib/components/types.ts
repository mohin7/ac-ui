export type Tone = "primary" | "info" | "success" | "warning" | "danger";
export type Variant = "solid" | "light" | "outlined";

export interface Option<T = unknown> {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SelectOption<V = string | number> {
  value: V;
  label: string;
  description?: string;
  disabled?: boolean;
  /** Options with the same group are listed under that heading. */
  group?: string;
}
