export const steps = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 93, 95, 97] as const;

export interface Scale {
  name: string;
  source: string;
  use: string;
  alias?: { name: string; step: number };
  value: (step: number) => string;
}

const hsl = (h: number | string, s: string, l: number) => `hsl(${h} ${s} ${l}%)`;

export const scales: Scale[] = [
  {
    name: "primary",
    source: "$primary-N",
    use: "AppsCode green. Main actions, links, active and checked states. Re-huable at runtime.",
    alias: { name: "primary", step: 30 },
    value: (l) => hsl("var(--primary-hue)", "var(--primary-saturation)", l),
  },
  {
    name: "secondary",
    source: "$secondary-N",
    use: "AppsCode dark teal — the “Apps” in the wordmark. Dark brand surfaces, secondary badges.",
    alias: { name: "secondary", step: 20 },
    value: (l) => hsl("var(--secondary-hue)", "var(--secondary-saturation)", l),
  },
  { name: "green", source: "$green-N", use: "Success: Ready, Running, completed.", alias: { name: "success", step: 40 }, value: (l) => hsl(141, "53%", l) },
  { name: "blue", source: "$blue-N", use: "Info: Provisioning, neutral notices.", alias: { name: "info", step: 50 }, value: (l) => hsl(217, "71%", l) },
  { name: "yellow", source: "$yellow-N", use: "Warning: quota, Halted, needs attention.", alias: { name: "warning", step: 50 }, value: (l) => hsl(38, "93%", l) },
  { name: "red", source: "$red-N", use: "Danger: Failed, Critical, destructive actions, errors.", alias: { name: "danger", step: 40 }, value: (l) => hsl(348, "100%", l) },
  { name: "purple", source: "$purple-N", use: "Accent for charts and tags. Not a status.", value: (l) => hsl(286, "66%", l) },
  { name: "gray", source: "$gray-N", use: "Pure neutral: default badges, scrollbars, rules.", value: (l) => hsl(0, "0%", l) },
];

export const slate: [number, string][] = [
  [5, "#020617"],
  [10, "#0f172a"],
  [20, "#1e293b"],
  [30, "#334155"],
  [40, "#475569"],
  [50, "#64748b"],
  [60, "#94a3b8"],
  [70, "#cbd5e1"],
  [80, "#e2e8f0"],
  [90, "#f1f5f9"],
  [95, "#f8fafc"],
];

export const semantic = [
  { token: "heading", cls: "text-heading", source: "$color-heading", ref: "slate-5", use: "Headings and emphasised labels" },
  { token: "body", cls: "text-body", source: "$color-text", ref: "slate-30", use: "Body copy — 10.4:1 on white" },
  { token: "label", cls: "text-label", source: "$color-label", ref: "slate-40", use: "Form labels, captions, secondary text" },
  { token: "link", cls: "text-link", source: "$color-link", ref: "slate-20", use: "Neutral navigation links" },
  { token: "border-light", cls: "border-border-light", source: "$color-border-light", ref: "slate-90", use: "Dividers inside cards and between rows" },
  { token: "border", cls: "border-border", source: "$color-border", ref: "slate-80", use: "Default 1px border (decorative, 1.2:1)" },
  { token: "border-dark", cls: "border-border-dark", source: "$color-border-dark", ref: "slate-70", use: "Input edges, stronger dividers" },
  { token: "sidebar", cls: "bg-sidebar", source: "$color-sidebar", ref: "primary hue · 10% · 5%", use: "Console left sidebar" },
];
