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
  // inputs
  "text-field": I.TextFieldPreview,
  "textarea": I.TextareaPreview,
  "select": I.SelectPreview,
  "checkbox": I.CheckboxPreview,
  "radio": I.RadioPreview,
  "switch": I.SwitchPreview,
  "slider": I.SliderPreview,
  "search": I.SearchPreview,
  // navigation
  "navbar": N.NavbarPreview,
  "sidebar": N.SidebarPreview,
  "tabs": N.TabsPreview,
  "breadcrumbs": N.BreadcrumbsPreview,
  "pagination": N.PaginationPreview,
  "menu": N.MenuPreview,
  // data
  "card": D.CardPreview,
  "table": D.TablePreview,
  "list": D.ListPreview,
  "avatar": D.AvatarPreview,
  "badge": D.BadgePreview,
  "chip": D.ChipPreview,
  "tooltip": D.TooltipPreview,
  "stat": D.StatPreview,
  // feedback
  "alert": F.AlertPreview,
  "toast": F.ToastPreview,
  "progress-bar": F.ProgressBarPreview,
  "spinner": F.SpinnerPreview,
  "skeleton": F.SkeletonPreview,
  "empty-state": F.EmptyStatePreview,
  // overlays
  "modal": O.ModalPreview,
  "drawer": O.DrawerPreview,
  "popover": O.PopoverPreview,
  "accordion": O.AccordionPreview,
  "tooltip-rich": O.RichTooltipPreview,
  // layout
  "container": L.ContainerPreview,
  "grid": L.GridPreview,
  "divider": L.DividerPreview,
  "toolbar": L.ToolbarPreview,
};

/** Shown for any catalog id that does not yet have a dedicated renderer. */
export function PreviewFallback({ doc }: { doc: DesignDoc }) {
  return <Caption doc={doc}>Preview coming soon</Caption>;
}
