// Shared Tailwind class strings for the editor chrome (not the design preview).

export const inputCls =
  "w-full bg-app-panel-2 border border-app-border rounded-md px-2.5 py-1.5 text-sm text-app-text outline-none focus:border-app-accent transition-colors placeholder:text-app-muted";

export const labelCls = "block text-xs font-medium text-app-muted mb-1";

export const selectCls =
  "bg-app-panel-2 border border-app-border rounded-md px-2 py-1.5 text-sm text-app-text outline-none focus:border-app-accent transition-colors cursor-pointer";

export const btnCls =
  "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

export const btnPrimaryCls = `${btnCls} bg-app-accent text-white hover:bg-app-accent/90`;

export const btnGhostCls = `${btnCls} border border-app-border text-app-text hover:bg-app-panel-2`;

export const iconBtnCls =
  "inline-flex items-center justify-center w-7 h-7 rounded-md text-app-muted hover:text-app-text hover:bg-app-panel-2 transition-colors text-xs";

export const chipCls =
  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium";
