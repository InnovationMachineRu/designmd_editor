/**
 * A broad catalog of UI components. Users select a subset on the UIKit step; the
 * selection plus the saved design tokens become the technical spec (ТЗ) for
 * generating a UIKit in the chosen technology. Each component documents its
 * behavior, typed input parameters, and animations so the generated spec is
 * implementation-ready.
 */

import type { ComponentToken } from "../designmd/types";

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

/**
 * A first-class style variant: a named, token-bound override of a component's
 * base styling. Each variant becomes its own `<id>-<variant.id>` entry in the
 * DESIGN.md `components` YAML block (base tokens merged with the override).
 */
export interface UikitVariant {
  /** Key suffix, e.g. "secondary", "plain", "success". Matches the enum value. */
  id: string;
  /** Human label, e.g. "Secondary". */
  name: string;
  /** What the variant is for. */
  description: string;
  /** Token bindings merged OVER the component's base `tokens`. */
  tokens: ComponentToken;
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
  /**
   * Base styling token bindings → becomes the `<id>` entry in the DESIGN.md
   * `components` YAML block. When omitted, a sensible default is derived (see
   * `catalogComponentsBlock`). Values must reference defined tokens
   * (`{group.token}`) or literals (`transparent`, px values).
   */
  tokens?: ComponentToken;
  /** Named style variants → each becomes a `<id>-<variant.id>` YAML entry. */
  variants?: UikitVariant[];
  /** Extra style states (hover/active/selected…) → `<id>-<state>` YAML entries. */
  stateTokens?: Record<string, ComponentToken>;
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
        tokens: {
          backgroundColor: "{colors.primary}",
          textColor: "{colors.on-primary}",
          typography: "{typography.label-md}",
          rounded: "{rounded.md}",
          height: "44px",
          padding: "0 24px",
        },
        stateTokens: {
          hover: { backgroundColor: "{colors.primary-hover}" },
        },
        variants: [
          {
            id: "secondary",
            name: "Secondary",
            description: "Lower-emphasis filled action.",
            tokens: {
              backgroundColor: "{colors.secondary-container}",
              textColor: "{colors.on-secondary-container}",
            },
          },
          {
            id: "plain",
            name: "Plain",
            description: "Text-only / ghost action with no fill.",
            tokens: {
              backgroundColor: "transparent",
              textColor: "{colors.primary}",
              padding: "0 16px",
            },
          },
        ],
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
        tokens: {
          backgroundColor: "{colors.primary}",
          textColor: "{colors.on-primary}",
          rounded: "{rounded.full}",
          height: "40px",
          width: "40px",
        },
        stateTokens: {
          hover: { backgroundColor: "{colors.primary-hover}" },
        },
        variants: [
          {
            id: "filled",
            name: "Filled",
            description: "Solid primary fill for prominent toolbar actions.",
            tokens: {
              backgroundColor: "{colors.primary}",
              textColor: "{colors.on-primary}",
            },
          },
          {
            id: "plain",
            name: "Plain",
            description: "Transparent until hovered; default toolbar style.",
            tokens: {
              backgroundColor: "transparent",
              textColor: "{colors.on-surface-variant}",
            },
          },
          {
            id: "outline",
            name: "Outline",
            description: "Transparent fill with an outlined affordance (border in code).",
            tokens: {
              backgroundColor: "transparent",
              textColor: "{colors.on-surface}",
            },
          },
        ],
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
        tokens: {
          backgroundColor: "{colors.surface-container}",
          textColor: "{colors.on-surface}",
          rounded: "{rounded.md}",
          height: "40px",
        },
        stateTokens: {
          selected: {
            backgroundColor: "{colors.secondary-container}",
            textColor: "{colors.on-secondary-container}",
          },
        },
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
        tokens: {
          backgroundColor: "{colors.primary-container}",
          textColor: "{colors.on-primary-container}",
          rounded: "{rounded.lg}",
          height: "56px",
          width: "56px",
        },
        stateTokens: {
          hover: { backgroundColor: "{colors.primary-hover}" },
        },
        variants: [
          {
            id: "regular",
            name: "Regular",
            description: "Icon-only circular/rounded FAB.",
            tokens: { width: "56px", padding: "0" },
          },
          {
            id: "extended",
            name: "Extended",
            description: "Pill FAB with a visible text label beside the icon.",
            tokens: { width: "auto", padding: "0 20px" },
          },
        ],
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
        tokens: {
          backgroundColor: "transparent",
          textColor: "{colors.primary}",
          typography: "{typography.body-md}",
        },
        variants: [
          {
            id: "muted",
            name: "Muted",
            description: "Lower-emphasis link in surrounding body text.",
            tokens: { textColor: "{colors.on-surface-variant}" },
          },
        ],
      },
      {
        id: "split-button",
        name: "Split Button",
        description: "Primary action paired with a dropdown of related actions.",
        behavior:
          "A main action button joined to a smaller toggle that opens a menu of secondary actions. The main segment fires the default action; the toggle opens a menu with arrow-key navigation and Esc to close.",
        states: ["default", "hover", "open", "disabled"],
        params: [
          p("label", "string", "Primary action label. Required.", "—"),
          p("onClick", "(e: MouseEvent) => void", "Primary action handler."),
          p("items", "{ id: string; label: string }[]", "Secondary actions.", "—"),
          p("onSelect", "(id: string) => void", "Secondary-action handler."),
          p("disabled", "boolean", "Disables both segments.", "false"),
        ],
        animations: ["Menu open fade + scale", "Hover tint", "Chevron rotate on open"],
        tokenRoles: ["primary", "on-primary", "outline"],
        a11y: ["two labeled buttons", "menu with aria-expanded"],
        tokens: {
          backgroundColor: "{colors.primary}",
          textColor: "{colors.on-primary}",
          typography: "{typography.label-md}",
          rounded: "{rounded.md}",
          height: "44px",
          padding: "0 20px",
        },
        stateTokens: {
          hover: { backgroundColor: "{colors.primary-hover}" },
        },
      },
      {
        id: "toggle-button",
        name: "Toggle Button",
        description: "Two-state button that stays pressed when active.",
        behavior:
          "Toggles a boolean pressed state on click/Space, reflected via aria-pressed. Used for formatting toggles and view switches; the active state is visually distinct from hover.",
        states: ["default", "pressed", "hover", "focus-visible", "disabled"],
        params: [
          p("pressed", "boolean", "Active/pressed state.", "false"),
          p("label", "string", "Accessible label / content."),
          p("onChange", "(pressed: boolean) => void", "Toggle handler."),
          p("disabled", "boolean", "Disables interaction.", "false"),
        ],
        animations: ["Background transition on toggle", "Press scale", "Focus-ring fade-in"],
        tokenRoles: ["surface-container", "secondary-container", "on-surface"],
        a11y: ["aria-pressed", "keyboard activation"],
        tokens: {
          backgroundColor: "{colors.surface-container}",
          textColor: "{colors.on-surface}",
          typography: "{typography.label-md}",
          rounded: "{rounded.md}",
          height: "40px",
          padding: "0 16px",
        },
        stateTokens: {
          pressed: {
            backgroundColor: "{colors.secondary-container}",
            textColor: "{colors.on-secondary-container}",
          },
        },
      },
      {
        id: "copy-button",
        name: "Copy Button",
        description: "Copies text to the clipboard with success feedback.",
        behavior:
          "Writes `value` to the clipboard on click and briefly swaps its icon/label to a confirmed state (announced via an aria-live region) before reverting after a short delay.",
        states: ["default", "hover", "copied", "disabled"],
        params: [
          p("value", "string", "Text to copy. Required.", "—"),
          p("label", "string", "Button label.", "'Copy'"),
          p("onCopy", "() => void", "Fires after a successful copy."),
        ],
        animations: ["Icon swap to check on copy", "Tooltip/label fade", "Revert after timeout"],
        tokenRoles: ["surface-container", "on-surface", "primary"],
        a11y: ["aria-live confirmation", "labeled button"],
        tokens: {
          backgroundColor: "{colors.surface-container}",
          textColor: "{colors.on-surface}",
          typography: "{typography.label-sm}",
          rounded: "{rounded.md}",
          height: "36px",
          padding: "0 12px",
        },
        stateTokens: {
          copied: {
            backgroundColor: "{colors.primary-container}",
            textColor: "{colors.on-primary-container}",
          },
        },
      },
      {
        id: "segmented-control",
        name: "Segmented Control",
        description: "Compact single-select among a few options.",
        behavior:
          "A small set of mutually exclusive options rendered as joined segments with a sliding indicator on the active one. Arrow keys move selection with a roving tabindex; emits the chosen value.",
        states: ["default", "selected", "hover", "focus", "disabled"],
        params: [
          p("items", "{ id: string; label: string }[]", "Segments.", "—"),
          p("value", "string", "Selected segment id."),
          p("onChange", "(id: string) => void", "Selection handler."),
        ],
        animations: ["Active indicator slide (~180ms)", "Hover tint"],
        tokenRoles: ["surface-container-high", "surface", "on-surface"],
        a11y: ["role=radiogroup", "arrow-key roving tabindex"],
        tokens: {
          backgroundColor: "{colors.surface-container-high}",
          textColor: "{colors.on-surface-variant}",
          rounded: "{rounded.full}",
          padding: "4px",
          height: "40px",
        },
        stateTokens: {
          selected: {
            backgroundColor: "{colors.surface}",
            textColor: "{colors.on-surface}",
          },
        },
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
        tokens: {
          backgroundColor: "{colors.surface-container-high}",
          textColor: "{colors.on-surface}",
          typography: "{typography.body-md}",
          rounded: "{rounded.md}",
          padding: "12px 16px",
          height: "48px",
        },
        stateTokens: {
          error: { textColor: "{colors.error}" },
        },
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
        tokens: {
          backgroundColor: "{colors.surface-container-high}",
          textColor: "{colors.on-surface}",
          typography: "{typography.body-md}",
          rounded: "{rounded.md}",
          padding: "12px 16px",
        },
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
        tokens: {
          backgroundColor: "{colors.surface-container-high}",
          textColor: "{colors.on-surface}",
          typography: "{typography.body-md}",
          rounded: "{rounded.md}",
          padding: "12px 16px",
          height: "48px",
        },
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
        tokens: {
          backgroundColor: "{colors.primary}",
          textColor: "{colors.on-primary}",
          rounded: "{rounded.sm}",
          height: "20px",
          width: "20px",
        },
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
        tokens: {
          backgroundColor: "{colors.primary}",
          textColor: "{colors.on-primary}",
          rounded: "{rounded.full}",
          height: "20px",
          width: "20px",
        },
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
        tokens: {
          backgroundColor: "{colors.surface-container-highest}",
          rounded: "{rounded.full}",
          height: "24px",
          width: "44px",
        },
        stateTokens: {
          on: { backgroundColor: "{colors.primary}" },
        },
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
        tokens: {
          backgroundColor: "{colors.surface-container-highest}",
          rounded: "{rounded.full}",
          height: "4px",
        },
        stateTokens: {
          fill: { backgroundColor: "{colors.primary}" },
        },
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
        tokens: {
          backgroundColor: "{colors.surface-container-high}",
          textColor: "{colors.on-surface}",
          typography: "{typography.body-md}",
          rounded: "{rounded.full}",
          padding: "10px 16px",
          height: "44px",
        },
      },
      {
        id: "number-field",
        name: "Number Field",
        description: "Numeric input with stepper controls.",
        behavior:
          "Numeric input constrained to `min`/`max` by `step`, with increment/decrement buttons and Arrow-key support. Rejects non-numeric entry and clamps on blur; emits the parsed number.",
        states: ["default", "focus", "error", "disabled"],
        params: [
          p("value", "number", "Controlled value."),
          p("min", "number", "Lower bound."),
          p("max", "number", "Upper bound."),
          p("step", "number", "Increment.", "1"),
          p("onChange", "(value: number) => void", "Change handler."),
        ],
        animations: ["Focus border transition", "Stepper press feedback"],
        tokenRoles: ["surface-container-high", "on-surface", "outline"],
        a11y: ["role=spinbutton", "aria-valuenow/min/max"],
        tokens: {
          backgroundColor: "{colors.surface-container-high}",
          textColor: "{colors.on-surface}",
          typography: "{typography.body-md}",
          rounded: "{rounded.md}",
          padding: "12px 16px",
          height: "48px",
        },
      },
      {
        id: "password-field",
        name: "Password Field",
        description: "Masked input with show/hide and strength meter.",
        behavior:
          "Masks input by default with a reveal toggle; optionally shows a strength meter that updates as the user types. Shares the Text Field label/error model and never logs the value.",
        states: ["default", "focus", "revealed", "error", "disabled"],
        params: [
          p("value", "string", "Controlled value."),
          p("label", "string", "Field label."),
          p("showStrength", "boolean", "Show a strength meter.", "false"),
          p("onChange", "(value: string) => void", "Change handler."),
        ],
        animations: ["Reveal icon swap", "Strength meter fill transition", "Focus border"],
        tokenRoles: ["surface-container-high", "on-surface", "outline", "error"],
        a11y: ["label association", "reveal toggle labeled", "aria-invalid on error"],
        tokens: {
          backgroundColor: "{colors.surface-container-high}",
          textColor: "{colors.on-surface}",
          typography: "{typography.body-md}",
          rounded: "{rounded.md}",
          padding: "12px 16px",
          height: "48px",
        },
      },
      {
        id: "date-picker",
        name: "Date Picker",
        description: "Select a date from a calendar popover.",
        behavior:
          "A text trigger opens a calendar popover. Arrow keys move by day, PageUp/Down by month, and Enter selects; respects `min`/`max` and disabled dates. Closes on selection or Esc and returns focus to the trigger.",
        states: ["default", "open", "focus", "disabled", "error"],
        params: [
          p("value", "string", "Selected ISO date."),
          p("min", "string", "Earliest selectable date."),
          p("max", "string", "Latest selectable date."),
          p("onChange", "(value: string) => void", "Selection handler."),
        ],
        animations: ["Popover open fade + scale", "Month slide transition", "Day hover/active"],
        tokenRoles: ["surface-container-high", "on-surface", "primary"],
        a11y: ["grid role for calendar", "aria-selected days", "keyboard navigation"],
        tokens: {
          backgroundColor: "{colors.surface-container-high}",
          textColor: "{colors.on-surface}",
          typography: "{typography.body-md}",
          rounded: "{rounded.md}",
          padding: "12px 16px",
          height: "48px",
        },
      },
      {
        id: "time-picker",
        name: "Time Picker",
        description: "Select a time of day.",
        behavior:
          "Select hours/minutes (and optional meridiem) via spinners or a dropdown list, constrained to a `step`. Keyboard arrows adjust the focused segment; emits a normalized time string.",
        states: ["default", "open", "focus", "disabled"],
        params: [
          p("value", "string", "Selected time (HH:mm)."),
          p("step", "number", "Minute step.", "15"),
          p("onChange", "(value: string) => void", "Selection handler."),
        ],
        animations: ["Dropdown open fade", "Option hover highlight"],
        tokenRoles: ["surface-container-high", "on-surface"],
        a11y: ["labeled segments", "keyboard adjustable"],
        tokens: {
          backgroundColor: "{colors.surface-container-high}",
          textColor: "{colors.on-surface}",
          typography: "{typography.body-md}",
          rounded: "{rounded.md}",
          padding: "12px 16px",
          height: "48px",
        },
      },
      {
        id: "file-upload",
        name: "File Upload",
        description: "Drag-and-drop dropzone with file list.",
        behavior:
          "Accepts files via drag-and-drop or a browse button, validating type/size and showing per-file progress and remove controls. Highlights on drag-over and announces accepted/rejected files.",
        states: ["idle", "drag-over", "uploading", "error", "disabled"],
        params: [
          p("accept", "string", "Accepted MIME types/extensions."),
          p("multiple", "boolean", "Allow multiple files.", "false"),
          p("maxSize", "number", "Max bytes per file."),
          p("onFiles", "(files: File[]) => void", "Files-selected handler."),
        ],
        animations: ["Drag-over border/background highlight", "Per-file progress fill", "Remove fade-out"],
        tokenRoles: ["surface-container", "on-surface-variant", "primary", "outline-variant"],
        a11y: ["labeled input", "keyboard-triggerable browse", "status messages"],
        tokens: {
          backgroundColor: "{colors.surface-container}",
          textColor: "{colors.on-surface-variant}",
          rounded: "{rounded.lg}",
          padding: "24px",
        },
        stateTokens: {
          "drag-over": {
            backgroundColor: "{colors.primary-container}",
            textColor: "{colors.on-primary-container}",
          },
        },
      },
      {
        id: "combobox",
        name: "Combobox",
        description: "Text input with an autocomplete listbox.",
        behavior:
          "Filters a listbox as the user types, with arrow-key navigation, Enter to select, and Esc to close. Supports free entry or strict selection; announces result counts via aria-live.",
        states: ["default", "open", "focus", "loading", "disabled"],
        params: [
          p("options", "{ value: string; label: string }[]", "Selectable options.", "—"),
          p("value", "string", "Selected value."),
          p("onInput", "(query: string) => void", "Query handler."),
          p("onChange", "(value: string) => void", "Selection handler."),
        ],
        animations: ["Listbox open fade", "Option hover/active highlight"],
        tokenRoles: ["surface-container-high", "on-surface", "primary"],
        a11y: ["role=combobox", "aria-expanded", "aria-activedescendant"],
        tokens: {
          backgroundColor: "{colors.surface-container-high}",
          textColor: "{colors.on-surface}",
          typography: "{typography.body-md}",
          rounded: "{rounded.md}",
          padding: "12px 16px",
          height: "48px",
        },
      },
      {
        id: "tag-input",
        name: "Tag Input",
        description: "Enter multiple values as removable chips.",
        behavior:
          "Commits the typed value into a chip on Enter/comma, with Backspace removing the last chip. Optionally validates or deduplicates entries; emits the current array of values.",
        states: ["default", "focus", "error", "disabled"],
        params: [
          p("value", "string[]", "Current tags."),
          p("placeholder", "string", "Placeholder when empty."),
          p("onChange", "(tags: string[]) => void", "Change handler."),
        ],
        animations: ["Chip add pop-in", "Chip remove fade-out", "Focus border"],
        tokenRoles: ["surface-container-high", "on-surface", "secondary-container"],
        a11y: ["labeled field", "each tag removable + labeled"],
        tokens: {
          backgroundColor: "{colors.surface-container-high}",
          textColor: "{colors.on-surface}",
          typography: "{typography.body-md}",
          rounded: "{rounded.md}",
          padding: "8px 12px",
        },
      },
      {
        id: "otp-input",
        name: "One-Time Code",
        description: "Segmented input for verification codes.",
        behavior:
          "A row of single-character cells that auto-advance on entry and move back on Backspace. Pasting a full code distributes across cells; emits the assembled value and fires on completion.",
        states: ["default", "focus", "filled", "error", "disabled"],
        params: [
          p("length", "number", "Number of cells.", "6"),
          p("value", "string", "Current code."),
          p("onChange", "(value: string) => void", "Change handler."),
          p("onComplete", "(value: string) => void", "Fires when all cells filled."),
        ],
        animations: ["Active cell focus ring", "Filled cell pop", "Error shake"],
        tokenRoles: ["surface-container-high", "on-surface", "primary", "error"],
        a11y: ["labeled group", "one-time-code autocomplete", "aria-invalid on error"],
        tokens: {
          backgroundColor: "{colors.surface-container-high}",
          textColor: "{colors.on-surface}",
          typography: "{typography.title-md}",
          rounded: "{rounded.md}",
          height: "48px",
          width: "44px",
        },
      },
      {
        id: "rating",
        name: "Star Rating",
        description: "Select or display a rating.",
        behavior:
          "Renders a row of icons representing a score; interactive mode lets the user set the value with click or Arrow keys and supports half steps. Read-only mode displays an average with a text alternative.",
        states: ["default", "hover", "selected", "readonly", "disabled"],
        params: [
          p("value", "number", "Current rating."),
          p("max", "number", "Number of icons.", "5"),
          p("readOnly", "boolean", "Display-only.", "false"),
          p("onChange", "(value: number) => void", "Change handler."),
        ],
        animations: ["Icon fill on hover/select", "Pop on set"],
        tokenRoles: ["primary", "outline-variant"],
        a11y: ["role=slider or radiogroup", "text alternative for value"],
        tokens: {
          backgroundColor: "transparent",
          textColor: "{colors.primary}",
        },
      },
      {
        id: "color-input",
        name: "Color Input",
        description: "Pick a color via swatch + picker.",
        behavior:
          "A swatch trigger opens a color picker (hue/alpha + hex entry). Reflects the chosen value in the swatch and a hex field; emits a normalized color string.",
        states: ["default", "open", "focus", "disabled"],
        params: [
          p("value", "string", "Color value (hex/rgb)."),
          p("alpha", "boolean", "Allow alpha channel.", "false"),
          p("onChange", "(value: string) => void", "Change handler."),
        ],
        animations: ["Picker popover open", "Swatch crossfade on change"],
        tokenRoles: ["surface-container-high", "on-surface", "outline"],
        a11y: ["labeled field", "hex input keyboard-accessible"],
        tokens: {
          backgroundColor: "{colors.surface-container-high}",
          textColor: "{colors.on-surface}",
          rounded: "{rounded.md}",
          padding: "8px 12px",
          height: "44px",
        },
      },
      {
        id: "form-field",
        name: "Form Field",
        description: "Wrapper pairing label, control, helper, and error.",
        behavior:
          "Composes a label, a control slot, optional helper text, and an error message into one accessible unit — wiring `for`/`id`, `aria-describedby`, and `aria-invalid` automatically and reserving space to avoid layout shift.",
        states: ["default", "error", "disabled"],
        params: [
          p("label", "string", "Field label."),
          p("helper", "string", "Helper/hint text."),
          p("error", "string", "Error message; sets the error state."),
          p("required", "boolean", "Mark the field required.", "false"),
          p("children", "ReactNode", "The control to wrap."),
        ],
        animations: ["Error message fade/slide-in"],
        tokenRoles: ["on-surface", "on-surface-variant", "error"],
        a11y: ["label-for", "aria-describedby", "aria-invalid", "required indicated"],
        tokens: {
          backgroundColor: "transparent",
          textColor: "{colors.on-surface}",
          typography: "{typography.body-sm}",
        },
        stateTokens: {
          error: { textColor: "{colors.error}" },
        },
      },
      {
        id: "fieldset",
        name: "Field Group",
        description: "Groups related fields under a legend.",
        behavior:
          "Semantically groups related controls with a legend describing the set, optionally collapsible. Used for address blocks, preference groups, and multi-part inputs.",
        states: ["default", "disabled"],
        params: [
          p("legend", "string", "Group label. Required.", "—"),
          p("description", "string", "Optional group description."),
          p("children", "ReactNode", "Grouped fields."),
        ],
        animations: ["Collapse/expand height transition (if collapsible)"],
        tokenRoles: ["on-surface", "outline-variant"],
        a11y: ["fieldset + legend semantics"],
        tokens: {
          backgroundColor: "transparent",
          textColor: "{colors.on-surface}",
          typography: "{typography.title-md}",
          padding: "8px 0",
        },
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
        tokens: {
          backgroundColor: "{colors.surface}",
          textColor: "{colors.on-surface}",
          padding: "0 24px",
          height: "64px",
        },
        stateTokens: {
          scrolled: { backgroundColor: "{colors.surface-container}" },
        },
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
        tokens: {
          backgroundColor: "{colors.surface-container}",
          textColor: "{colors.on-surface}",
          padding: "12px",
          width: "260px",
        },
        stateTokens: {
          "active-item": {
            backgroundColor: "{colors.secondary-container}",
            textColor: "{colors.on-secondary-container}",
            rounded: "{rounded.md}",
          },
        },
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
        tokens: {
          backgroundColor: "transparent",
          textColor: "{colors.on-surface-variant}",
          typography: "{typography.label-md}",
          padding: "12px 16px",
        },
        stateTokens: {
          active: { textColor: "{colors.primary}" },
        },
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
        tokens: {
          backgroundColor: "transparent",
          textColor: "{colors.on-surface-variant}",
          typography: "{typography.body-sm}",
        },
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
        tokens: {
          backgroundColor: "transparent",
          textColor: "{colors.on-surface}",
          rounded: "{rounded.md}",
          height: "36px",
          width: "36px",
        },
        stateTokens: {
          active: {
            backgroundColor: "{colors.primary}",
            textColor: "{colors.on-primary}",
          },
        },
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
        tokens: {
          backgroundColor: "{colors.surface-container-high}",
          textColor: "{colors.on-surface}",
          rounded: "{rounded.md}",
          padding: "8px",
        },
        stateTokens: {
          "item-hover": { backgroundColor: "{colors.surface-container-highest}" },
        },
      },
      {
        id: "stepper",
        name: "Stepper",
        description: "Progress through a sequence of steps.",
        behavior:
          "Shows ordered steps with completed/current/upcoming states and an optional connector. Can be read-only (progress display) or interactive (jump to a visited step); marks the current step aria-current.",
        states: ["upcoming", "current", "completed", "error", "disabled"],
        params: [
          p("steps", "{ id: string; label: string }[]", "Ordered steps.", "—"),
          p("active", "number", "Current step index."),
          p("orientation", "'horizontal' | 'vertical'", "Layout direction.", "'horizontal'"),
          p("onStepClick", "(index: number) => void", "Step-select handler."),
        ],
        animations: ["Connector fill on advance", "Current-step pulse", "Check draw-in on complete"],
        tokenRoles: ["primary", "on-primary", "outline-variant", "on-surface-variant"],
        a11y: ["ordered list semantics", "aria-current on active step"],
        tokens: {
          backgroundColor: "transparent",
          textColor: "{colors.on-surface-variant}",
          typography: "{typography.label-md}",
        },
        stateTokens: {
          current: { textColor: "{colors.primary}" },
          completed: { textColor: "{colors.on-surface}" },
        },
      },
      {
        id: "command-palette",
        name: "Command Palette",
        description: "Searchable command launcher (⌘K).",
        behavior:
          "A modal overlay opened by a shortcut that fuzzy-filters commands as the user types. Arrow keys move the active item, Enter runs it, and Esc closes; supports grouped results and recent commands.",
        states: ["closed", "open", "loading", "empty"],
        params: [
          p("commands", "{ id: string; label: string; group?: string }[]", "Available commands.", "—"),
          p("onRun", "(id: string) => void", "Command-run handler."),
          p("placeholder", "string", "Search placeholder.", "'Type a command…'"),
        ],
        animations: ["Overlay fade", "Panel scale-in", "Active-row highlight slide"],
        tokenRoles: ["surface-container-high", "on-surface", "primary"],
        a11y: ["role=dialog", "combobox + listbox", "focus trap + Esc"],
        tokens: {
          backgroundColor: "{colors.surface-container-high}",
          textColor: "{colors.on-surface}",
          rounded: "{rounded.lg}",
          padding: "8px",
        },
      },
      {
        id: "bottom-nav",
        name: "Bottom Navigation",
        description: "Mobile primary navigation bar.",
        behavior:
          "A fixed bottom bar of 3–5 destinations with icon + label; the active item is highlighted and marked aria-current. Optimized for thumb reach on small screens.",
        states: ["default", "active", "hover"],
        params: [
          p("items", "{ id: string; label: string; icon: ReactNode }[]", "Destinations.", "—"),
          p("activeId", "string", "Active destination id."),
          p("onSelect", "(id: string) => void", "Select handler."),
        ],
        animations: ["Active icon scale/indicator", "Label fade"],
        tokenRoles: ["surface-container", "primary", "on-surface-variant"],
        a11y: ["nav landmark", "aria-current on active", "adequate tap targets"],
        tokens: {
          backgroundColor: "{colors.surface-container}",
          textColor: "{colors.on-surface-variant}",
          typography: "{typography.label-sm}",
          height: "64px",
        },
        stateTokens: {
          active: { textColor: "{colors.primary}" },
        },
      },
      {
        id: "nav-rail",
        name: "Navigation Rail",
        description: "Compact vertical icon navigation.",
        behavior:
          "A slim vertical rail of icon destinations (optionally with labels) for medium+ screens, sitting between bottom-nav and a full sidebar. Highlights the active destination and marks it aria-current.",
        states: ["default", "active", "hover"],
        params: [
          p("items", "{ id: string; label: string; icon: ReactNode }[]", "Destinations.", "—"),
          p("activeId", "string", "Active destination id."),
          p("onSelect", "(id: string) => void", "Select handler."),
        ],
        animations: ["Active indicator slide", "Hover tint"],
        tokenRoles: ["surface-container", "primary", "on-surface-variant"],
        a11y: ["nav landmark", "aria-current on active"],
        tokens: {
          backgroundColor: "{colors.surface-container}",
          textColor: "{colors.on-surface-variant}",
          width: "80px",
          padding: "8px",
        },
        stateTokens: {
          active: {
            backgroundColor: "{colors.secondary-container}",
            textColor: "{colors.on-secondary-container}",
            rounded: "{rounded.md}",
          },
        },
      },
      {
        id: "tree-view",
        name: "Tree View",
        description: "Hierarchical expandable list.",
        behavior:
          "Displays nested nodes that expand/collapse; Arrow keys navigate and open/close branches with a roving tabindex, and selection emits the node id. Marks expanded state via aria-expanded.",
        states: ["collapsed", "expanded", "selected", "focus", "disabled"],
        params: [
          p("nodes", "{ id: string; label: string; children?: unknown[] }[]", "Tree data.", "—"),
          p("selectedId", "string", "Selected node id."),
          p("onSelect", "(id: string) => void", "Select handler."),
        ],
        animations: ["Branch expand/collapse height", "Chevron rotate", "Selected highlight"],
        tokenRoles: ["surface", "on-surface", "secondary-container"],
        a11y: ["role=tree/treeitem", "aria-expanded", "arrow-key navigation"],
        tokens: {
          backgroundColor: "transparent",
          textColor: "{colors.on-surface}",
          typography: "{typography.body-sm}",
          rounded: "{rounded.sm}",
          padding: "6px 8px",
        },
        stateTokens: {
          selected: {
            backgroundColor: "{colors.secondary-container}",
            textColor: "{colors.on-secondary-container}",
          },
        },
      },
      {
        id: "back-to-top",
        name: "Back to Top",
        description: "Floating scroll-to-top button.",
        behavior:
          "Appears after the user scrolls past a threshold and smoothly scrolls to the top on click (honoring reduced-motion). Hidden from the tab order while invisible.",
        states: ["hidden", "visible", "hover"],
        params: [
          p("threshold", "number", "Scroll distance before showing (px).", "400"),
          p("label", "string", "Accessible label.", "'Back to top'"),
        ],
        animations: ["Fade/slide-in on show", "Smooth scroll on click", "Hover lift"],
        tokenRoles: ["surface-container-high", "on-surface", "primary"],
        a11y: ["labeled button", "removed from tab order when hidden"],
        tokens: {
          backgroundColor: "{colors.surface-container-high}",
          textColor: "{colors.on-surface}",
          rounded: "{rounded.full}",
          height: "44px",
          width: "44px",
        },
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
        tokens: {
          backgroundColor: "{colors.surface-container}",
          textColor: "{colors.on-surface}",
          rounded: "{rounded.lg}",
          padding: "20px",
        },
        stateTokens: {
          hover: { backgroundColor: "{colors.surface-container-high}" },
        },
        variants: [
          {
            id: "flat",
            name: "Flat",
            description: "Default surface card, no elevation.",
            tokens: { backgroundColor: "{colors.surface-container}" },
          },
          {
            id: "elevated",
            name: "Elevated",
            description: "Raised surface with shadow (shadow defined in code).",
            tokens: { backgroundColor: "{colors.surface-container-high}" },
          },
          {
            id: "outlined",
            name: "Outlined",
            description: "Transparent fill with an outline border (border in code).",
            tokens: { backgroundColor: "transparent" },
          },
        ],
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
        tokens: {
          backgroundColor: "{colors.surface}",
          textColor: "{colors.on-surface}",
          typography: "{typography.body-sm}",
        },
        stateTokens: {
          "row-hover": { backgroundColor: "{colors.surface-container}" },
          "selected-row": { backgroundColor: "{colors.secondary-container}" },
        },
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
        tokens: {
          backgroundColor: "transparent",
          textColor: "{colors.on-surface}",
          rounded: "{rounded.md}",
          padding: "12px",
        },
        stateTokens: {
          hover: { backgroundColor: "{colors.surface-container-high}" },
          selected: {
            backgroundColor: "{colors.secondary-container}",
            textColor: "{colors.on-secondary-container}",
          },
        },
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
        tokens: {
          backgroundColor: "{colors.secondary-container}",
          textColor: "{colors.on-secondary-container}",
          rounded: "{rounded.full}",
          typography: "{typography.label-md}",
          height: "40px",
          width: "40px",
        },
        variants: [
          {
            id: "circle",
            name: "Circle",
            description: "Fully rounded avatar.",
            tokens: { rounded: "{rounded.full}" },
          },
          {
            id: "square",
            name: "Square",
            description: "Rounded-square avatar.",
            tokens: { rounded: "{rounded.md}" },
          },
        ],
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
        tokens: {
          backgroundColor: "{colors.primary}",
          textColor: "{colors.on-primary}",
          typography: "{typography.label-sm}",
          rounded: "{rounded.full}",
          padding: "4px 10px",
        },
        variants: [
          {
            id: "primary",
            name: "Primary",
            description: "Default emphasis badge.",
            tokens: {
              backgroundColor: "{colors.primary}",
              textColor: "{colors.on-primary}",
            },
          },
          {
            id: "secondary",
            name: "Secondary",
            description: "Lower-emphasis badge.",
            tokens: {
              backgroundColor: "{colors.secondary-container}",
              textColor: "{colors.on-secondary-container}",
            },
          },
          {
            id: "error",
            name: "Error",
            description: "Destructive / alert count.",
            tokens: {
              backgroundColor: "{colors.error}",
              textColor: "{colors.on-error}",
            },
          },
        ],
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
        tokens: {
          backgroundColor: "{colors.surface-container-high}",
          textColor: "{colors.on-surface}",
          typography: "{typography.label-sm}",
          rounded: "{rounded.full}",
          padding: "6px 12px",
        },
        stateTokens: {
          selected: {
            backgroundColor: "{colors.secondary-container}",
            textColor: "{colors.on-secondary-container}",
          },
        },
        variants: [
          {
            id: "filled",
            name: "Filled",
            description: "Solid surface chip.",
            tokens: { backgroundColor: "{colors.surface-container-high}" },
          },
          {
            id: "soft",
            name: "Soft",
            description: "Tinted chip for selected/active filters.",
            tokens: {
              backgroundColor: "{colors.secondary-container}",
              textColor: "{colors.on-secondary-container}",
            },
          },
          {
            id: "outline",
            name: "Outline",
            description: "Transparent chip with an outline (border in code).",
            tokens: {
              backgroundColor: "transparent",
              textColor: "{colors.on-surface}",
            },
          },
        ],
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
        tokens: {
          backgroundColor: "{colors.surface-container-highest}",
          textColor: "{colors.on-surface}",
          typography: "{typography.body-sm}",
          rounded: "{rounded.sm}",
          padding: "6px 10px",
        },
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
        tokens: {
          backgroundColor: "transparent",
          textColor: "{colors.on-surface}",
          typography: "{typography.display-lg}",
        },
        variants: [
          {
            id: "up",
            name: "Up",
            description: "Positive trend emphasis.",
            tokens: { textColor: "{colors.primary}" },
          },
          {
            id: "down",
            name: "Down",
            description: "Negative trend emphasis.",
            tokens: { textColor: "{colors.error}" },
          },
          {
            id: "flat",
            name: "Flat",
            description: "Neutral / unchanged trend.",
            tokens: { textColor: "{colors.on-surface-variant}" },
          },
        ],
      },
      {
        id: "label",
        name: "Label",
        description: "Small text label for status or metadata.",
        behavior:
          "A compact non-interactive text marker for status, category, or metadata. Conveys meaning through text (and an optional dot), not color alone.",
        states: ["default"],
        params: [
          p("text", "string", "Label text. Required.", "—"),
          p("tone", "'neutral' | 'info' | 'success' | 'warning' | 'error'", "Semantic tone.", "'neutral'"),
        ],
        animations: ["None"],
        tokenRoles: ["surface-container-high", "on-surface-variant"],
        a11y: ["meaning carried by text, not color alone"],
        tokens: {
          backgroundColor: "{colors.surface-container-high}",
          textColor: "{colors.on-surface-variant}",
          typography: "{typography.label-sm}",
          rounded: "{rounded.sm}",
          padding: "2px 8px",
        },
        variants: [
          {
            id: "info",
            name: "Info",
            description: "Informational tone.",
            tokens: {
              backgroundColor: "{colors.secondary-container}",
              textColor: "{colors.on-secondary-container}",
            },
          },
          {
            id: "success",
            name: "Success",
            description: "Positive tone.",
            tokens: {
              backgroundColor: "{colors.primary-container}",
              textColor: "{colors.on-primary-container}",
            },
          },
          {
            id: "warning",
            name: "Warning",
            description: "Cautionary tone.",
            tokens: {
              backgroundColor: "{colors.tertiary}",
              textColor: "{colors.on-tertiary}",
            },
          },
          {
            id: "error",
            name: "Error",
            description: "Critical tone.",
            tokens: {
              backgroundColor: "{colors.error-container}",
              textColor: "{colors.on-error-container}",
            },
          },
        ],
      },
      {
        id: "description-list",
        name: "Description List",
        description: "Key–value pairs for details.",
        behavior:
          "Presents term/description pairs (e.g. an attribute summary) in a definition list, reflowing between stacked and two-column layouts by width.",
        states: ["default"],
        params: [
          p("items", "{ term: string; description: ReactNode }[]", "Pairs to render.", "—"),
          p("columns", "1 | 2", "Layout columns.", "1"),
        ],
        animations: ["None"],
        tokenRoles: ["on-surface", "on-surface-variant", "outline-variant"],
        a11y: ["dl/dt/dd semantics"],
        tokens: {
          backgroundColor: "transparent",
          textColor: "{colors.on-surface}",
          typography: "{typography.body-sm}",
        },
      },
      {
        id: "timeline",
        name: "Timeline",
        description: "Chronological list of events.",
        behavior:
          "Renders events along a vertical (or horizontal) line with markers, timestamps, and content. Conveys order through structure and text; supports highlighting the current/active event.",
        states: ["default", "active", "completed"],
        params: [
          p("items", "{ id: string; title: string; time?: string }[]", "Events in order.", "—"),
          p("orientation", "'vertical' | 'horizontal'", "Layout direction.", "'vertical'"),
        ],
        animations: ["Marker pop-in", "Connector draw on mount"],
        tokenRoles: ["primary", "outline-variant", "on-surface"],
        a11y: ["ordered list semantics", "timestamps machine-readable"],
        tokens: {
          backgroundColor: "transparent",
          textColor: "{colors.on-surface}",
          typography: "{typography.body-sm}",
        },
      },
      {
        id: "kbd",
        name: "Keyboard Key",
        description: "Renders a keyboard shortcut.",
        behavior:
          "Displays one or more keys styled as physical keycaps for documenting shortcuts. Purely presentational; combinations are joined with a separator.",
        states: ["default"],
        params: [p("keys", "string[]", "Keys in the combination, e.g. ['⌘','K'].", "—")],
        animations: ["None"],
        tokenRoles: ["surface-container-high", "on-surface", "outline-variant"],
        a11y: ["semantic kbd element"],
        tokens: {
          backgroundColor: "{colors.surface-container-high}",
          textColor: "{colors.on-surface}",
          typography: "{typography.label-sm}",
          rounded: "{rounded.sm}",
          padding: "2px 6px",
        },
      },
      {
        id: "code-block",
        name: "Code Block",
        description: "Formatted code with copy.",
        behavior:
          "Displays monospaced, optionally syntax-highlighted code with a header (language/filename) and a copy button. Long lines wrap or scroll horizontally; preserves whitespace.",
        states: ["default", "copied"],
        params: [
          p("code", "string", "Code content. Required.", "—"),
          p("language", "string", "Language for highlighting."),
          p("showLineNumbers", "boolean", "Render line numbers.", "false"),
        ],
        animations: ["Copy confirmation swap", "Header fade"],
        tokenRoles: ["surface-container-highest", "on-surface", "outline-variant"],
        a11y: ["pre/code semantics", "copy button labeled"],
        tokens: {
          backgroundColor: "{colors.surface-container-highest}",
          textColor: "{colors.on-surface}",
          typography: "{typography.body-sm}",
          rounded: "{rounded.md}",
          padding: "16px",
        },
      },
      {
        id: "carousel",
        name: "Carousel",
        description: "Horizontally paged content.",
        behavior:
          "Pages through slides via controls, swipe, or pagination dots, with optional autoplay that pauses on hover/focus and honors reduced-motion. Announces the current slide; never traps keyboard focus.",
        states: ["default", "auto-playing", "paused"],
        params: [
          p("slides", "ReactNode[]", "Slide content.", "—"),
          p("autoplay", "boolean", "Auto-advance slides.", "false"),
          p("interval", "number", "Autoplay interval (ms).", "5000"),
        ],
        animations: ["Slide translate transition", "Dot active transition", "Autoplay progress"],
        tokenRoles: ["surface-container", "primary", "on-surface"],
        a11y: ["aria-roledescription=carousel", "slide live region", "pause control"],
        tokens: {
          backgroundColor: "{colors.surface-container}",
          textColor: "{colors.on-surface}",
          rounded: "{rounded.lg}",
        },
      },
      {
        id: "calendar",
        name: "Calendar",
        description: "Month grid for dates and events.",
        behavior:
          "Displays a month grid with weekday headers, navigable by month/year. Supports date selection and event markers; keyboard navigation mirrors the date picker (arrows by day, PageUp/Down by month).",
        states: ["default", "selected", "today", "disabled"],
        params: [
          p("month", "string", "Visible month (ISO)."),
          p("selected", "string | string[]", "Selected date(s)."),
          p("events", "{ date: string; label: string }[]", "Event markers."),
          p("onSelect", "(date: string) => void", "Date-select handler."),
        ],
        animations: ["Month slide transition", "Day hover/selected", "Today ring"],
        tokenRoles: ["surface", "on-surface", "primary", "secondary-container"],
        a11y: ["grid role", "aria-selected days", "today marked"],
        tokens: {
          backgroundColor: "{colors.surface}",
          textColor: "{colors.on-surface}",
          rounded: "{rounded.lg}",
          padding: "16px",
        },
      },
      {
        id: "data-grid",
        name: "Data Grid",
        description: "Advanced table with sorting, paging, and selection.",
        behavior:
          "A feature-rich table: sortable/resizable columns, pinned header, row selection, inline pagination or virtualization, and optional cell editing. Keyboard cell navigation and aria-sort are first-class.",
        states: ["default", "row-hover", "selected-row", "sorted-column", "editing-cell", "loading"],
        params: [
          p("columns", "{ key: string; label: string; sortable?: boolean; width?: number }[]", "Columns.", "—"),
          p("rows", "Record<string, unknown>[]", "Row data.", "—"),
          p("pageSize", "number", "Rows per page."),
          p("selectable", "boolean", "Enable row selection.", "false"),
          p("onSort", "(key: string, dir: 'asc' | 'desc') => void", "Sort handler."),
        ],
        animations: ["Sort-arrow rotate", "Row hover/selection", "Column resize feedback"],
        tokenRoles: ["surface", "on-surface", "surface-container", "outline-variant"],
        a11y: ["grid role", "aria-sort", "cell keyboard navigation"],
        tokens: {
          backgroundColor: "{colors.surface}",
          textColor: "{colors.on-surface}",
          typography: "{typography.body-sm}",
        },
        stateTokens: {
          "row-hover": { backgroundColor: "{colors.surface-container}" },
          "selected-row": { backgroundColor: "{colors.secondary-container}" },
        },
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
        tokens: {
          backgroundColor: "{colors.secondary-container}",
          textColor: "{colors.on-secondary-container}",
          typography: "{typography.body-md}",
          rounded: "{rounded.md}",
          padding: "12px 16px",
        },
        variants: [
          {
            id: "info",
            name: "Info",
            description: "Neutral informational message.",
            tokens: {
              backgroundColor: "{colors.secondary-container}",
              textColor: "{colors.on-secondary-container}",
            },
          },
          {
            id: "success",
            name: "Success",
            description: "Positive confirmation message.",
            tokens: {
              backgroundColor: "{colors.primary-container}",
              textColor: "{colors.on-primary-container}",
            },
          },
          {
            id: "warning",
            name: "Warning",
            description: "Cautionary message needing attention.",
            tokens: {
              backgroundColor: "{colors.tertiary}",
              textColor: "{colors.on-tertiary}",
            },
          },
          {
            id: "error",
            name: "Error",
            description: "Critical / destructive message.",
            tokens: {
              backgroundColor: "{colors.error-container}",
              textColor: "{colors.on-error-container}",
            },
          },
          {
            id: "neutral",
            name: "Neutral",
            description: "Low-emphasis message on a plain surface.",
            tokens: {
              backgroundColor: "{colors.surface-container-high}",
              textColor: "{colors.on-surface}",
            },
          },
        ],
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
        tokens: {
          backgroundColor: "{colors.surface-container-highest}",
          textColor: "{colors.on-surface}",
          typography: "{typography.body-sm}",
          rounded: "{rounded.md}",
          padding: "12px 16px",
        },
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
        tokens: {
          backgroundColor: "{colors.surface-container-highest}",
          rounded: "{rounded.full}",
          height: "8px",
        },
        stateTokens: {
          fill: { backgroundColor: "{colors.primary}" },
        },
        variants: [
          {
            id: "success",
            name: "Success",
            description: "Completed / positive progress fill.",
            tokens: { backgroundColor: "{colors.primary-container}" },
          },
          {
            id: "error",
            name: "Error",
            description: "Failed / blocked progress fill.",
            tokens: { backgroundColor: "{colors.error}" },
          },
        ],
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
        tokens: {
          textColor: "{colors.primary}",
          height: "24px",
          width: "24px",
        },
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
        tokens: {
          backgroundColor: "{colors.surface-container-high}",
          rounded: "{rounded.sm}",
        },
        variants: [
          {
            id: "text",
            name: "Text",
            description: "Line placeholder for text content.",
            tokens: { rounded: "{rounded.sm}", height: "12px" },
          },
          {
            id: "rect",
            name: "Rect",
            description: "Block placeholder for media/cards.",
            tokens: { rounded: "{rounded.md}" },
          },
          {
            id: "circle",
            name: "Circle",
            description: "Round placeholder for avatars.",
            tokens: { rounded: "{rounded.full}" },
          },
        ],
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
        tokens: {
          backgroundColor: "transparent",
          textColor: "{colors.on-surface-variant}",
          typography: "{typography.body-md}",
          padding: "40px",
        },
      },
      {
        id: "callout",
        name: "Callout",
        description: "Emphasized inline note within content.",
        behavior:
          "A bordered/tinted block that draws attention to a note, tip, or warning inside body content. Carries an icon and a tone but, unlike a toast/alert, is part of the document flow and is not dismissible.",
        states: ["info", "success", "warning", "error", "neutral"],
        params: [
          p("tone", "'info' | 'success' | 'warning' | 'error' | 'neutral'", "Semantic tone.", "'info'"),
          p("title", "string", "Optional heading."),
          p("icon", "ReactNode", "Leading icon."),
          p("children", "ReactNode", "Callout body."),
        ],
        animations: ["Subtle fade-in on mount"],
        tokenRoles: ["secondary-container", "primary-container", "tertiary", "error-container"],
        a11y: ["heading + body structure", "tone conveyed by text/icon, not color alone"],
        tokens: {
          backgroundColor: "{colors.secondary-container}",
          textColor: "{colors.on-secondary-container}",
          typography: "{typography.body-md}",
          rounded: "{rounded.md}",
          padding: "16px",
        },
        variants: [
          {
            id: "info",
            name: "Info",
            description: "Neutral informational note.",
            tokens: {
              backgroundColor: "{colors.secondary-container}",
              textColor: "{colors.on-secondary-container}",
            },
          },
          {
            id: "success",
            name: "Success",
            description: "Positive / success note.",
            tokens: {
              backgroundColor: "{colors.primary-container}",
              textColor: "{colors.on-primary-container}",
            },
          },
          {
            id: "warning",
            name: "Warning",
            description: "Cautionary note.",
            tokens: {
              backgroundColor: "{colors.tertiary}",
              textColor: "{colors.on-tertiary}",
            },
          },
          {
            id: "error",
            name: "Error",
            description: "Critical note.",
            tokens: {
              backgroundColor: "{colors.error-container}",
              textColor: "{colors.on-error-container}",
            },
          },
          {
            id: "neutral",
            name: "Neutral",
            description: "Low-emphasis note on a plain surface.",
            tokens: {
              backgroundColor: "{colors.surface-container-high}",
              textColor: "{colors.on-surface}",
            },
          },
        ],
      },
      {
        id: "banner",
        name: "Banner",
        description: "Full-width page-level message.",
        behavior:
          "A prominent full-width message pinned to the top of a page or section for system-wide notices (maintenance, billing, consent). Supports actions and optional dismissal that persists.",
        states: ["info", "success", "warning", "error", "dismissible"],
        params: [
          p("tone", "'info' | 'success' | 'warning' | 'error'", "Semantic tone.", "'info'"),
          p("message", "ReactNode", "Banner content. Required.", "—"),
          p("action", "{ label: string; onClick: () => void }", "Optional action."),
          p("onDismiss", "() => void", "Dismiss handler; renders a close button when set."),
        ],
        animations: ["Slide-down on mount", "Collapse on dismiss"],
        tokenRoles: ["secondary-container", "primary-container", "tertiary", "error-container"],
        a11y: ["role=region/alert by urgency", "dismiss labeled"],
        tokens: {
          backgroundColor: "{colors.secondary-container}",
          textColor: "{colors.on-secondary-container}",
          typography: "{typography.body-md}",
          padding: "12px 24px",
        },
        variants: [
          {
            id: "info",
            name: "Info",
            description: "Informational banner.",
            tokens: {
              backgroundColor: "{colors.secondary-container}",
              textColor: "{colors.on-secondary-container}",
            },
          },
          {
            id: "success",
            name: "Success",
            description: "Success banner.",
            tokens: {
              backgroundColor: "{colors.primary-container}",
              textColor: "{colors.on-primary-container}",
            },
          },
          {
            id: "warning",
            name: "Warning",
            description: "Warning banner.",
            tokens: {
              backgroundColor: "{colors.tertiary}",
              textColor: "{colors.on-tertiary}",
            },
          },
          {
            id: "error",
            name: "Error",
            description: "Critical banner.",
            tokens: {
              backgroundColor: "{colors.error-container}",
              textColor: "{colors.on-error-container}",
            },
          },
        ],
      },
      {
        id: "inline-message",
        name: "Inline Message",
        description: "Compact field/section status line.",
        behavior:
          "A small icon + text line communicating validation or status next to a field or section. Uses role=status (or alert for errors) and pairs an icon with text so meaning is not color-only.",
        states: ["info", "success", "warning", "error"],
        params: [
          p("tone", "'info' | 'success' | 'warning' | 'error'", "Semantic tone.", "'info'"),
          p("text", "string", "Message text. Required.", "—"),
        ],
        animations: ["Fade/slide-in on appear"],
        tokenRoles: ["on-surface-variant", "primary", "error", "tertiary"],
        a11y: ["role=status/alert by tone", "icon + text, not color alone"],
        tokens: {
          backgroundColor: "transparent",
          textColor: "{colors.on-surface-variant}",
          typography: "{typography.body-sm}",
        },
        variants: [
          {
            id: "success",
            name: "Success",
            description: "Positive status.",
            tokens: { textColor: "{colors.primary}" },
          },
          {
            id: "warning",
            name: "Warning",
            description: "Cautionary status.",
            tokens: { textColor: "{colors.tertiary}" },
          },
          {
            id: "error",
            name: "Error",
            description: "Error status.",
            tokens: { textColor: "{colors.error}" },
          },
        ],
      },
      {
        id: "progress-circle",
        name: "Progress Circle",
        description: "Circular determinate/indeterminate progress.",
        behavior:
          "A ring that fills to `value` (0–100) for determinate progress or spins for indeterminate. Optionally shows the percentage in the center; exposes aria-valuenow when determinate.",
        states: ["determinate", "indeterminate"],
        params: [
          p("value", "number", "Progress 0–100; omit for indeterminate."),
          p("size", "'sm' | 'md' | 'lg'", "Ring size.", "'md'"),
          p("showValue", "boolean", "Show the percentage label.", "false"),
        ],
        animations: ["Arc length transition", "Indeterminate rotation"],
        tokenRoles: ["primary", "surface-container-highest"],
        a11y: ["role=progressbar", "aria-valuenow when determinate"],
        tokens: {
          textColor: "{colors.primary}",
          backgroundColor: "{colors.surface-container-highest}",
          height: "48px",
          width: "48px",
        },
      },
      {
        id: "status-dot",
        name: "Status Indicator",
        description: "Small dot conveying a status.",
        behavior:
          "A small colored dot (optionally with a pulse for live/active) paired with text or an aria-label to convey presence or state. Meaning is never carried by color alone.",
        states: ["online", "offline", "busy", "away"],
        params: [
          p("status", "'online' | 'offline' | 'busy' | 'away'", "Status to convey.", "'offline'"),
          p("label", "string", "Accessible status text. Required.", "—"),
          p("pulse", "boolean", "Animate a live pulse.", "false"),
        ],
        animations: ["Optional pulse ring loop", "Color crossfade on change"],
        tokenRoles: ["primary", "error", "tertiary", "outline"],
        a11y: ["status text/aria-label, not color alone"],
        tokens: {
          backgroundColor: "{colors.outline}",
          rounded: "{rounded.full}",
          height: "10px",
          width: "10px",
        },
        variants: [
          {
            id: "online",
            name: "Online",
            description: "Active / available.",
            tokens: { backgroundColor: "{colors.primary}" },
          },
          {
            id: "busy",
            name: "Busy",
            description: "Do not disturb.",
            tokens: { backgroundColor: "{colors.error}" },
          },
          {
            id: "away",
            name: "Away",
            description: "Idle / away.",
            tokens: { backgroundColor: "{colors.tertiary}" },
          },
        ],
      },
      {
        id: "loading-overlay",
        name: "Loading Overlay",
        description: "Blocks a region while content loads.",
        behavior:
          "Covers a container or the viewport with a translucent scrim and a spinner/message while an async task runs, blocking interaction beneath. Announces busy state and restores focus when cleared.",
        states: ["hidden", "visible"],
        params: [
          p("open", "boolean", "Whether the overlay is shown. Required.", "—"),
          p("message", "string", "Optional status message."),
          p("scope", "'container' | 'fullscreen'", "Coverage scope.", "'container'"),
        ],
        animations: ["Scrim fade-in", "Spinner rotation", "Fade-out on clear"],
        tokenRoles: ["surface", "on-surface", "primary"],
        a11y: ["aria-busy on region", "focus management on show/hide"],
        tokens: {
          backgroundColor: "{colors.surface}",
          textColor: "{colors.on-surface}",
        },
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
        tokens: {
          backgroundColor: "{colors.surface-container-high}",
          textColor: "{colors.on-surface}",
          rounded: "{rounded.lg}",
          padding: "24px",
        },
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
        tokens: {
          backgroundColor: "{colors.surface-container}",
          textColor: "{colors.on-surface}",
          padding: "20px",
        },
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
        tokens: {
          backgroundColor: "{colors.surface-container-high}",
          textColor: "{colors.on-surface}",
          rounded: "{rounded.md}",
          padding: "16px",
        },
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
        tokens: {
          backgroundColor: "transparent",
          textColor: "{colors.on-surface}",
          typography: "{typography.title-md}",
          padding: "16px 0",
        },
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
        tokens: {
          backgroundColor: "{colors.surface-container-highest}",
          textColor: "{colors.on-surface}",
          rounded: "{rounded.md}",
          padding: "12px 16px",
        },
      },
      {
        id: "confirm-dialog",
        name: "Confirm Dialog",
        description: "Modal asking the user to confirm an action.",
        behavior:
          "A focused modal with a title, message, and confirm/cancel actions. Traps focus, defaults focus to the safest action, closes on Esc/cancel, and emits confirm/cancel. Destructive confirms use an error-styled action.",
        states: ["closed", "open"],
        params: [
          p("open", "boolean", "Visibility. Required.", "—"),
          p("title", "string", "Dialog title."),
          p("message", "ReactNode", "Confirmation message."),
          p("destructive", "boolean", "Style the confirm as destructive.", "false"),
          p("onConfirm", "() => void", "Confirm handler."),
          p("onCancel", "() => void", "Cancel handler."),
        ],
        animations: ["Scrim fade", "Panel scale-in", "Reverse on close"],
        tokenRoles: ["surface-container-high", "on-surface", "error", "primary"],
        a11y: ["role=alertdialog", "focus trap", "Esc cancels", "return focus"],
        tokens: {
          backgroundColor: "{colors.surface-container-high}",
          textColor: "{colors.on-surface}",
          rounded: "{rounded.lg}",
          padding: "24px",
        },
      },
      {
        id: "sheet",
        name: "Bottom Sheet",
        description: "Mobile panel sliding from the bottom.",
        behavior:
          "Slides up from the bottom edge over a scrim, supporting drag-to-dismiss and snap points. Shares modal focus/Esc semantics; used for mobile actions and detail panels.",
        states: ["closed", "peek", "open"],
        params: [
          p("open", "boolean", "Visibility. Required.", "—"),
          p("snapPoints", "number[]", "Heights the sheet snaps to."),
          p("onClose", "() => void", "Close handler."),
        ],
        animations: ["Slide-up from bottom", "Drag-follow + snap", "Scrim fade"],
        tokenRoles: ["surface-container-high", "on-surface", "outline-variant"],
        a11y: ["dialog semantics", "focus trap", "Esc to close"],
        tokens: {
          backgroundColor: "{colors.surface-container-high}",
          textColor: "{colors.on-surface}",
          rounded: "{rounded.lg}",
          padding: "20px",
        },
      },
      {
        id: "context-menu",
        name: "Context Menu",
        description: "Right-click / long-press actions menu.",
        behavior:
          "Opens at the pointer on right-click (or long-press on touch) with contextual actions. Focus moves into the menu; arrow keys navigate, Enter activates, Esc/outside-click closes and restores focus.",
        states: ["closed", "open", "item-hover", "disabled-item"],
        params: [
          p("items", "{ id: string; label: string; disabled?: boolean }[]", "Menu items.", "—"),
          p("onSelect", "(id: string) => void", "Item-select handler."),
        ],
        animations: ["Open fade + scale at pointer", "Item hover highlight"],
        tokenRoles: ["surface-container-high", "on-surface"],
        a11y: ["role=menu/menuitem", "keyboard + Esc", "pointer & long-press triggers"],
        tokens: {
          backgroundColor: "{colors.surface-container-high}",
          textColor: "{colors.on-surface}",
          rounded: "{rounded.md}",
          padding: "8px",
        },
        stateTokens: {
          "item-hover": { backgroundColor: "{colors.surface-container-highest}" },
        },
      },
      {
        id: "dropdown",
        name: "Dropdown",
        description: "Button-triggered menu of actions or links.",
        behavior:
          "A trigger button opens an anchored menu of actions/links, positioned to stay in view. Arrow keys navigate, Enter activates, Esc/outside-click closes and returns focus to the trigger.",
        states: ["closed", "open", "item-hover", "item-focus"],
        params: [
          p("trigger", "ReactNode", "Element that opens the menu."),
          p("items", "{ id: string; label: string; href?: string }[]", "Menu items.", "—"),
          p("onSelect", "(id: string) => void", "Item-select handler."),
          p("align", "'start' | 'end'", "Menu alignment to the trigger.", "'start'"),
        ],
        animations: ["Open fade + scale from trigger", "Item hover highlight", "Chevron rotate"],
        tokenRoles: ["surface-container-high", "on-surface"],
        a11y: ["aria-haspopup/expanded on trigger", "role=menu/menuitem"],
        tokens: {
          backgroundColor: "{colors.surface-container-high}",
          textColor: "{colors.on-surface}",
          rounded: "{rounded.md}",
          padding: "8px",
        },
        stateTokens: {
          "item-hover": { backgroundColor: "{colors.surface-container-highest}" },
        },
      },
      {
        id: "lightbox",
        name: "Lightbox",
        description: "Fullscreen media viewer.",
        behavior:
          "Opens media (image/video) fullscreen over a scrim with prev/next navigation, zoom, and captions. Traps focus, supports arrow-key paging and Esc to close, and restores focus to the trigger.",
        states: ["closed", "open", "zoomed"],
        params: [
          p("items", "{ src: string; alt: string; caption?: string }[]", "Media items.", "—"),
          p("index", "number", "Active item index."),
          p("onClose", "() => void", "Close handler."),
        ],
        animations: ["Scrim fade", "Media zoom/transition", "Slide between items"],
        tokenRoles: ["surface", "on-surface", "scrim"],
        a11y: ["role=dialog", "focus trap", "alt text + captions", "arrow-key paging"],
        tokens: {
          backgroundColor: "{colors.surface}",
          textColor: "{colors.on-surface}",
        },
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
        tokens: {
          backgroundColor: "transparent",
          padding: "0 24px",
        },
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
        tokens: {
          backgroundColor: "transparent",
        },
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
        tokens: {
          backgroundColor: "{colors.outline-variant}",
        },
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
        tokens: {
          backgroundColor: "{colors.surface-container}",
          textColor: "{colors.on-surface}",
          rounded: "{rounded.md}",
          padding: "8px",
        },
      },
      {
        id: "stack",
        name: "Stack",
        description: "Vertical/horizontal flow with consistent gaps.",
        behavior:
          "Lays out children in a single direction with a uniform gap derived from the spacing scale, optionally with alignment and wrapping. Purely structural — no landmark or color of its own.",
        states: ["default"],
        params: [
          p("direction", "'row' | 'column'", "Flow direction.", "'column'"),
          p("gap", "string", "Gap between children."),
          p("align", "'start' | 'center' | 'end' | 'stretch'", "Cross-axis alignment.", "'stretch'"),
        ],
        animations: ["None"],
        tokenRoles: ["card-gap"],
        a11y: ["logical reading order"],
        tokens: { backgroundColor: "transparent" },
      },
      {
        id: "cluster",
        name: "Cluster",
        description: "Wrapping row of items with gaps.",
        behavior:
          "Arranges items in a row that wraps onto new lines as space runs out, keeping consistent gaps — ideal for tag lists, button rows, and metadata. Structural only.",
        states: ["default"],
        params: [
          p("gap", "string", "Gap between items."),
          p("justify", "'start' | 'center' | 'end' | 'between'", "Main-axis distribution.", "'start'"),
        ],
        animations: ["None"],
        tokenRoles: ["card-gap"],
        a11y: ["logical reading order"],
        tokens: { backgroundColor: "transparent" },
      },
      {
        id: "spacer",
        name: "Spacer",
        description: "Flexible or fixed empty space.",
        behavior:
          "Inserts space between elements — either a fixed size from the spacing scale or a flexible spacer that pushes siblings apart in a flex container. Decorative and aria-hidden.",
        states: ["default"],
        params: [
          p("size", "string", "Fixed size; omit for flexible."),
          p("axis", "'horizontal' | 'vertical'", "Spacing axis.", "'vertical'"),
        ],
        animations: ["None"],
        tokenRoles: ["section-margin"],
        a11y: ["decorative, aria-hidden"],
        tokens: { backgroundColor: "transparent" },
      },
      {
        id: "aspect-ratio",
        name: "Aspect Ratio",
        description: "Locks content to a width:height ratio.",
        behavior:
          "Constrains its child to a fixed aspect ratio (e.g. 16:9) regardless of width, preventing layout shift for media and embeds. Structural only.",
        states: ["default"],
        params: [
          p("ratio", "number", "Width / height, e.g. 1.777 for 16:9.", "1.777"),
          p("children", "ReactNode", "Content to constrain."),
        ],
        animations: ["None"],
        tokenRoles: ["surface-container"],
        a11y: ["preserves media semantics"],
        tokens: { backgroundColor: "transparent", rounded: "{rounded.md}" },
      },
      {
        id: "scroll-area",
        name: "Scroll Area",
        description: "Styled scrollable region.",
        behavior:
          "A bounded region with custom, accessible scrollbars (overlay or always-visible) that remains keyboard- and wheel-scrollable. Fades content edges to signal more content.",
        states: ["default", "scrolling"],
        params: [
          p("axis", "'vertical' | 'horizontal' | 'both'", "Scroll axes.", "'vertical'"),
          p("children", "ReactNode", "Scrollable content."),
        ],
        animations: ["Scrollbar fade on idle", "Edge fade masks"],
        tokenRoles: ["surface", "outline-variant"],
        a11y: ["keyboard scrollable", "scrollbar contrast"],
        tokens: { backgroundColor: "transparent" },
      },
      {
        id: "split-pane",
        name: "Split Pane",
        description: "Resizable two-panel layout.",
        behavior:
          "Two panels separated by a draggable divider; dragging or Arrow keys (when the divider is focused) resizes them within min/max bounds. Collapses to stacked on narrow screens.",
        states: ["default", "dragging", "collapsed"],
        params: [
          p("orientation", "'horizontal' | 'vertical'", "Split direction.", "'horizontal'"),
          p("defaultSize", "string", "Initial size of the first panel."),
          p("min", "string", "Minimum size of a panel."),
        ],
        animations: ["Divider hover highlight", "Resize follow", "Collapse transition"],
        tokenRoles: ["surface", "outline-variant"],
        a11y: ["role=separator with aria-valuenow", "keyboard resize"],
        tokens: { backgroundColor: "transparent" },
      },
      {
        id: "section",
        name: "Section",
        description: "Titled content region with vertical rhythm.",
        behavior:
          "A landmarked content region with an optional heading and consistent vertical spacing, used to structure long pages. Establishes heading hierarchy for its content.",
        states: ["default"],
        params: [
          p("title", "string", "Section heading."),
          p("description", "string", "Optional intro copy."),
          p("children", "ReactNode", "Section content."),
        ],
        animations: ["Optional reveal on scroll"],
        tokenRoles: ["background", "on-background", "section-margin"],
        a11y: ["section landmark", "heading hierarchy"],
        tokens: {
          backgroundColor: "transparent",
          textColor: "{colors.on-background}",
          padding: "40px 0",
        },
      },
      {
        id: "page-header",
        name: "Page Header",
        description: "Title, breadcrumbs, and page actions.",
        behavior:
          "The top region of a page: title, optional breadcrumbs/description, and a row of primary actions. Collapses actions into a menu on small screens and anchors the page's main heading.",
        states: ["default"],
        params: [
          p("title", "string", "Page title. Required.", "—"),
          p("breadcrumbs", "ReactNode", "Breadcrumb trail."),
          p("actions", "ReactNode", "Primary page actions."),
        ],
        animations: ["Actions collapse on resize"],
        tokenRoles: ["on-surface", "on-surface-variant", "surface"],
        a11y: ["h1 for the page title", "actions reachable by keyboard"],
        tokens: {
          backgroundColor: "transparent",
          textColor: "{colors.on-surface}",
          typography: "{typography.headline-lg}",
          padding: "24px 0",
        },
      },
      {
        id: "app-shell",
        name: "App Shell",
        description: "Top-level app frame (nav + content).",
        behavior:
          "The persistent application frame composing a top bar, side navigation, and a scrollable content region with skip links. Adapts navigation across breakpoints (rail → drawer → bottom-nav).",
        states: ["default", "nav-collapsed"],
        params: [
          p("header", "ReactNode", "Top bar content."),
          p("nav", "ReactNode", "Navigation region."),
          p("children", "ReactNode", "Main content."),
        ],
        animations: ["Nav collapse/expand", "Content reflow on breakpoint"],
        tokenRoles: ["background", "surface", "surface-container"],
        a11y: ["landmark regions (banner/nav/main)", "skip link"],
        tokens: {
          backgroundColor: "{colors.background}",
          textColor: "{colors.on-background}",
        },
      },
      {
        id: "card-grid",
        name: "Card Grid",
        description: "Responsive grid of cards/tiles.",
        behavior:
          "Arranges cards in a responsive grid using auto-fit/minmax so columns reflow by available width without per-breakpoint configuration, preserving DOM order.",
        states: ["default"],
        params: [
          p("minColumnWidth", "string", "Minimum card width before wrapping.", "'260px'"),
          p("gap", "string", "Gap between cards."),
          p("children", "ReactNode", "Card items."),
        ],
        animations: ["None (layout reflow)"],
        tokenRoles: ["card-gap"],
        a11y: ["logical reading order"],
        tokens: { backgroundColor: "transparent" },
      },
    ],
  },
  {
    id: "commerce",
    label: "Commerce & Marketing",
    components: [
      {
        id: "pricing-card",
        name: "Pricing Card",
        description: "A single plan with price, features, and CTA.",
        behavior:
          "Presents one plan: name, price/period, a feature list, and a call-to-action. A highlighted variant emphasizes the recommended plan; the CTA is a clear primary action and the feature list is a real list.",
        states: ["default", "highlighted", "hover"],
        params: [
          p("name", "string", "Plan name. Required.", "—"),
          p("price", "string", "Formatted price."),
          p("period", "string", "Billing period, e.g. '/mo'."),
          p("features", "string[]", "Feature bullets."),
          p("highlighted", "boolean", "Emphasize as recommended.", "false"),
          p("cta", "{ label: string; onClick: () => void }", "Primary action."),
        ],
        animations: ["Hover elevation lift", "Highlighted-plan emphasis"],
        tokenRoles: ["surface-container", "on-surface", "primary", "primary-container"],
        a11y: ["heading per plan", "feature list semantics", "CTA labeled"],
        tokens: {
          backgroundColor: "{colors.surface-container}",
          textColor: "{colors.on-surface}",
          rounded: "{rounded.lg}",
          padding: "24px",
        },
        variants: [
          {
            id: "default",
            name: "Default",
            description: "Standard plan card.",
            tokens: { backgroundColor: "{colors.surface-container}" },
          },
          {
            id: "highlighted",
            name: "Highlighted",
            description: "Recommended plan, emphasized surface.",
            tokens: {
              backgroundColor: "{colors.primary-container}",
              textColor: "{colors.on-primary-container}",
            },
          },
        ],
      },
      {
        id: "pricing-table",
        name: "Pricing Table",
        description: "Compare plans across features.",
        behavior:
          "A matrix comparing plans (columns) across features (rows), with check/cross or value cells and a CTA per plan. The recommended plan column is highlighted; the header stays visible while scrolling.",
        states: ["default", "highlighted-column"],
        params: [
          p("plans", "{ id: string; name: string; price: string }[]", "Plans (columns).", "—"),
          p("features", "{ key: string; label: string }[]", "Features (rows).", "—"),
          p("values", "Record<string, Record<string, string | boolean>>", "Plan×feature values.", "—"),
        ],
        animations: ["Column highlight transition", "Row hover"],
        tokenRoles: ["surface", "on-surface", "primary-container", "outline-variant"],
        a11y: ["table semantics", "th scope", "values not icon-only"],
        tokens: {
          backgroundColor: "{colors.surface}",
          textColor: "{colors.on-surface}",
          typography: "{typography.body-sm}",
        },
        stateTokens: {
          "highlighted-column": { backgroundColor: "{colors.primary-container}" },
        },
      },
      {
        id: "feature-card",
        name: "Feature Card",
        description: "Icon, title, and copy promoting a feature.",
        behavior:
          "A marketing tile pairing an icon/illustration with a short title and description, optionally linking to more detail. Used in feature grids; keeps a clear heading-to-body structure.",
        states: ["default", "hover"],
        params: [
          p("icon", "ReactNode", "Feature icon/illustration."),
          p("title", "string", "Feature title. Required.", "—"),
          p("description", "string", "Supporting copy."),
          p("href", "string", "Optional link target."),
        ],
        animations: ["Hover lift", "Icon accent on hover"],
        tokenRoles: ["surface-container", "on-surface", "primary"],
        a11y: ["heading + body structure", "whole-card link labeled"],
        tokens: {
          backgroundColor: "{colors.surface-container}",
          textColor: "{colors.on-surface}",
          rounded: "{rounded.lg}",
          padding: "24px",
        },
      },
      {
        id: "testimonial",
        name: "Testimonial",
        description: "Customer quote with attribution.",
        behavior:
          "Presents a customer quote with author name, role, and avatar, optionally with a rating. Uses blockquote semantics and keeps the attribution programmatically associated.",
        states: ["default"],
        params: [
          p("quote", "string", "Quote text. Required.", "—"),
          p("author", "string", "Author name."),
          p("role", "string", "Author role/company."),
          p("avatar", "ReactNode", "Author avatar."),
        ],
        animations: ["Reveal on scroll"],
        tokenRoles: ["surface-container", "on-surface", "on-surface-variant"],
        a11y: ["blockquote + cite semantics"],
        tokens: {
          backgroundColor: "{colors.surface-container}",
          textColor: "{colors.on-surface}",
          typography: "{typography.body-lg}",
          rounded: "{rounded.lg}",
          padding: "24px",
        },
      },
      {
        id: "cta-banner",
        name: "CTA Banner",
        description: "Prominent conversion call-to-action.",
        behavior:
          "A full-width section with a headline, supporting line, and one or two prominent actions to drive conversion. Strong visual emphasis via the primary surface; actions are clearly primary/secondary.",
        states: ["default"],
        params: [
          p("title", "string", "Headline. Required.", "—"),
          p("description", "string", "Supporting copy."),
          p("primary", "{ label: string; onClick: () => void }", "Primary action."),
          p("secondary", "{ label: string; onClick: () => void }", "Secondary action."),
        ],
        animations: ["Reveal on scroll", "Action hover feedback"],
        tokenRoles: ["primary", "on-primary", "primary-container"],
        a11y: ["h2 for the headline", "actions keyboard-reachable"],
        tokens: {
          backgroundColor: "{colors.primary-container}",
          textColor: "{colors.on-primary-container}",
          rounded: "{rounded.xl}",
          padding: "40px",
        },
      },
      {
        id: "stat-card",
        name: "Stat Card",
        description: "Boxed key metric with trend.",
        behavior:
          "A card wrapping a key metric: label, value, and an optional delta with a trend direction conveyed by color and an icon plus a text alternative. Used on dashboards and marketing pages.",
        states: ["default", "up", "down", "flat"],
        params: [
          p("label", "string", "Metric label."),
          p("value", "string | number", "Primary figure."),
          p("delta", "string", "Change indicator, e.g. '+12%'."),
          p("trend", "'up' | 'down' | 'flat'", "Trend direction.", "'flat'"),
        ],
        animations: ["Value count-up on mount", "Delta color emphasis"],
        tokenRoles: ["surface-container", "on-surface", "primary", "error"],
        a11y: ["text alternative for the trend"],
        tokens: {
          backgroundColor: "{colors.surface-container}",
          textColor: "{colors.on-surface}",
          rounded: "{rounded.lg}",
          padding: "20px",
        },
        variants: [
          {
            id: "up",
            name: "Up",
            description: "Positive trend emphasis.",
            tokens: { textColor: "{colors.primary}" },
          },
          {
            id: "down",
            name: "Down",
            description: "Negative trend emphasis.",
            tokens: { textColor: "{colors.error}" },
          },
          {
            id: "flat",
            name: "Flat",
            description: "Neutral / unchanged trend.",
            tokens: { textColor: "{colors.on-surface-variant}" },
          },
        ],
      },
      {
        id: "hero",
        name: "Hero",
        description: "Above-the-fold headline section.",
        behavior:
          "The leading page section: a large headline, supporting copy, primary/secondary actions, and optional media. Establishes the page's main heading and adapts media placement across breakpoints.",
        states: ["default"],
        params: [
          p("title", "string", "Hero headline. Required.", "—"),
          p("subtitle", "string", "Supporting copy."),
          p("primary", "{ label: string; onClick: () => void }", "Primary action."),
          p("media", "ReactNode", "Optional image/illustration."),
        ],
        animations: ["Staggered reveal on mount", "Media parallax (reduced-motion aware)"],
        tokenRoles: ["background", "on-background", "primary"],
        a11y: ["h1 for the headline", "media has alt text"],
        tokens: {
          backgroundColor: "{colors.background}",
          textColor: "{colors.on-background}",
          padding: "64px 0",
        },
      },
    ],
  },
];

export const ALL_COMPONENTS: UikitComponent[] = CATALOG.flatMap((c) => c.components);

export function getComponent(id: string): UikitComponent | undefined {
  return ALL_COMPONENTS.find((c) => c.id === id);
}

/**
 * Sensible base styling for a component that does not declare its own `tokens`.
 * Keeps every component representable in the `components` YAML block with
 * lint-safe token references.
 */
function defaultTokens(): ComponentToken {
  return {
    backgroundColor: "{colors.surface-container}",
    textColor: "{colors.on-surface}",
    rounded: "{rounded.md}",
    padding: "16px",
  };
}

/**
 * Expand the given component ids into a flat `ComponentToken` block for the
 * DESIGN.md `components` YAML. Each component yields a base entry plus one entry
 * per declared state and per variant (variant tokens are the base merged with
 * the override, so every entry is self-contained and fully resolvable).
 *
 * Keys: base `<id>`, state `<id>-<state>`, variant `<id>-<variant.id>`.
 */
export function catalogComponentsBlock(
  ids: string[]
): Record<string, ComponentToken> {
  const out: Record<string, ComponentToken> = {};
  for (const id of ids) {
    const c = getComponent(id);
    if (!c) continue;
    const base = c.tokens ?? defaultTokens();
    out[id] = base;
    // States are stored as the delta only (matching the `*-hover` convention).
    for (const [state, t] of Object.entries(c.stateTokens ?? {})) {
      out[`${id}-${state}`] = t;
    }
    // Variants are self-contained: base merged with the variant override.
    for (const v of c.variants ?? []) {
      out[`${id}-${v.id}`] = { ...base, ...v.tokens };
    }
  }
  return out;
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
    {
      name: string;
      states: string[];
      tokenRoles: string[];
      a11y: string[];
      variants?: { id: string; name: string }[];
    }
  >;
} {
  const components: Record<
    string,
    {
      name: string;
      states: string[];
      tokenRoles: string[];
      a11y: string[];
      variants?: { id: string; name: string }[];
    }
  > = {};
  for (const id of ids) {
    const c = getComponent(id);
    if (c) {
      components[id] = {
        name: c.name,
        states: c.states,
        tokenRoles: c.tokenRoles,
        a11y: c.a11y,
        ...(c.variants?.length
          ? { variants: c.variants.map((v) => ({ id: v.id, name: v.name })) }
          : {}),
      };
    }
  }
  return { ...(tech ? { tech } : {}), components };
}
