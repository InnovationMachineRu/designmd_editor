"use client";

import type { ReactNode } from "react";
import type { DesignDoc } from "@/lib/designmd/types";
import { Caption } from "./primitives";
import * as A from "./actions";
import * as I from "./inputs";
import * as N from "./navigation";
import * as D from "./data";
import * as F from "./feedback";
import * as O from "./overlays";
import * as L from "./layout";
import * as C from "./commerce";

type PreviewFn = (props: { doc: DesignDoc }) => ReactNode;

/**
 * Maps each UIKit catalog `id` to a live, token-styled React preview. These are
 * the same design tokens the generated components will consume, so the preview
 * is a faithful "how it will look" rendering rather than a static mock.
 */
export const COMPONENT_PREVIEWS: Record<string, PreviewFn> = {
  // actions
  "button": A.ButtonPreview,
  "icon-button": A.IconButtonPreview,
  "button-group": A.ButtonGroupPreview,
  "fab": A.FabPreview,
  "link": A.LinkPreview,
  "split-button": A.SplitButtonPreview,
  "toggle-button": A.ToggleButtonPreview,
  "copy-button": A.CopyButtonPreview,
  "segmented-control": A.SegmentedControlPreview,
  // inputs
  "text-field": I.TextFieldPreview,
  "textarea": I.TextareaPreview,
  "select": I.SelectPreview,
  "checkbox": I.CheckboxPreview,
  "radio": I.RadioPreview,
  "switch": I.SwitchPreview,
  "slider": I.SliderPreview,
  "search": I.SearchPreview,
  "number-field": I.NumberFieldPreview,
  "password-field": I.PasswordFieldPreview,
  "date-picker": I.DatePickerPreview,
  "time-picker": I.TimePickerPreview,
  "file-upload": I.FileUploadPreview,
  "combobox": I.ComboboxPreview,
  "tag-input": I.TagInputPreview,
  "otp-input": I.OtpInputPreview,
  "rating": I.RatingPreview,
  "color-input": I.ColorInputPreview,
  "form-field": I.FormFieldPreview,
  "fieldset": I.FieldsetPreview,
  // navigation
  "navbar": N.NavbarPreview,
  "sidebar": N.SidebarPreview,
  "tabs": N.TabsPreview,
  "breadcrumbs": N.BreadcrumbsPreview,
  "pagination": N.PaginationPreview,
  "menu": N.MenuPreview,
  "stepper": N.StepperPreview,
  "command-palette": N.CommandPalettePreview,
  "bottom-nav": N.BottomNavPreview,
  "nav-rail": N.NavRailPreview,
  "tree-view": N.TreeViewPreview,
  "back-to-top": N.BackToTopPreview,
  // data
  "card": D.CardPreview,
  "table": D.TablePreview,
  "list": D.ListPreview,
  "avatar": D.AvatarPreview,
  "badge": D.BadgePreview,
  "chip": D.ChipPreview,
  "tooltip": D.TooltipPreview,
  "stat": D.StatPreview,
  "label": D.LabelPreview,
  "description-list": D.DescriptionListPreview,
  "timeline": D.TimelinePreview,
  "kbd": D.KbdPreview,
  "code-block": D.CodeBlockPreview,
  "carousel": D.CarouselPreview,
  "calendar": D.CalendarPreview,
  "data-grid": D.DataGridPreview,
  // feedback
  "alert": F.AlertPreview,
  "toast": F.ToastPreview,
  "progress-bar": F.ProgressBarPreview,
  "spinner": F.SpinnerPreview,
  "skeleton": F.SkeletonPreview,
  "empty-state": F.EmptyStatePreview,
  "callout": F.CalloutPreview,
  "banner": F.BannerPreview,
  "inline-message": F.InlineMessagePreview,
  "progress-circle": F.ProgressCirclePreview,
  "status-dot": F.StatusDotPreview,
  "loading-overlay": F.LoadingOverlayPreview,
  // overlays
  "modal": O.ModalPreview,
  "drawer": O.DrawerPreview,
  "popover": O.PopoverPreview,
  "accordion": O.AccordionPreview,
  "tooltip-rich": O.RichTooltipPreview,
  "confirm-dialog": O.ConfirmDialogPreview,
  "sheet": O.SheetPreview,
  "context-menu": O.ContextMenuPreview,
  "dropdown": O.DropdownPreview,
  "lightbox": O.LightboxPreview,
  // layout
  "container": L.ContainerPreview,
  "grid": L.GridPreview,
  "divider": L.DividerPreview,
  "toolbar": L.ToolbarPreview,
  "stack": L.StackPreview,
  "cluster": L.ClusterPreview,
  "spacer": L.SpacerPreview,
  "aspect-ratio": L.AspectRatioPreview,
  "scroll-area": L.ScrollAreaPreview,
  "split-pane": L.SplitPanePreview,
  "section": L.SectionPreview,
  "page-header": L.PageHeaderPreview,
  "app-shell": L.AppShellPreview,
  "card-grid": L.CardGridPreview,
  // commerce
  "pricing-card": C.PricingCardPreview,
  "pricing-table": C.PricingTablePreview,
  "feature-card": C.FeatureCardPreview,
  "testimonial": C.TestimonialPreview,
  "cta-banner": C.CtaBannerPreview,
  "stat-card": C.StatCardPreview,
  "hero": C.HeroPreview,
};

/** Shown for any catalog id that does not yet have a dedicated renderer. */
export function PreviewFallback({ doc }: { doc: DesignDoc }) {
  return <Caption doc={doc}>Preview coming soon</Caption>;
}
