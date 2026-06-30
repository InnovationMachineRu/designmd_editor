// Shared Tailwind class strings for the editor chrome (not the design preview).

export const inputCls =
  "w-full bg-app-panel-2/60 border border-app-border rounded-lg px-3 py-2 text-sm text-app-text outline-none focus:border-app-accent focus:bg-app-panel-2 transition-colors placeholder:text-app-muted/70";

export const labelCls =
  "block text-[11px] font-medium uppercase tracking-wide text-app-muted mb-1.5";

export const selectCls =
  "bg-app-panel-2/60 border border-app-border rounded-lg px-2.5 py-2 text-sm text-app-text outline-none focus:border-app-accent transition-colors cursor-pointer";

export const btnCls =
  "inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed";

// Primary action: brass key with ink text — the one lit control.
export const btnPrimaryCls = `${btnCls} bg-app-accent text-app-bg font-semibold hover:bg-app-accent-2 active:translate-y-px`;

export const btnGhostCls = `${btnCls} border border-app-border text-app-text hover:bg-app-panel-2 hover:border-app-muted/40`;

export const iconBtnCls =
  "inline-flex items-center justify-center w-8 h-8 rounded-lg text-app-muted hover:text-app-text hover:bg-app-panel-2 transition-colors text-xs";

export const chipCls =
  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium";
