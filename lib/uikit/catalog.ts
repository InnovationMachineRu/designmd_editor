/**
 * A broad catalog of UI components. Users select a subset on step 2; the
 * selection plus the saved design tokens become the technical spec (ТЗ) for
 * generating a UIKit in the chosen technology.
 */

export interface UikitComponent {
  id: string;
  name: string;
  description: string;
  /** Visual/behavioral states a generated component should implement. */
  states: string[];
  /** Suggested props/attributes. */
  props: string[];
  /** Design-token roles this component binds to (for token mapping in the ТЗ). */
  tokenRoles: string[];
  /** Accessibility requirements. */
  a11y: string[];
}

export interface UikitCategory {
  id: string;
  label: string;
  components: UikitComponent[];
}

const c = (
  id: string,
  name: string,
  description: string,
  states: string[],
  props: string[],
  tokenRoles: string[],
  a11y: string[]
): UikitComponent => ({ id, name, description, states, props, tokenRoles, a11y });

export const CATALOG: UikitCategory[] = [
  {
    id: "actions",
    label: "Buttons & Actions",
    components: [
      c("button", "Button", "Primary call-to-action button.",
        ["default", "hover", "active", "focus-visible", "disabled", "loading"],
        ["variant", "size", "disabled", "loading", "iconStart", "iconEnd", "onClick"],
        ["primary", "on-primary", "rounded", "label-md"],
        ["role=button", "keyboard activation (Enter/Space)", "aria-busy when loading"]),
      c("icon-button", "Icon Button", "Compact action with an icon only.",
        ["default", "hover", "active", "focus-visible", "disabled"],
        ["icon", "label", "size", "variant", "onClick"],
        ["primary", "on-surface", "rounded-full"],
        ["aria-label required", "focus ring"]),
      c("button-group", "Button Group", "Segmented set of related actions.",
        ["default", "selected", "hover", "disabled"],
        ["items", "value", "onChange"],
        ["surface-container", "primary", "outline"],
        ["role=group", "arrow-key roving tabindex"]),
      c("fab", "Floating Action Button", "Prominent floating primary action.",
        ["default", "hover", "active", "pressed"],
        ["icon", "extended", "label", "onClick"],
        ["primary", "on-primary", "rounded-full"],
        ["aria-label", "visible focus"]),
      c("link", "Link", "Inline navigational text link.",
        ["default", "hover", "visited", "focus-visible"],
        ["href", "external"],
        ["primary", "on-surface"],
        ["underline or non-color affordance", "rel=noopener for external"]),
    ],
  },
  {
    id: "inputs",
    label: "Inputs & Forms",
    components: [
      c("text-field", "Text Field", "Single-line text input with label.",
        ["default", "focus", "filled", "error", "disabled", "readonly"],
        ["label", "value", "placeholder", "error", "type", "onChange"],
        ["surface-container-high", "on-surface", "outline", "error", "body-md"],
        ["label-for association", "aria-invalid on error", "describedby helper text"]),
      c("textarea", "Textarea", "Multi-line text input.",
        ["default", "focus", "error", "disabled"],
        ["label", "value", "rows", "onChange"],
        ["surface-container-high", "on-surface", "outline"],
        ["label association", "resize affordance"]),
      c("select", "Select", "Dropdown single choice.",
        ["default", "open", "focus", "disabled", "error"],
        ["label", "options", "value", "onChange"],
        ["surface-container-high", "on-surface", "outline"],
        ["listbox semantics", "keyboard navigation"]),
      c("checkbox", "Checkbox", "Boolean toggle in forms.",
        ["unchecked", "checked", "indeterminate", "focus", "disabled"],
        ["checked", "indeterminate", "label", "onChange"],
        ["primary", "on-primary", "outline"],
        ["native input or role=checkbox", "label association"]),
      c("radio", "Radio Group", "Mutually exclusive choice set.",
        ["unselected", "selected", "focus", "disabled"],
        ["name", "options", "value", "onChange"],
        ["primary", "outline"],
        ["role=radiogroup", "arrow-key selection"]),
      c("switch", "Switch", "On/off toggle control.",
        ["off", "on", "focus", "disabled"],
        ["checked", "label", "onChange"],
        ["primary", "surface-container-highest", "on-primary"],
        ["role=switch", "aria-checked"]),
      c("slider", "Slider", "Select a numeric value along a range.",
        ["default", "focus", "active", "disabled"],
        ["min", "max", "step", "value", "onChange"],
        ["primary", "surface-container-highest"],
        ["role=slider", "aria-valuenow/min/max", "arrow keys"]),
      c("search", "Search Field", "Input specialized for search.",
        ["default", "focus", "filled", "loading"],
        ["value", "placeholder", "onSearch", "onClear"],
        ["surface-container-high", "on-surface-variant"],
        ["role=searchbox", "clear button labeled"]),
    ],
  },
  {
    id: "navigation",
    label: "Navigation",
    components: [
      c("navbar", "Top App Bar", "Application top navigation bar.",
        ["default", "scrolled", "elevated"],
        ["title", "actions", "leading"],
        ["surface", "on-surface", "surface-container"],
        ["landmark role=banner/navigation", "skip link target"]),
      c("sidebar", "Side Navigation", "Vertical navigation drawer/rail.",
        ["default", "collapsed", "active-item", "hover"],
        ["items", "activeId", "collapsed", "onSelect"],
        ["surface-container", "primary", "on-surface"],
        ["nav landmark", "current page aria-current"]),
      c("tabs", "Tabs", "Switch between peer views.",
        ["default", "active", "hover", "focus", "disabled"],
        ["items", "value", "onChange"],
        ["primary", "on-surface", "outline-variant"],
        ["role=tablist/tab/tabpanel", "arrow-key navigation"]),
      c("breadcrumbs", "Breadcrumbs", "Hierarchical location trail.",
        ["default", "hover", "current"],
        ["items"],
        ["on-surface-variant", "primary"],
        ["nav with aria-label", "aria-current=page on last"]),
      c("pagination", "Pagination", "Navigate paged collections.",
        ["default", "active", "hover", "disabled"],
        ["page", "count", "onChange"],
        ["primary", "surface-container", "on-surface"],
        ["nav landmark", "aria-current for active page"]),
      c("menu", "Menu", "Contextual list of actions.",
        ["closed", "open", "item-hover", "item-focus", "disabled-item"],
        ["items", "trigger", "onSelect"],
        ["surface-container-high", "on-surface"],
        ["role=menu/menuitem", "focus trap + Esc to close"]),
    ],
  },
  {
    id: "data",
    label: "Data Display",
    components: [
      c("card", "Card", "Container grouping related content.",
        ["default", "hover", "selected"],
        ["elevated", "interactive", "header", "footer"],
        ["surface-container", "on-surface", "rounded-lg"],
        ["heading structure", "interactive cards focusable"]),
      c("table", "Data Table", "Tabular data with rows and columns.",
        ["default", "row-hover", "selected-row", "sorted-column"],
        ["columns", "rows", "sortable", "selectable"],
        ["surface", "on-surface", "outline-variant"],
        ["table semantics", "th scope", "sortable aria-sort"]),
      c("list", "List", "Vertical list of items.",
        ["default", "item-hover", "item-selected", "item-focus"],
        ["items", "onSelect", "dividers"],
        ["surface", "on-surface", "surface-container-high"],
        ["role=list/listitem", "keyboard navigation if interactive"]),
      c("avatar", "Avatar", "User or entity image/initials.",
        ["image", "initials", "placeholder"],
        ["src", "name", "size", "shape"],
        ["secondary-container", "on-secondary-container"],
        ["alt text or aria-label"]),
      c("badge", "Badge", "Small status/count indicator.",
        ["default", "count", "dot"],
        ["content", "color", "max"],
        ["primary", "on-primary", "error"],
        ["aria-label conveying meaning"]),
      c("chip", "Chip / Tag", "Compact element for input, filter, or choice.",
        ["default", "selected", "hover", "removable", "disabled"],
        ["label", "selected", "onRemove", "icon"],
        ["surface-container-high", "primary", "outline"],
        ["role per use (button/option)", "remove action labeled"]),
      c("tooltip", "Tooltip", "Contextual label on hover/focus.",
        ["hidden", "visible"],
        ["content", "placement"],
        ["inverse-surface", "inverse-on-surface"],
        ["aria-describedby", "shows on focus, not hover-only"]),
      c("stat", "Stat / Metric", "Highlighted key figure.",
        ["default", "positive", "negative"],
        ["label", "value", "delta"],
        ["on-surface", "on-surface-variant", "display-lg"],
        ["meaningful text alternative for trends"]),
    ],
  },
  {
    id: "feedback",
    label: "Feedback",
    components: [
      c("alert", "Alert / Banner", "Inline contextual message.",
        ["info", "success", "warning", "error", "dismissible"],
        ["severity", "title", "onDismiss"],
        ["primary", "error", "surface-container"],
        ["role=alert for urgent", "dismiss labeled"]),
      c("toast", "Toast / Snackbar", "Transient notification.",
        ["enter", "visible", "exit", "with-action"],
        ["message", "action", "duration"],
        ["inverse-surface", "inverse-on-surface", "primary"],
        ["role=status/alert", "not auto-dismiss critical messages"]),
      c("progress-bar", "Progress Bar", "Linear determinate/indeterminate progress.",
        ["determinate", "indeterminate"],
        ["value", "indeterminate"],
        ["primary", "surface-container-highest"],
        ["role=progressbar", "aria-valuenow"]),
      c("spinner", "Spinner", "Indeterminate loading indicator.",
        ["spinning"],
        ["size", "label"],
        ["primary", "outline-variant"],
        ["aria-label / aria-busy on container"]),
      c("skeleton", "Skeleton", "Loading placeholder block.",
        ["pulsing"],
        ["width", "height", "shape"],
        ["surface-container-high", "surface-container-highest"],
        ["aria-hidden, real busy state announced separately"]),
      c("empty-state", "Empty State", "Placeholder when no data exists.",
        ["default"],
        ["title", "description", "action", "illustration"],
        ["on-surface-variant", "primary"],
        ["heading + actionable next step"]),
    ],
  },
  {
    id: "overlays",
    label: "Overlays & Containers",
    components: [
      c("modal", "Modal Dialog", "Focused overlay requiring interaction.",
        ["closed", "open"],
        ["open", "title", "onClose", "size"],
        ["surface-container-high", "on-surface", "scrim"],
        ["role=dialog aria-modal", "focus trap", "Esc to close", "return focus"]),
      c("drawer", "Drawer / Sheet", "Edge-anchored sliding panel.",
        ["closed", "open"],
        ["open", "side", "onClose"],
        ["surface-container", "on-surface"],
        ["dialog semantics", "focus trap", "Esc to close"]),
      c("popover", "Popover", "Anchored floating content.",
        ["closed", "open"],
        ["trigger", "placement", "content"],
        ["surface-container-high", "outline-variant"],
        ["focus management", "Esc + outside click close"]),
      c("accordion", "Accordion", "Expandable disclosure sections.",
        ["collapsed", "expanded", "focus", "disabled"],
        ["items", "multiple", "value", "onChange"],
        ["surface", "on-surface", "outline-variant"],
        ["button headers", "aria-expanded/controls"]),
      c("tooltip-rich", "Rich Tooltip", "Tooltip with actions/links.",
        ["hidden", "visible"],
        ["content", "actions", "placement"],
        ["inverse-surface", "primary"],
        ["focusable content", "dismiss on Esc"]),
    ],
  },
  {
    id: "layout",
    label: "Layout",
    components: [
      c("container", "Container", "Max-width centered content wrapper.",
        ["default"],
        ["size", "padding"],
        ["background", "container-padding"],
        ["landmark structure respected"]),
      c("grid", "Grid", "Responsive grid layout.",
        ["default"],
        ["columns", "gap", "responsive"],
        ["card-gap", "section-margin"],
        ["logical reading order"]),
      c("divider", "Divider", "Visual separation between content.",
        ["horizontal", "vertical"],
        ["orientation", "inset"],
        ["outline-variant"],
        ["role=separator or decorative aria-hidden"]),
      c("toolbar", "Toolbar", "Row of grouped controls.",
        ["default"],
        ["items", "align"],
        ["surface-container", "on-surface"],
        ["role=toolbar", "roving tabindex"]),
    ],
  },
];

export const ALL_COMPONENTS: UikitComponent[] = CATALOG.flatMap((c) => c.components);

export function getComponent(id: string): UikitComponent | undefined {
  return ALL_COMPONENTS.find((c) => c.id === id);
}

/** Reasonable default selection covering the most common needs. */
export const DEFAULT_SELECTION = [
  "button",
  "icon-button",
  "text-field",
  "checkbox",
  "switch",
  "select",
  "card",
  "list",
  "badge",
  "chip",
  "tabs",
  "modal",
  "alert",
  "toast",
];

export interface TargetTech {
  id: string;
  label: string;
  note: string;
}

export const TARGET_TECHS: TargetTech[] = [
  { id: "react", label: "React + TypeScript", note: "Function components, Tailwind v4 classes, forwardRef." },
  { id: "web-components", label: "Web Components", note: "Custom elements + Shadow DOM, CSS custom properties." },
  { id: "vue", label: "Vue 3", note: "SFCs with <script setup> and TypeScript." },
  { id: "angular", label: "Angular", note: "Standalone components with signals." },
  { id: "svelte", label: "Svelte 5", note: "Runes-based components." },
];
