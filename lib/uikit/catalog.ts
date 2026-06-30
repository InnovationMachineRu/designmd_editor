/**
 * A broad catalog of UI components. Users select a subset on the UIKit step; the
 * selection plus the saved design tokens become the technical spec (ТЗ) for
 * generating a UIKit in the chosen technology. Each component documents its
 * behavior, typed input parameters, and animations so the generated spec is
 * implementation-ready.
 */

/** A typed input parameter (prop / attribute) of a component. */
export interface ComponentParam {
  /** Parameter name as exposed to consumers. */
  name: string;
  /** Type signature, e.g. "'primary' | 'secondary'", "boolean", "(value: string) => void". */
  type: string;
  /** What the parameter controls. */
  description: string;
  /** Default value, when there is a sensible one. */
  default?: string;
}

export interface UikitComponent {
  id: string;
  name: string;
  description: string;
  /** How the component behaves — interactions, focus, lifecycle, edge cases. */
  behavior: string;
  /** Visual/behavioral states a generated component should implement. */
  states: string[];
  /** Typed input parameters (props / attributes). */
  params: ComponentParam[];
  /** Animations & transitions the component should implement. */
  animations: string[];
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

/** Concise constructor for a typed input parameter. */
const p = (
  name: string,
  type: string,
  description: string,
  def?: string
): ComponentParam => ({
  name,
  type,
  description,
  ...(def !== undefined ? { default: def } : {}),
});

export const CATALOG: UikitCategory[] = [
  {
    id: "actions",
    label: "Buttons & Actions",
    components: [
      {
        id: "button",
        name: "Button",
        description: "Primary call-to-action button.",
        behavior:
          "Triggers an action on click or Enter/Space. While `loading` it shows a spinner, sets `aria-busy`, and ignores repeated activations until the async work resolves. Optional leading/trailing icons render inline with the label; when `disabled` it is non-interactive and skipped by the tab order.",
        states: ["default", "hover", "active", "focus-visible", "disabled", "loading"],
        params: [
          p("variant", "'primary' | 'secondary' | 'plain'", "Visual emphasis.", "'primary'"),
          p("size", "'sm' | 'md' | 'lg'", "Control height and padding scale.", "'md'"),
          p("disabled", "boolean", "Disables interaction.", "false"),
          p("loading", "boolean", "Shows a spinner and blocks clicks.", "false"),
          p("iconStart", "ReactNode", "Icon before the label."),
          p("iconEnd", "ReactNode", "Icon after the label."),
          p("onClick", "(e: MouseEvent) => void", "Activation handler."),
        ],
        animations: [
          "Background/elevation transition on hover (~150ms ease)",
          "Pressed translate/scale on active (~60ms)",
          "Spinner rotation while loading",
          "Focus-ring fade-in on focus-visible",
        ],
        tokenRoles: ["primary", "on-primary", "rounded", "label-md"],
        a11y: ["role=button", "keyboard activation (Enter/Space)", "aria-busy when loading"],
      },
      {
        id: "icon-button",
        name: "Icon Button",
        description: "Compact action with an icon only.",
        behavior:
          "Behaves like Button but renders only an icon, so an accessible name is required via `label` (aria-label). Same hover/press/focus feedback. Common in toolbars and as overflow/close triggers.",
        states: ["default", "hover", "active", "focus-visible", "disabled"],
        params: [
          p("icon", "ReactNode", "Icon to display.", "—"),
          p("label", "string", "Accessible name (aria-label). Required.", "—"),
          p("size", "'sm' | 'md' | 'lg'", "Button diameter.", "'md'"),
          p("variant", "'filled' | 'plain' | 'outline'", "Visual style.", "'plain'"),
          p("disabled", "boolean", "Disables interaction.", "false"),
          p("onClick", "(e: MouseEvent) => void", "Activation handler."),
        ],
        animations: [
          "Hover background fade (~150ms)",
          "Active scale-down (~60ms)",
          "Focus-ring fade-in",
        ],
        tokenRoles: ["primary", "on-surface", "rounded-full"],
        a11y: ["aria-label required", "focus ring"],
      },
      {
        id: "button-group",
        name: "Button Group",
        description: "Segmented set of related actions.",
        behavior:
          "Groups mutually-related actions as segments. In single-select mode it behaves like a radio set: one segment is selected at a time, arrow keys move selection with a roving tabindex, and `onChange` fires with the chosen id.",
        states: ["default", "selected", "hover", "disabled"],
        params: [
          p("items", "{ id: string; label: string }[]", "Segments to render.", "—"),
          p("value", "string", "Selected segment id."),
          p("onChange", "(id: string) => void", "Selection handler."),
          p("size", "'sm' | 'md'", "Segment size.", "'md'"),
        ],
        animations: [
          "Selected-segment background/indicator slide (~180ms)",
          "Hover tint transition",
        ],
        tokenRoles: ["surface-container", "primary", "outline"],
        a11y: ["role=group", "arrow-key roving tabindex"],
      },
      {
        id: "fab",
        name: "Floating Action Button",
        description: "Prominent floating primary action.",
        behavior:
          "A persistent primary action floating above content, fixed to a corner. Can expand to reveal a text label (on hover or scroll-up) and collapse back to icon-only. Stays above scrolling content.",
        states: ["default", "hover", "active", "pressed"],
        params: [
          p("icon", "ReactNode", "Icon to display.", "—"),
          p("extended", "boolean", "Show the label alongside the icon.", "false"),
          p("label", "string", "Label shown when extended."),
          p("onClick", "(e: MouseEvent) => void", "Activation handler."),
        ],
        animations: [
          "Enter scale + fade-in",
          "Hover elevation lift",
          "Width transition when expanding/collapsing the label",
          "Press ripple/scale",
        ],
        tokenRoles: ["primary", "on-primary", "rounded-full"],
        a11y: ["aria-label", "visible focus"],
      },
      {
        id: "link",
        name: "Link",
        description: "Inline navigational text link.",
        behavior:
          "Navigates to another route or URL. External links open in a new tab with `rel=noopener` and an external affordance. Keeps a non-color affordance (underline) so it is distinguishable without relying on color alone.",
        states: ["default", "hover", "visited", "focus-visible"],
        params: [
          p("href", "string", "Destination URL/route. Required.", "—"),
          p("external", "boolean", "Open in a new tab with rel=noopener.", "false"),
          p("children", "ReactNode", "Link text/content."),
        ],
        animations: ["Color/underline transition on hover", "Focus-ring fade-in"],
        tokenRoles: ["primary", "on-surface"],
        a11y: ["underline or non-color affordance", "rel=noopener for external"],
      },
    ],
  },
  {
    id: "inputs",
    label: "Inputs & Forms",
    components: [
      {
        id: "text-field",
        name: "Text Field",
        description: "Single-line text input with label.",
        behavior:
          "Controlled single-line input with an associated label and optional helper/error text. Validates on blur; in the error state it sets `aria-invalid` and links the message via `aria-describedby`. Emits the latest value on each change.",
        states: ["default", "focus", "filled", "error", "disabled", "readonly"],
        params: [
          p("label", "string", "Field label, associated to the input."),
          p("value", "string", "Controlled value."),
          p("placeholder", "string", "Placeholder text."),
          p("error", "string", "Error message; puts the field in the error state."),
          p("type", "'text' | 'email' | 'password' | 'number' | 'tel'", "Input type.", "'text'"),
          p("disabled", "boolean", "Disables the field.", "false"),
          p("readOnly", "boolean", "Renders read-only.", "false"),
          p("onChange", "(value: string) => void", "Change handler."),
        ],
        animations: [
          "Focus border/ring transition (~150ms)",
          "Label float on focus/fill",
          "Error color transition",
        ],
        tokenRoles: ["surface-container-high", "on-surface", "outline", "error", "body-md"],
        a11y: ["label-for association", "aria-invalid on error", "describedby helper text"],
      },
      {
        id: "textarea",
        name: "Textarea",
        description: "Multi-line text input.",
        behavior:
          "Multi-line input sharing the Text Field label/error model. Auto-grows with content from `rows` up to `maxRows`, then scrolls. Supports manual vertical resize.",
        states: ["default", "focus", "error", "disabled"],
        params: [
          p("label", "string", "Field label."),
          p("value", "string", "Controlled value."),
          p("rows", "number", "Initial visible rows.", "3"),
          p("maxRows", "number", "Max rows before scrolling."),
          p("onChange", "(value: string) => void", "Change handler."),
        ],
        animations: ["Focus border transition", "Height auto-grow transition"],
        tokenRoles: ["surface-container-high", "on-surface", "outline"],
        a11y: ["label association", "resize affordance"],
      },
      {
        id: "select",
        name: "Select",
        description: "Dropdown single choice.",
        behavior:
          "Opens a listbox on click/Enter. Arrow keys move the active option, Enter selects, Esc closes, and typeahead jumps to a matching option. The trigger shows the selected label; focus returns to the trigger on close.",
        states: ["default", "open", "focus", "disabled", "error"],
        params: [
          p("label", "string", "Field label."),
          p("options", "{ value: string; label: string }[]", "Selectable options.", "—"),
          p("value", "string", "Selected value."),
          p("onChange", "(value: string) => void", "Selection handler."),
          p("disabled", "boolean", "Disables the control.", "false"),
          p("error", "string", "Error message/state."),
        ],
        animations: [
          "Menu open/close fade + scale/slide",
          "Option hover/active highlight",
          "Chevron rotate on open",
        ],
        tokenRoles: ["surface-container-high", "on-surface", "outline"],
        a11y: ["listbox semantics", "keyboard navigation"],
      },
      {
        id: "checkbox",
        name: "Checkbox",
        description: "Boolean toggle in forms.",
        behavior:
          "Toggles a boolean on click or Space; the label is part of the hit target. Supports an `indeterminate` visual for partial group selection (cleared once the user toggles it).",
        states: ["unchecked", "checked", "indeterminate", "focus", "disabled"],
        params: [
          p("checked", "boolean", "Checked state.", "false"),
          p("indeterminate", "boolean", "Partial/mixed state.", "false"),
          p("label", "string", "Associated label."),
          p("disabled", "boolean", "Disables the control.", "false"),
          p("onChange", "(checked: boolean) => void", "Change handler."),
        ],
        animations: ["Check-mark draw-in", "Box fill transition", "Focus-ring fade-in"],
        tokenRoles: ["primary", "on-primary", "outline"],
        a11y: ["native input or role=checkbox", "label association"],
      },
      {
        id: "radio",
        name: "Radio Group",
        description: "Mutually exclusive choice set.",
        behavior:
          "Single choice within a named group. Arrow keys move selection with a roving tabindex, and selecting one option clears the others. Emits the selected value.",
        states: ["unselected", "selected", "focus", "disabled"],
        params: [
          p("name", "string", "Group name. Required.", "—"),
          p("options", "{ value: string; label: string }[]", "Choices.", "—"),
          p("value", "string", "Selected value."),
          p("onChange", "(value: string) => void", "Selection handler."),
          p("disabled", "boolean", "Disables the group.", "false"),
        ],
        animations: ["Dot scale-in on select", "Fill transition", "Focus-ring fade-in"],
        tokenRoles: ["primary", "outline"],
        a11y: ["role=radiogroup", "arrow-key selection"],
      },
      {
        id: "switch",
        name: "Switch",
        description: "On/off toggle control.",
        behavior:
          "Immediately toggles on/off on click or Space (no confirmation step). State is reflected by the thumb position and track color; emits the new boolean.",
        states: ["off", "on", "focus", "disabled"],
        params: [
          p("checked", "boolean", "On/off state.", "false"),
          p("label", "string", "Associated label."),
          p("disabled", "boolean", "Disables the control.", "false"),
          p("onChange", "(checked: boolean) => void", "Change handler."),
        ],
        animations: ["Thumb slide (~150ms)", "Track color crossfade"],
        tokenRoles: ["primary", "surface-container-highest", "on-primary"],
        a11y: ["role=switch", "aria-checked"],
      },
      {
        id: "slider",
        name: "Slider",
        description: "Select a numeric value along a range.",
        behavior:
          "Set a value within `min`/`max` by `step` via drag or Arrow/Home/End keys. The track fills to the current value and a tooltip shows the value while dragging; emits on change.",
        states: ["default", "focus", "active", "disabled"],
        params: [
          p("min", "number", "Lower bound.", "0"),
          p("max", "number", "Upper bound.", "100"),
          p("step", "number", "Increment.", "1"),
          p("value", "number", "Current value."),
          p("onChange", "(value: number) => void", "Change handler."),
          p("disabled", "boolean", "Disables the control.", "false"),
        ],
        animations: [
          "Thumb grow on focus/drag",
          "Fill width transition",
          "Value tooltip fade",
        ],
        tokenRoles: ["primary", "surface-container-highest"],
        a11y: ["role=slider", "aria-valuenow/min/max", "arrow keys"],
      },
      {
        id: "search",
        name: "Search Field",
        description: "Input specialized for search.",
        behavior:
          "Debounces typing before firing `onSearch`. Shows a clear button when non-empty (fires `onClear`) and a loading indicator while results are pending. Submitting on Enter triggers an immediate search.",
        states: ["default", "focus", "filled", "loading"],
        params: [
          p("value", "string", "Controlled query value."),
          p("placeholder", "string", "Placeholder text.", "'Search…'"),
          p("onSearch", "(query: string) => void", "Debounced search handler."),
          p("onClear", "() => void", "Clear handler."),
          p("loading", "boolean", "Shows a pending indicator.", "false"),
        ],
        animations: [
          "Focus expand/border transition",
          "Clear button fade in/out",
          "Spinner while loading",
        ],
        tokenRoles: ["surface-container-high", "on-surface-variant"],
        a11y: ["role=searchbox", "clear button labeled"],
      },
    ],
  },
  {
    id: "navigation",
    label: "Navigation",
    components: [
      {
        id: "navbar",
        name: "Top App Bar",
        description: "Application top navigation bar.",
        behavior:
          "Sticky top bar holding brand, primary navigation, and actions. Elevates/condenses on scroll and collapses navigation into a menu on small screens. Provides a skip-link target.",
        states: ["default", "scrolled", "elevated"],
        params: [
          p("title", "string", "App/brand title."),
          p("leading", "ReactNode", "Leading slot (menu/back/logo)."),
          p("actions", "ReactNode", "Trailing actions."),
        ],
        animations: ["Elevation/shadow on scroll", "Mobile menu slide-in"],
        tokenRoles: ["surface", "on-surface", "surface-container"],
        a11y: ["landmark role=banner/navigation", "skip link target"],
      },
      {
        id: "sidebar",
        name: "Side Navigation",
        description: "Vertical navigation drawer/rail.",
        behavior:
          "Vertical navigation that highlights the current route (aria-current). Can collapse to icons-only; on mobile it becomes an overlay drawer with a scrim. Emits the chosen item id.",
        states: ["default", "collapsed", "active-item", "hover"],
        params: [
          p("items", "{ id: string; label: string; icon?: ReactNode }[]", "Nav items.", "—"),
          p("activeId", "string", "Currently active item id."),
          p("collapsed", "boolean", "Icons-only rail.", "false"),
          p("onSelect", "(id: string) => void", "Item-select handler."),
        ],
        animations: [
          "Width collapse/expand transition",
          "Active-indicator slide",
          "Hover tint",
        ],
        tokenRoles: ["surface-container", "primary", "on-surface"],
        a11y: ["nav landmark", "current page aria-current"],
      },
      {
        id: "tabs",
        name: "Tabs",
        description: "Switch between peer views.",
        behavior:
          "Switches between peer panels, showing only the active one. Arrow keys move between tabs with a roving tabindex, Home/End jump to ends, and an indicator tracks the active tab.",
        states: ["default", "active", "hover", "focus", "disabled"],
        params: [
          p("items", "{ id: string; label: string }[]", "Tab definitions.", "—"),
          p("value", "string", "Active tab id."),
          p("onChange", "(id: string) => void", "Tab-change handler."),
        ],
        animations: ["Active indicator slide", "Panel crossfade", "Hover tint"],
        tokenRoles: ["primary", "on-surface", "outline-variant"],
        a11y: ["role=tablist/tab/tabpanel", "arrow-key navigation"],
      },
      {
        id: "breadcrumbs",
        name: "Breadcrumbs",
        description: "Hierarchical location trail.",
        behavior:
          "Shows the path to the current page; all but the last item are links and the last is marked aria-current=page. Collapses middle items behind an overflow menu when space is constrained.",
        states: ["default", "hover", "current"],
        params: [p("items", "{ label: string; href?: string }[]", "Trail items, root → current.", "—")],
        animations: ["Overflow menu open", "Hover color transition"],
        tokenRoles: ["on-surface-variant", "primary"],
        a11y: ["nav with aria-label", "aria-current=page on last"],
      },
      {
        id: "pagination",
        name: "Pagination",
        description: "Navigate paged collections.",
        behavior:
          "Prev/next controls plus numbered pages with ellipses for large ranges. Prev/next disable at the bounds, and the current page is marked aria-current. Emits the requested page.",
        states: ["default", "active", "hover", "disabled"],
        params: [
          p("page", "number", "Current page (1-based)."),
          p("count", "number", "Total page count."),
          p("onChange", "(page: number) => void", "Page-change handler."),
        ],
        animations: ["Active page background transition", "Hover tint"],
        tokenRoles: ["primary", "surface-container", "on-surface"],
        a11y: ["nav landmark", "aria-current for active page"],
      },
      {
        id: "menu",
        name: "Menu",
        description: "Contextual list of actions.",
        behavior:
          "Opens from a trigger; focus moves into the menu, arrow keys navigate items, Enter activates, and Esc/outside-click closes and returns focus to the trigger. Supports disabled items and separators.",
        states: ["closed", "open", "item-hover", "item-focus", "disabled-item"],
        params: [
          p("items", "{ id: string; label: string; disabled?: boolean }[]", "Menu items.", "—"),
          p("trigger", "ReactNode", "Element that opens the menu."),
          p("onSelect", "(id: string) => void", "Item-select handler."),
        ],
        animations: ["Open fade + scale from trigger", "Item hover highlight", "Close fade"],
        tokenRoles: ["surface-container-high", "on-surface"],
        a11y: ["role=menu/menuitem", "focus trap + Esc to close"],
      },
    ],
  },
  {
    id: "data",
    label: "Data Display",
    components: [
      {
        id: "card",
        name: "Card",
        description: "Container grouping related content.",
        behavior:
          "Groups related content with optional header/footer. When `interactive`, the whole card is focusable and clickable and lifts on hover; otherwise it is a static surface with a clear heading structure.",
        states: ["default", "hover", "selected"],
        params: [
          p("elevated", "boolean", "Use the elevated surface + shadow.", "false"),
          p("interactive", "boolean", "Make the whole card clickable/focusable.", "false"),
          p("header", "ReactNode", "Header slot."),
          p("footer", "ReactNode", "Footer slot."),
          p("children", "ReactNode", "Card content."),
        ],
        animations: ["Hover elevation lift (interactive)", "Press scale (interactive)"],
        tokenRoles: ["surface-container", "on-surface", "rounded-lg"],
        a11y: ["heading structure", "interactive cards focusable"],
      },
      {
        id: "table",
        name: "Data Table",
        description: "Tabular data with rows and columns.",
        behavior:
          "Displays rows and columns with optional column sorting (toggles asc/desc and sets aria-sort), row hover, and row selection. The header stays sticky while the body scrolls.",
        states: ["default", "row-hover", "selected-row", "sorted-column"],
        params: [
          p("columns", "{ key: string; label: string; sortable?: boolean }[]", "Column definitions.", "—"),
          p("rows", "Record<string, unknown>[]", "Row data.", "—"),
          p("sortable", "boolean", "Enable column sorting.", "false"),
          p("selectable", "boolean", "Enable row selection.", "false"),
          p("onSort", "(key: string, dir: 'asc' | 'desc') => void", "Sort handler."),
        ],
        animations: ["Sort-arrow rotate", "Row hover background", "Selection highlight"],
        tokenRoles: ["surface", "on-surface", "outline-variant"],
        a11y: ["table semantics", "th scope", "sortable aria-sort"],
      },
      {
        id: "list",
        name: "List",
        description: "Vertical list of items.",
        behavior:
          "Renders a vertical list with optional dividers and leading/trailing content. When interactive, items are keyboard-navigable and expose a selected state; emits the chosen item id.",
        states: ["default", "item-hover", "item-selected", "item-focus"],
        params: [
          p("items", "{ id: string; label: string }[]", "List items.", "—"),
          p("onSelect", "(id: string) => void", "Item-select handler."),
          p("dividers", "boolean", "Show dividers between items.", "true"),
        ],
        animations: ["Item hover/selected background", "Focus-ring fade-in"],
        tokenRoles: ["surface", "on-surface", "surface-container-high"],
        a11y: ["role=list/listitem", "keyboard navigation if interactive"],
      },
      {
        id: "avatar",
        name: "Avatar",
        description: "User or entity image/initials.",
        behavior:
          "Shows a user image; falls back to initials (from `name`) and then a generic placeholder when the image is missing or fails to load. Supports sizes and circle/square shapes; groups overlap with a +N overflow.",
        states: ["image", "initials", "placeholder"],
        params: [
          p("src", "string", "Image URL."),
          p("name", "string", "Used for initials and alt text. Required.", "—"),
          p("size", "'sm' | 'md' | 'lg'", "Avatar size.", "'md'"),
          p("shape", "'circle' | 'square'", "Avatar shape.", "'circle'"),
        ],
        animations: ["Image fade-in on load"],
        tokenRoles: ["secondary-container", "on-secondary-container"],
        a11y: ["alt text or aria-label"],
      },
      {
        id: "badge",
        name: "Badge",
        description: "Small status/count indicator.",
        behavior:
          "A small status or count indicator. Renders as a dot or a number that caps at `max` (e.g. 99+). Typically anchored to another element's corner and announces its meaning via aria-label.",
        states: ["default", "count", "dot"],
        params: [
          p("content", "string | number", "Label or count."),
          p("color", "'primary' | 'secondary' | 'error'", "Semantic color.", "'primary'"),
          p("max", "number", "Cap before showing N+.", "99"),
          p("dot", "boolean", "Render as a dot (no content).", "false"),
        ],
        animations: ["Count-change pop/scale", "Enter fade"],
        tokenRoles: ["primary", "on-primary", "error"],
        a11y: ["aria-label conveying meaning"],
      },
      {
        id: "chip",
        name: "Chip / Tag",
        description: "Compact element for input, filter, or choice.",
        behavior:
          "Compact element for input/filter/choice. Can toggle a `selected` state and/or be removable (an × fires `onRemove`). Its role adapts to use (button for actions, option for choices).",
        states: ["default", "selected", "hover", "removable", "disabled"],
        params: [
          p("label", "string", "Chip label. Required.", "—"),
          p("selected", "boolean", "Selected/active state.", "false"),
          p("icon", "ReactNode", "Leading icon."),
          p("onRemove", "() => void", "Remove handler; renders an × when set."),
          p("disabled", "boolean", "Disables the chip.", "false"),
        ],
        animations: ["Selected background transition", "Remove fade-out", "Press scale"],
        tokenRoles: ["surface-container-high", "primary", "outline"],
        a11y: ["role per use (button/option)", "remove action labeled"],
      },
      {
        id: "tooltip",
        name: "Tooltip",
        description: "Contextual label on hover/focus.",
        behavior:
          "Shows a short label on hover and keyboard focus after a small delay, and hides on blur/mouseleave/Esc. Positioned relative to its anchor and flips to stay within the viewport.",
        states: ["hidden", "visible"],
        params: [
          p("content", "string", "Tooltip text. Required.", "—"),
          p("placement", "'top' | 'bottom' | 'left' | 'right'", "Preferred placement.", "'top'"),
          p("delay", "number", "Show delay in ms.", "300"),
        ],
        animations: ["Fade + slight move-in on show", "Fade-out on hide"],
        tokenRoles: ["inverse-surface", "inverse-on-surface"],
        a11y: ["aria-describedby", "shows on focus, not hover-only"],
      },
      {
        id: "stat",
        name: "Stat / Metric",
        description: "Highlighted key figure.",
        behavior:
          "Highlights a key metric with a label and an optional delta that conveys a positive/negative trend through color and direction, always paired with a text alternative for the trend.",
        states: ["default", "positive", "negative"],
        params: [
          p("label", "string", "Metric label."),
          p("value", "string | number", "Primary figure."),
          p("delta", "string", "Change indicator, e.g. '+12%'."),
          p("trend", "'up' | 'down' | 'flat'", "Trend direction for color/icon."),
        ],
        animations: ["Optional value count-up on mount", "Delta color emphasis"],
        tokenRoles: ["on-surface", "on-surface-variant", "display-lg"],
        a11y: ["meaningful text alternative for trends"],
      },
    ],
  },
  {
    id: "feedback",
    label: "Feedback",
    components: [
      {
        id: "alert",
        name: "Alert / Banner",
        description: "Inline contextual message.",
        behavior:
          "Inline contextual message with a severity (info/success/warning/error) and an optional dismiss control. Urgent severities use role=alert so they are announced immediately.",
        states: ["info", "success", "warning", "error", "dismissible"],
        params: [
          p("severity", "'info' | 'success' | 'warning' | 'error'", "Message severity.", "'info'"),
          p("title", "string", "Headline."),
          p("children", "ReactNode", "Body content."),
          p("onDismiss", "() => void", "Dismiss handler; renders a close button when set."),
        ],
        animations: ["Enter slide/fade", "Dismiss collapse/fade-out"],
        tokenRoles: ["primary", "error", "surface-container"],
        a11y: ["role=alert for urgent", "dismiss labeled"],
      },
      {
        id: "toast",
        name: "Toast / Snackbar",
        description: "Transient notification.",
        behavior:
          "Transient notification that auto-dismisses after `duration` (timer pauses on hover/focus). Stacks with other toasts and may carry a single action; critical messages do not auto-dismiss.",
        states: ["enter", "visible", "exit", "with-action"],
        params: [
          p("message", "string", "Notification text. Required.", "—"),
          p("action", "{ label: string; onClick: () => void }", "Optional single action."),
          p("duration", "number", "Auto-dismiss delay in ms (0 = sticky).", "5000"),
        ],
        animations: [
          "Slide-in from edge",
          "Auto-dismiss timeout (pause on hover)",
          "Slide/fade-out",
          "Stack reflow when others dismiss",
        ],
        tokenRoles: ["inverse-surface", "inverse-on-surface", "primary"],
        a11y: ["role=status/alert", "not auto-dismiss critical messages"],
      },
      {
        id: "progress-bar",
        name: "Progress Bar",
        description: "Linear determinate/indeterminate progress.",
        behavior:
          "Shows determinate progress via `value` (0–100) or an indeterminate looping animation when the value is unknown. Exposes aria-valuenow in the determinate case.",
        states: ["determinate", "indeterminate"],
        params: [
          p("value", "number", "Progress 0–100; omit for indeterminate."),
          p("indeterminate", "boolean", "Unknown-duration loop.", "false"),
        ],
        animations: [
          "Width transition on value change",
          "Indeterminate sliding stripe loop",
        ],
        tokenRoles: ["primary", "surface-container-highest"],
        a11y: ["role=progressbar", "aria-valuenow"],
      },
      {
        id: "spinner",
        name: "Spinner",
        description: "Indeterminate loading indicator.",
        behavior:
          "Indeterminate loading indicator for short waits. Announces a busy state via aria-label / aria-busy on its container.",
        states: ["spinning"],
        params: [
          p("size", "'sm' | 'md' | 'lg'", "Spinner size.", "'md'"),
          p("label", "string", "Accessible busy label.", "'Loading…'"),
        ],
        animations: ["Continuous rotation (~0.8s linear, infinite)"],
        tokenRoles: ["primary", "outline-variant"],
        a11y: ["aria-label / aria-busy on container"],
      },
      {
        id: "skeleton",
        name: "Skeleton",
        description: "Loading placeholder block.",
        behavior:
          "Placeholder blocks shown while content loads, matching the eventual layout. Purely decorative (aria-hidden); the real busy state is announced elsewhere.",
        states: ["pulsing"],
        params: [
          p("width", "string | number", "Block width."),
          p("height", "string | number", "Block height."),
          p("shape", "'text' | 'rect' | 'circle'", "Placeholder shape.", "'rect'"),
        ],
        animations: ["Shimmer/pulse loop"],
        tokenRoles: ["surface-container-high", "surface-container-highest"],
        a11y: ["aria-hidden, real busy state announced separately"],
      },
      {
        id: "empty-state",
        name: "Empty State",
        description: "Placeholder when no data exists.",
        behavior:
          "Shown when a collection has no data. Presents an illustration, explanatory copy, and a primary call-to-action to create the first item.",
        states: ["default"],
        params: [
          p("title", "string", "Heading. Required.", "—"),
          p("description", "string", "Explanatory copy."),
          p("action", "{ label: string; onClick: () => void }", "Primary CTA."),
          p("illustration", "ReactNode", "Optional illustration/icon."),
        ],
        animations: ["Subtle fade/scale-in on mount"],
        tokenRoles: ["on-surface-variant", "primary"],
        a11y: ["heading + actionable next step"],
      },
    ],
  },
  {
    id: "overlays",
    label: "Overlays & Containers",
    components: [
      {
        id: "modal",
        name: "Modal Dialog",
        description: "Focused overlay requiring interaction.",
        behavior:
          "Blocking dialog over a scrim. Traps focus within the dialog, closes on Esc and (optionally) scrim click, returns focus to the trigger on close, and locks body scroll while open.",
        states: ["closed", "open"],
        params: [
          p("open", "boolean", "Visibility. Required.", "—"),
          p("title", "string", "Dialog title (labels the dialog)."),
          p("onClose", "() => void", "Close handler."),
          p("size", "'sm' | 'md' | 'lg'", "Dialog width.", "'md'"),
        ],
        animations: [
          "Scrim fade-in",
          "Panel scale/slide-in",
          "Reverse animations on close",
        ],
        tokenRoles: ["surface-container-high", "on-surface", "scrim"],
        a11y: ["role=dialog aria-modal", "focus trap", "Esc to close", "return focus"],
      },
      {
        id: "drawer",
        name: "Drawer / Sheet",
        description: "Edge-anchored sliding panel.",
        behavior:
          "Edge-anchored sliding panel (left/right/top/bottom) over a scrim, with the same focus-trap / Esc / scrim semantics as a modal. Used for navigation and filter panels.",
        states: ["closed", "open"],
        params: [
          p("open", "boolean", "Visibility. Required.", "—"),
          p("side", "'left' | 'right' | 'top' | 'bottom'", "Anchored edge.", "'right'"),
          p("onClose", "() => void", "Close handler."),
        ],
        animations: ["Panel slide-in from its edge", "Scrim fade", "Reverse on close"],
        tokenRoles: ["surface-container", "on-surface"],
        a11y: ["dialog semantics", "focus trap", "Esc to close"],
      },
      {
        id: "popover",
        name: "Popover",
        description: "Anchored floating content.",
        behavior:
          "Non-modal floating panel anchored to a trigger. Opens on click, positions and flips to stay in view, repositions on scroll/resize, and closes on outside-click and Esc while managing focus into the content.",
        states: ["closed", "open"],
        params: [
          p("trigger", "ReactNode", "Element that opens the popover."),
          p("placement", "'top' | 'bottom' | 'left' | 'right'", "Preferred placement.", "'bottom'"),
          p("content", "ReactNode", "Floating content."),
        ],
        animations: [
          "Fade + scale-in from anchor",
          "Reposition on scroll/resize",
          "Fade-out on close",
        ],
        tokenRoles: ["surface-container-high", "outline-variant"],
        a11y: ["focus management", "Esc + outside click close"],
      },
      {
        id: "accordion",
        name: "Accordion",
        description: "Expandable disclosure sections.",
        behavior:
          "Expandable disclosure sections whose header buttons toggle aria-expanded and reveal/hide their region. With `multiple`, several panels stay open; otherwise opening one closes the rest.",
        states: ["collapsed", "expanded", "focus", "disabled"],
        params: [
          p("items", "{ id: string; title: string; content: ReactNode }[]", "Sections.", "—"),
          p("multiple", "boolean", "Allow multiple open panels.", "false"),
          p("value", "string | string[]", "Open panel id(s)."),
          p("onChange", "(value: string | string[]) => void", "Toggle handler."),
        ],
        animations: ["Height expand/collapse transition", "Chevron rotate"],
        tokenRoles: ["surface", "on-surface", "outline-variant"],
        a11y: ["button headers", "aria-expanded/controls"],
      },
      {
        id: "tooltip-rich",
        name: "Rich Tooltip",
        description: "Tooltip with actions/links.",
        behavior:
          "Like a tooltip but with interactive content (links/actions). It stays open while hovered or focused so the user can interact, and dismisses on Esc or outside interaction.",
        states: ["hidden", "visible"],
        params: [
          p("content", "ReactNode", "Rich content. Required.", "—"),
          p("actions", "ReactNode", "Action buttons/links."),
          p("placement", "'top' | 'bottom' | 'left' | 'right'", "Preferred placement.", "'top'"),
        ],
        animations: ["Fade + move-in on show", "Fade-out on hide"],
        tokenRoles: ["inverse-surface", "primary"],
        a11y: ["focusable content", "dismiss on Esc"],
      },
    ],
  },
  {
    id: "layout",
    label: "Layout",
    components: [
      {
        id: "container",
        name: "Container",
        description: "Max-width centered content wrapper.",
        behavior:
          "Centers content with a max-width and horizontal padding, responding to breakpoints. Purely structural — it does not alter the document landmark structure.",
        states: ["default"],
        params: [
          p("size", "'sm' | 'md' | 'lg' | 'xl'", "Max-width preset.", "'lg'"),
          p("padding", "string", "Horizontal padding override."),
        ],
        animations: ["None (responsive width only)"],
        tokenRoles: ["background", "container-padding"],
        a11y: ["landmark structure respected"],
      },
      {
        id: "grid",
        name: "Grid",
        description: "Responsive grid layout.",
        behavior:
          "Responsive grid that reflows its column count by breakpoint while preserving logical reading (DOM) order.",
        states: ["default"],
        params: [
          p("columns", "number | Record<string, number>", "Columns, optionally per breakpoint."),
          p("gap", "string", "Gap between cells."),
          p("responsive", "boolean", "Reflow columns by breakpoint.", "true"),
        ],
        animations: ["None (layout reflow)"],
        tokenRoles: ["card-gap", "section-margin"],
        a11y: ["logical reading order"],
      },
      {
        id: "divider",
        name: "Divider",
        description: "Visual separation between content.",
        behavior:
          "Separates content horizontally or vertically. Decorative dividers are aria-hidden; semantic ones use role=separator. Supports an inset variant.",
        states: ["horizontal", "vertical"],
        params: [
          p("orientation", "'horizontal' | 'vertical'", "Divider direction.", "'horizontal'"),
          p("inset", "boolean", "Inset from the container edge.", "false"),
        ],
        animations: ["None"],
        tokenRoles: ["outline-variant"],
        a11y: ["role=separator or decorative aria-hidden"],
      },
      {
        id: "toolbar",
        name: "Toolbar",
        description: "Row of grouped controls.",
        behavior:
          "A row of grouped controls with a roving tabindex so arrow keys move between controls. Groups are separated by dividers and the row can align start/center/end.",
        states: ["default"],
        params: [
          p("items", "ReactNode[]", "Controls to render."),
          p("align", "'start' | 'center' | 'end'", "Horizontal alignment.", "'start'"),
        ],
        animations: ["Control hover/active states"],
        tokenRoles: ["surface-container", "on-surface"],
        a11y: ["role=toolbar", "roving tabindex"],
      },
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

/** YAML snapshot of the selected UIKit components, stored under x-design-md.uikit. */
export function uikitYaml(
  ids: string[],
  tech?: string
): {
  tech?: string;
  components: Record<
    string,
    { name: string; states: string[]; tokenRoles: string[]; a11y: string[] }
  >;
} {
  const components: Record<
    string,
    { name: string; states: string[]; tokenRoles: string[]; a11y: string[] }
  > = {};
  for (const id of ids) {
    const c = getComponent(id);
    if (c) {
      components[id] = {
        name: c.name,
        states: c.states,
        tokenRoles: c.tokenRoles,
        a11y: c.a11y,
      };
    }
  }
  return { ...(tech ? { tech } : {}), components };
}
