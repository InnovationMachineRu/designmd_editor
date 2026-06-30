/**
 * A broad catalog of layouts. Users select a subset on the Layouts step; the
 * selection becomes part of the exported DESIGN.md (YAML snapshot) and the
 * generated spec (markdown sections). Layouts cover both whole **pages** and
 * complex **component** compositions, so a generated UIKit knows how to arrange
 * its components responsively.
 *
 * Each layout documents its named regions, structural composition, and the
 * responsive (media-query) behavior it expects — the source of truth for the
 * per-layout responsive rules in the export.
 */

/** Page-level layout vs a complex-component composition. */
export type LayoutKind = "page" | "component";

/** A schematic hint that drives the generic wireframe preview (not serialized). */
export interface LayoutPreviewHint {
  /** Persistent chrome regions drawn around the body. */
  chrome?: ("header" | "footer" | "sidebar" | "aside")[];
  /** The dominant pattern of the main content area. */
  body:
    | "grid"
    | "cards"
    | "list"
    | "table"
    | "form"
    | "split"
    | "hero"
    | "feed"
    | "detail"
    | "centered"
    | "kanban"
    | "stack"
    | "stats";
}

export interface LayoutItem {
  id: string;
  name: string;
  /** Whole page vs a reusable complex-component layout. */
  kind: LayoutKind;
  description: string;
  /** Named slots/regions, e.g. ["header", "sidebar", "main", "footer"]. */
  regions: string[];
  /** Grid/flex composition summary (drives the wireframe + spec). */
  structure: string;
  /** Per-layout media-query behavior (mobile → desktop). */
  responsive: string;
  /** Design-token roles the layout binds to (spacing, color, rounding…). */
  tokenRoles: string[];
  /** Accessibility requirements. */
  a11y: string[];
  /** When to reach for this layout. */
  bestFor: string;
  /** Optional schematic hint for the preview wireframe. */
  preview?: LayoutPreviewHint;
}

export interface LayoutCategory {
  id: string;
  label: string;
  layouts: LayoutItem[];
}

/** Compact constructor — fills sensible token/a11y defaults so entries stay terse. */
function mk(o: {
  id: string;
  name: string;
  kind: LayoutKind;
  description: string;
  regions: string[];
  structure: string;
  responsive: string;
  bestFor: string;
  preview?: LayoutPreviewHint;
  tokenRoles?: string[];
  a11y?: string[];
}): LayoutItem {
  return {
    tokenRoles: ["spacing.unit", "spacing.container-padding", "colors.surface", "rounded.md"],
    a11y: [
      "Use semantic landmark elements (header, nav, main, aside, footer).",
      "Keep DOM order = visual reading order so focus and screen-reader flow match.",
    ],
    ...o,
  };
}

export const LAYOUT_CATALOG: LayoutCategory[] = [
  {
    id: "pages-marketing",
    label: "Pages — Marketing",
    layouts: [
      mk({
        id: "landing",
        name: "Landing page",
        kind: "page",
        description: "Full marketing page: hero, feature sections, social proof, and a closing CTA.",
        regions: ["header", "hero", "features", "social-proof", "cta", "footer"],
        structure: "Stacked full-width sections; constrained content container per section; hero leads, CTA closes.",
        responsive: "Single column on mobile; multi-column feature/proof grids unfold at md+; sticky header condenses to a menu button below md.",
        bestFor: "Top-of-funnel marketing and product launch pages.",
        preview: { chrome: ["header", "footer"], body: "hero" },
      }),
      mk({
        id: "hero-features",
        name: "Hero + feature grid",
        kind: "page",
        description: "Compact hero followed by a 2–4 column grid of feature cards.",
        regions: ["header", "hero", "features", "footer"],
        structure: "Hero band over a responsive feature card grid.",
        responsive: "Features stack to 1 column < sm, 2 at sm, 3–4 at lg; hero text/image swap to a single column on mobile.",
        bestFor: "Feature overview / value-proposition pages.",
        preview: { chrome: ["header", "footer"], body: "grid" },
      }),
      mk({
        id: "pricing",
        name: "Pricing page",
        kind: "page",
        description: "Tiered pricing cards with a feature-comparison area and FAQ.",
        regions: ["header", "intro", "plans", "comparison", "faq", "footer"],
        structure: "Row of equal-height plan cards; highlighted recommended tier; comparison table below.",
        responsive: "Plans stack vertically on mobile (recommended tier first); become a side-by-side row at md+; comparison table scrolls horizontally on small screens.",
        bestFor: "Subscription and plan-selection pages.",
        preview: { chrome: ["header", "footer"], body: "cards" },
      }),
      mk({
        id: "feature-detail",
        name: "Feature detail (media + text)",
        kind: "page",
        description: "Alternating media-and-text rows describing a single feature in depth.",
        regions: ["header", "intro", "media-rows", "cta", "footer"],
        structure: "Alternating 2-column media/text rows (zig-zag); centered intro and CTA.",
        responsive: "Each row collapses to a stacked media-over-text single column below md; alternation order normalizes on mobile.",
        bestFor: "Deep dives on one capability.",
        preview: { chrome: ["header", "footer"], body: "split" },
      }),
      mk({
        id: "faq",
        name: "FAQ page",
        kind: "page",
        description: "Searchable, grouped accordion of questions and answers.",
        regions: ["header", "search", "faq-groups", "contact-cta", "footer"],
        structure: "Optional search field over grouped accordion lists.",
        responsive: "Single column throughout; groups become a 2-column masonry at lg to reduce scroll.",
        bestFor: "Support and pre-sales question pages.",
        preview: { chrome: ["header", "footer"], body: "list" },
      }),
      mk({
        id: "coming-soon",
        name: "Coming soon",
        kind: "page",
        description: "Centered teaser with an email-capture form and countdown.",
        regions: ["logo", "headline", "capture-form", "social"],
        structure: "Vertically and horizontally centered single column on a full-bleed background.",
        responsive: "Same centered column at all sizes; padding and type scale up at md+.",
        bestFor: "Pre-launch capture pages.",
        preview: { body: "centered" },
      }),
    ],
  },
  {
    id: "pages-app",
    label: "Pages — Application",
    layouts: [
      mk({
        id: "dashboard",
        name: "Dashboard",
        kind: "page",
        description: "App shell with KPI stats, charts, and recent-activity widgets.",
        regions: ["header", "sidebar", "stats", "charts", "activity"],
        structure: "Persistent sidebar + top bar; main area is a responsive widget grid (stats row, charts, lists).",
        responsive: "Sidebar collapses to an off-canvas drawer below lg; widget grid goes 1 col on mobile, 2 at md, 3–4 at xl.",
        bestFor: "Analytics and operational overview screens.",
        preview: { chrome: ["header", "sidebar"], body: "stats" },
      }),
      mk({
        id: "app-shell-sidebar",
        name: "App shell (sidebar)",
        kind: "page",
        description: "Classic admin shell: left nav, top bar, scrollable content region.",
        regions: ["header", "sidebar", "main", "footer"],
        structure: "Fixed sidebar, fixed top bar, independently scrolling main column.",
        responsive: "Sidebar is permanent at lg+, an overlay drawer below; top bar gains a hamburger toggle on mobile.",
        bestFor: "The frame for most internal tools.",
        preview: { chrome: ["header", "sidebar", "footer"], body: "stack" },
      }),
      mk({
        id: "settings",
        name: "Settings",
        kind: "page",
        description: "Sectioned settings with a secondary nav and grouped form panels.",
        regions: ["header", "settings-nav", "panels"],
        structure: "Left sub-nav of sections + right column of grouped setting cards/forms.",
        responsive: "Sub-nav becomes a horizontal tab/scroller above the panels below md; panels are single column on mobile.",
        bestFor: "Account, workspace, and app preferences.",
        preview: { chrome: ["header", "sidebar"], body: "form" },
      }),
      mk({
        id: "profile",
        name: "Profile",
        kind: "page",
        description: "Identity header with tabs for activity, details, and connections.",
        regions: ["header", "cover", "identity", "tabs", "content"],
        structure: "Cover/banner, avatar + identity block, tab bar, tabbed content.",
        responsive: "Identity block centers and stacks on mobile; tabs become a horizontal scroller; content goes single column.",
        bestFor: "User and entity profile screens.",
        preview: { chrome: ["header"], body: "detail" },
      }),
      mk({
        id: "inbox",
        name: "Inbox (list + detail)",
        kind: "page",
        description: "Master list of messages beside a reading pane.",
        regions: ["header", "sidebar", "list", "detail"],
        structure: "Three panes: folders nav, message list, message detail.",
        responsive: "Detail overlays/replaces the list on mobile (drill-in pattern); all three panes show side-by-side at xl.",
        bestFor: "Mail, chat, and notification centers.",
        preview: { chrome: ["header", "sidebar"], body: "split" },
      }),
      mk({
        id: "kanban-page",
        name: "Kanban board",
        kind: "page",
        description: "Horizontally scrolling columns of draggable cards.",
        regions: ["header", "toolbar", "columns"],
        structure: "Toolbar over a horizontal track of fixed-width status columns.",
        responsive: "Columns scroll horizontally on all sizes; on mobile, snap-scroll one column at a time.",
        bestFor: "Task, pipeline, and workflow boards.",
        preview: { chrome: ["header"], body: "kanban" },
      }),
      mk({
        id: "table-page",
        name: "Data table page",
        kind: "page",
        description: "Filter/search toolbar over a dense, paginated data table.",
        regions: ["header", "toolbar", "table", "pagination"],
        structure: "Sticky toolbar (search, filters, actions) above a sortable table with pagination.",
        responsive: "Table scrolls horizontally below md or collapses rows into stacked key/value cards; toolbar wraps.",
        bestFor: "Admin records and resource management.",
        preview: { chrome: ["header"], body: "table" },
      }),
      mk({
        id: "calendar-page",
        name: "Calendar",
        kind: "page",
        description: "Month/week grid with an event side panel.",
        regions: ["header", "toolbar", "calendar-grid", "event-panel"],
        structure: "Toolbar (view switch, navigation) over a 7-column grid; optional event detail aside.",
        responsive: "Month grid at lg+; switches to an agenda/day list on mobile; event panel becomes a bottom sheet.",
        bestFor: "Scheduling and booking views.",
        preview: { chrome: ["header", "aside"], body: "grid" },
      }),
    ],
  },
  {
    id: "pages-auth",
    label: "Pages — Auth & Onboarding",
    layouts: [
      mk({
        id: "sign-in",
        name: "Sign in",
        kind: "page",
        description: "Centered credential card with social-auth options.",
        regions: ["logo", "form-card", "alt-actions"],
        structure: "Centered narrow card: title, fields, primary button, divider, social buttons.",
        responsive: "Card is full-width with side padding on mobile, fixed max-width centered at sm+.",
        bestFor: "Login screens.",
        preview: { body: "centered" },
      }),
      mk({
        id: "sign-up",
        name: "Sign up (split)",
        kind: "page",
        description: "Two-pane registration: marketing panel beside the form.",
        regions: ["brand-panel", "form-panel"],
        structure: "Split screen — left brand/value panel, right scrollable form.",
        responsive: "Brand panel hides below lg, leaving the centered form; form remains single column.",
        bestFor: "Registration with a value pitch.",
        preview: { body: "split" },
      }),
      mk({
        id: "forgot-password",
        name: "Forgot / reset password",
        kind: "page",
        description: "Minimal single-field flow with confirmation state.",
        regions: ["logo", "instructions", "form-card"],
        structure: "Centered card with one field and a back link; success/empty state swaps in.",
        responsive: "Centered column at all sizes.",
        bestFor: "Account recovery.",
        preview: { body: "centered" },
      }),
      mk({
        id: "onboarding-wizard",
        name: "Onboarding wizard",
        kind: "page",
        description: "Multi-step flow with a progress indicator and per-step forms.",
        regions: ["header", "progress", "step-body", "footer-nav"],
        structure: "Progress stepper, single visible step body, sticky back/next footer.",
        responsive: "Progress becomes a compact dots/segment bar on mobile; step body is single column; footer stays pinned.",
        bestFor: "First-run setup and guided flows.",
        preview: { chrome: ["header", "footer"], body: "form" },
      }),
    ],
  },
  {
    id: "pages-content",
    label: "Pages — Content",
    layouts: [
      mk({
        id: "article",
        name: "Article / long-form",
        kind: "page",
        description: "Readable measure with a sticky table of contents and meta rail.",
        regions: ["header", "title", "toc", "article-body", "footer"],
        structure: "Centered prose column (measure ~65ch) with an optional sticky TOC aside.",
        responsive: "TOC hides below lg (becomes an inline collapsible at top); body stays a single readable column.",
        bestFor: "Blog posts, documentation articles, editorial.",
        preview: { chrome: ["header", "aside", "footer"], body: "detail" },
      }),
      mk({
        id: "blog-index",
        name: "Blog index",
        kind: "page",
        description: "Featured post over a grid/list of article cards with filters.",
        regions: ["header", "featured", "filters", "post-grid", "footer"],
        structure: "Featured hero card, category filter row, responsive card grid.",
        responsive: "Grid is 1 col mobile, 2 at md, 3 at lg; featured card stacks its media above text on mobile.",
        bestFor: "Content listing / archive pages.",
        preview: { chrome: ["header", "footer"], body: "cards" },
      }),
      mk({
        id: "docs",
        name: "Documentation",
        kind: "page",
        description: "Three-column docs: nav tree, content, on-this-page TOC.",
        regions: ["header", "nav-tree", "content", "toc"],
        structure: "Left nav tree, center content, right in-page TOC.",
        responsive: "Both side columns collapse below lg (nav → drawer, TOC → inline); content is full width on mobile.",
        bestFor: "Developer and product documentation.",
        preview: { chrome: ["header", "sidebar", "aside"], body: "detail" },
      }),
      mk({
        id: "search-results",
        name: "Search results",
        kind: "page",
        description: "Query bar, faceted filters, and a ranked result list.",
        regions: ["header", "search", "facets", "results"],
        structure: "Search bar on top, left facet sidebar, right result list with counts.",
        responsive: "Facets become a filter drawer/sheet below md; results are a single column list.",
        bestFor: "Search and discovery surfaces.",
        preview: { chrome: ["header", "sidebar"], body: "list" },
      }),
      mk({
        id: "gallery-page",
        name: "Media gallery",
        kind: "page",
        description: "Masonry/justified grid of media with a lightbox.",
        regions: ["header", "filters", "media-grid"],
        structure: "Filter row over a masonry or justified image grid; click opens a lightbox overlay.",
        responsive: "Grid column count scales 2 → 5 from mobile to xl; preserves aspect ratios.",
        bestFor: "Portfolios, photo, and asset libraries.",
        preview: { chrome: ["header"], body: "grid" },
      }),
    ],
  },
  {
    id: "pages-commerce",
    label: "Pages — Commerce",
    layouts: [
      mk({
        id: "product-listing",
        name: "Product listing",
        kind: "page",
        description: "Faceted product grid with sort and pagination.",
        regions: ["header", "filters", "sort-bar", "product-grid", "pagination"],
        structure: "Left facet sidebar, sort bar, responsive product card grid, pagination.",
        responsive: "Filters collapse to a drawer below md; grid is 2 cols mobile → 4 at xl.",
        bestFor: "Category and catalog browsing.",
        preview: { chrome: ["header", "sidebar"], body: "grid" },
      }),
      mk({
        id: "product-detail",
        name: "Product detail",
        kind: "page",
        description: "Gallery beside buy-box, with details tabs and related items.",
        regions: ["header", "gallery", "buy-box", "details", "related"],
        structure: "Two-column gallery + sticky buy box; tabbed details; related carousel below.",
        responsive: "Gallery stacks above the buy box on mobile; buy box stops being sticky; related becomes a swipe carousel.",
        bestFor: "Single product pages.",
        preview: { chrome: ["header"], body: "split" },
      }),
      mk({
        id: "cart",
        name: "Shopping cart",
        kind: "page",
        description: "Editable line items beside an order summary.",
        regions: ["header", "line-items", "summary"],
        structure: "Left scrollable line-item list, right sticky order summary with totals.",
        responsive: "Summary drops below the items and becomes a sticky bottom bar on mobile.",
        bestFor: "Cart review before checkout.",
        preview: { chrome: ["header", "aside"], body: "list" },
      }),
      mk({
        id: "checkout",
        name: "Checkout",
        kind: "page",
        description: "Stepped address/shipping/payment forms beside an order summary.",
        regions: ["header", "checkout-steps", "summary"],
        structure: "Left multi-section form (contact, shipping, payment), right persistent summary.",
        responsive: "Single column on mobile with a collapsible summary; two columns at lg+.",
        bestFor: "Purchase completion flows.",
        preview: { chrome: ["header", "aside"], body: "form" },
      }),
      mk({
        id: "order-confirmation",
        name: "Order confirmation",
        kind: "page",
        description: "Success state with order details and next actions.",
        regions: ["header", "confirmation", "order-summary", "next-steps"],
        structure: "Centered success header, order detail card, suggested next steps.",
        responsive: "Single centered column; detail card spans full width with padding on mobile.",
        bestFor: "Post-purchase receipts.",
        preview: { chrome: ["header"], body: "centered" },
      }),
    ],
  },
  {
    id: "pages-utility",
    label: "Pages — Utility & States",
    layouts: [
      mk({
        id: "empty-state",
        name: "Empty state",
        kind: "page",
        description: "Centered illustration, explanation, and a primary action.",
        regions: ["illustration", "headline", "description", "action"],
        structure: "Centered single column inside the content region.",
        responsive: "Constant centered column; illustration scales down on mobile.",
        bestFor: "Zero-data and first-use screens.",
        preview: { body: "centered" },
      }),
      mk({
        id: "error-404",
        name: "404 / not found",
        kind: "page",
        description: "Friendly error with search and navigation back.",
        regions: ["code", "message", "search", "links"],
        structure: "Centered code + message with a search field and helpful links.",
        responsive: "Centered column at all sizes.",
        bestFor: "Missing-route handling.",
        preview: { body: "centered" },
      }),
      mk({
        id: "error-500",
        name: "500 / maintenance",
        kind: "page",
        description: "System-error or maintenance notice with status link.",
        regions: ["icon", "message", "status-link"],
        structure: "Centered icon, message, and a status/retry action.",
        responsive: "Centered column at all sizes.",
        bestFor: "Outage and downtime pages.",
        preview: { body: "centered" },
      }),
      mk({
        id: "loading-skeleton",
        name: "Loading skeleton",
        kind: "page",
        description: "Skeleton placeholders mirroring the target layout's shape.",
        regions: ["header", "skeleton-body"],
        structure: "Shimmering placeholder blocks matching the eventual content grid.",
        responsive: "Skeleton mirrors the destination layout's responsive grid exactly.",
        bestFor: "Perceived-performance loading states.",
        preview: { chrome: ["header"], body: "stack" },
      }),
    ],
  },
  {
    id: "components-navigation",
    label: "Components — Navigation",
    layouts: [
      mk({
        id: "top-navbar",
        name: "Top navigation bar",
        kind: "component",
        description: "Brand, primary links, search, and account actions in a top bar.",
        regions: ["brand", "primary-links", "actions"],
        structure: "Flex row: brand left, links center/left, actions right.",
        responsive: "Links collapse into a hamburger menu below md; actions reduce to icons.",
        bestFor: "Global site/app headers.",
        preview: { chrome: ["header"], body: "stack" },
      }),
      mk({
        id: "sidebar-nav",
        name: "Sidebar navigation",
        kind: "component",
        description: "Collapsible vertical nav with groups, icons, and labels.",
        regions: ["brand", "nav-groups", "footer-actions"],
        structure: "Vertical stack of grouped nav items; collapsible to an icon rail.",
        responsive: "Permanent at lg+, off-canvas drawer below; supports an icon-only collapsed mode.",
        bestFor: "App and dashboard side navigation.",
        preview: { chrome: ["sidebar"], body: "list" },
      }),
      mk({
        id: "breadcrumb-toolbar",
        name: "Breadcrumb + toolbar",
        kind: "component",
        description: "Breadcrumb trail with contextual action buttons.",
        regions: ["breadcrumb", "title", "actions"],
        structure: "Breadcrumb row above a title + right-aligned action cluster.",
        responsive: "Breadcrumb truncates with an overflow menu on mobile; actions collapse into a kebab menu.",
        bestFor: "Page headers in deep hierarchies.",
        preview: { body: "stack" },
      }),
      mk({
        id: "tab-bar",
        name: "Tab bar",
        kind: "component",
        description: "Horizontal tabs switching between content panels.",
        regions: ["tabs", "panel"],
        structure: "Scrollable tab strip over a single visible panel.",
        responsive: "Tabs become horizontally scrollable with edge fades on mobile; active tab auto-scrolls into view.",
        bestFor: "Sectioned content within a page.",
        preview: { body: "stack" },
      }),
      mk({
        id: "pagination-bar",
        name: "Pagination bar",
        kind: "component",
        description: "Page controls with range summary and page-size select.",
        regions: ["range-summary", "page-controls", "page-size"],
        structure: "Flex row: result range left, page buttons center, size select right.",
        responsive: "Collapses to prev/next + current indicator on mobile; hides numbered pages.",
        bestFor: "Paginated tables and lists.",
        preview: { body: "stack" },
      }),
      mk({
        id: "footer",
        name: "Footer",
        kind: "component",
        description: "Multi-column link groups, legal row, and social links.",
        regions: ["link-columns", "newsletter", "legal"],
        structure: "Responsive multi-column link grid over a legal/social bottom row.",
        responsive: "Columns stack into accordions on mobile; become a 3–5 column grid at md+.",
        bestFor: "Site footers.",
        preview: { chrome: ["footer"], body: "grid" },
      }),
    ],
  },
  {
    id: "components-hero",
    label: "Components — Hero & Banners",
    layouts: [
      mk({
        id: "hero-split",
        name: "Hero (split)",
        kind: "component",
        description: "Headline/CTA on one side, media on the other.",
        regions: ["copy", "media"],
        structure: "Two-column band: text + CTAs left, image/illustration right.",
        responsive: "Stacks to media-over-copy (or copy-over-media) single column below md.",
        bestFor: "Above-the-fold marketing.",
        preview: { body: "split" },
      }),
      mk({
        id: "hero-centered",
        name: "Hero (centered)",
        kind: "component",
        description: "Centered headline, subhead, and CTA over an optional background.",
        regions: ["headline", "subhead", "cta"],
        structure: "Centered single column with generous vertical rhythm.",
        responsive: "Type and spacing scale up at md+; remains centered everywhere.",
        bestFor: "Simple, punchy hero sections.",
        preview: { body: "hero" },
      }),
      mk({
        id: "stats-row",
        name: "Stats / KPI row",
        kind: "component",
        description: "Row of headline metrics with labels and deltas.",
        regions: ["stat-cards"],
        structure: "Equal-width metric cards in a single row.",
        responsive: "Wraps 2-up on mobile, 4-up at md+; numbers stay prominent.",
        bestFor: "Dashboards and marketing proof.",
        preview: { body: "stats" },
      }),
    ],
  },
  {
    id: "components-collections",
    label: "Components — Collections",
    layouts: [
      mk({
        id: "card-grid",
        name: "Card grid",
        kind: "component",
        description: "Uniform responsive grid of content cards.",
        regions: ["cards"],
        structure: "Auto-fit grid of equal-height cards with a min column width.",
        responsive: "Uses auto-fit/minmax so columns reflow naturally; 1 → 4 columns across breakpoints.",
        bestFor: "Catalogs, galleries, dashboards.",
        preview: { body: "cards" },
      }),
      mk({
        id: "masonry-grid",
        name: "Masonry grid",
        kind: "component",
        description: "Variable-height tiles packed into balanced columns.",
        regions: ["tiles"],
        structure: "Column-based masonry preserving item aspect ratios.",
        responsive: "Column count scales 1 → 4; falls back to a simple grid where masonry is unsupported.",
        bestFor: "Image and pin-style feeds.",
        preview: { body: "grid" },
      }),
      mk({
        id: "data-table",
        name: "Data table",
        kind: "component",
        description: "Sortable, selectable rows with sticky header and actions.",
        regions: ["table-header", "rows", "row-actions"],
        structure: "Sticky header, zebra rows, inline/row-end actions, optional selection column.",
        responsive: "Horizontal scroll with a frozen first column below md, or collapse each row into a labeled card stack.",
        bestFor: "Dense record management.",
        preview: { body: "table" },
      }),
      mk({
        id: "list-detail",
        name: "List + detail (master-detail)",
        kind: "component",
        description: "Selectable list paired with a synchronized detail pane.",
        regions: ["list", "detail"],
        structure: "Two panes: scrollable list left, detail right, kept in sync.",
        responsive: "Drill-in on mobile (detail replaces list, with a back affordance); side-by-side at lg+.",
        bestFor: "Inboxes, settings, record browsers.",
        preview: { body: "split" },
      }),
      mk({
        id: "feed",
        name: "Feed",
        kind: "component",
        description: "Vertical stream of posts with infinite scroll.",
        regions: ["composer", "posts"],
        structure: "Optional composer over a single-column stream of post cards.",
        responsive: "Single column on mobile; centered column with optional rails at lg+.",
        bestFor: "Social and activity streams.",
        preview: { body: "feed" },
      }),
      mk({
        id: "comments-thread",
        name: "Comments thread",
        kind: "component",
        description: "Nested replies with a reply composer.",
        regions: ["composer", "comments"],
        structure: "Indented reply tree under each root comment.",
        responsive: "Reduce indentation depth on mobile; collapse deep threads behind a 'view replies' control.",
        bestFor: "Discussions and reviews.",
        preview: { body: "list" },
      }),
      mk({
        id: "timeline",
        name: "Timeline",
        kind: "component",
        description: "Chronological events along a connecting spine.",
        regions: ["events"],
        structure: "Vertical line with alternating or single-side event nodes.",
        responsive: "Alternating sides collapse to one side on mobile; spine moves to the left edge.",
        bestFor: "Activity history and changelogs.",
        preview: { body: "list" },
      }),
    ],
  },
  {
    id: "components-forms",
    label: "Components — Forms",
    layouts: [
      mk({
        id: "form-single-column",
        name: "Form (single column)",
        kind: "component",
        description: "Stacked fields with grouped sections and a sticky action bar.",
        regions: ["sections", "actions"],
        structure: "Single readable column of grouped fields; actions pinned at the bottom.",
        responsive: "Always single column; action bar becomes a sticky bottom bar on mobile.",
        bestFor: "Most create/edit forms.",
        preview: { body: "form" },
      }),
      mk({
        id: "form-two-column",
        name: "Form (two column)",
        kind: "component",
        description: "Paired fields with a description rail per section.",
        regions: ["section-desc", "section-fields"],
        structure: "Left description, right field group per section (settings-style).",
        responsive: "Description stacks above fields below md; collapses to single column.",
        bestFor: "Settings-heavy forms with guidance.",
        preview: { body: "split" },
      }),
      mk({
        id: "form-stepped",
        name: "Form (stepped)",
        kind: "component",
        description: "Wizard with a step indicator and per-step validation.",
        regions: ["stepper", "step-fields", "nav"],
        structure: "Step indicator, one visible step of fields, back/next controls.",
        responsive: "Stepper compresses to dots on mobile; fields single column; nav pinned.",
        bestFor: "Long flows split into stages.",
        preview: { body: "form" },
      }),
      mk({
        id: "filter-sidebar",
        name: "Filter sidebar",
        kind: "component",
        description: "Grouped, collapsible filters with applied-chips summary.",
        regions: ["applied-chips", "filter-groups", "apply"],
        structure: "Vertical accordion of filter groups with an applied-filters summary.",
        responsive: "Becomes a slide-over drawer / bottom sheet below md with an Apply button.",
        bestFor: "Faceted search and catalogs.",
        preview: { chrome: ["sidebar"], body: "form" },
      }),
    ],
  },
  {
    id: "components-overlay",
    label: "Components — Overlays",
    layouts: [
      mk({
        id: "modal-dialog",
        name: "Modal dialog",
        kind: "component",
        description: "Centered dialog with header, body, and footer actions.",
        regions: ["overlay", "header", "body", "footer"],
        structure: "Scrim + centered panel: title, scrollable body, right-aligned actions.",
        responsive: "Becomes a full-screen sheet or bottom sheet below sm; fixed max-width centered at sm+.",
        bestFor: "Focused confirmations and short forms.",
        preview: { body: "centered" },
      }),
      mk({
        id: "drawer-panel",
        name: "Drawer / side panel",
        kind: "component",
        description: "Edge-anchored sliding panel for detail or forms.",
        regions: ["header", "body", "footer"],
        structure: "Panel sliding from an edge over a scrim; sticky header/footer.",
        responsive: "Full-width sheet on mobile; fixed-width side panel at md+.",
        bestFor: "Contextual edit/detail without leaving the page.",
        preview: { chrome: ["aside"], body: "stack" },
      }),
      mk({
        id: "command-palette",
        name: "Command palette",
        kind: "component",
        description: "Keyboard-driven search-and-run overlay.",
        regions: ["search", "results", "footer-hints"],
        structure: "Top-centered floating panel: query input, grouped results, shortcut hints.",
        responsive: "Near full-width on mobile; fixed max-width centered near the top at sm+.",
        bestFor: "Power-user navigation and actions.",
        preview: { body: "centered" },
      }),
      mk({
        id: "toast-stack",
        name: "Toast stack",
        kind: "component",
        description: "Stacked transient notifications in a screen corner.",
        regions: ["toasts"],
        structure: "Fixed-position vertical stack of dismissible toasts.",
        responsive: "Anchors to a bottom-full-width stack on mobile; corner stack at sm+.",
        bestFor: "Async feedback and confirmations.",
        preview: { chrome: ["aside"], body: "stack" },
      }),
    ],
  },
  {
    id: "components-sections",
    label: "Components — Sections",
    layouts: [
      mk({
        id: "section-two-column",
        name: "Two-column section",
        kind: "component",
        description: "Generic balanced two-column content band.",
        regions: ["col-a", "col-b"],
        structure: "Two equal (or weighted) columns within a content container.",
        responsive: "Stacks to a single column below md; preserves source order.",
        bestFor: "Comparisons and paired content.",
        preview: { body: "split" },
      }),
      mk({
        id: "section-three-column",
        name: "Three-column section",
        kind: "component",
        description: "Triad of equal cards/columns (e.g. benefits).",
        regions: ["col-a", "col-b", "col-c"],
        structure: "Three equal columns within a content container.",
        responsive: "1 col mobile, 2 at sm, 3 at lg.",
        bestFor: "Benefit/feature triads.",
        preview: { body: "grid" },
      }),
      mk({
        id: "media-text",
        name: "Media + text",
        kind: "component",
        description: "Image beside a block of copy with optional CTA.",
        regions: ["media", "text"],
        structure: "Two columns: media one side, heading/body/CTA the other.",
        responsive: "Stacks media above text below md.",
        bestFor: "Explainer rows.",
        preview: { body: "split" },
      }),
      mk({
        id: "accordion-stack",
        name: "Accordion stack",
        kind: "component",
        description: "Vertically stacked expandable panels.",
        regions: ["items"],
        structure: "Single-column list of header/disclosure panels.",
        responsive: "Single column at all sizes; one or many panels open per config.",
        bestFor: "FAQs and progressive disclosure.",
        preview: { body: "list" },
      }),
      mk({
        id: "tabs-panel",
        name: "Tabs panel",
        kind: "component",
        description: "Tabbed container switching between equal-weight views.",
        regions: ["tabs", "panel"],
        structure: "Tab strip over a single content panel.",
        responsive: "Tab strip scrolls horizontally on mobile; panel is full width.",
        bestFor: "Grouping related views compactly.",
        preview: { body: "stack" },
      }),
    ],
  },
];

/** Flattened view of every layout in the catalog. */
export const ALL_LAYOUTS: LayoutItem[] = LAYOUT_CATALOG.flatMap((c) => c.layouts);

export function getLayout(id: string): LayoutItem | undefined {
  return ALL_LAYOUTS.find((l) => l.id === id);
}

/** Reasonable default selection covering the most common page + component layouts. */
export const DEFAULT_LAYOUT_SELECTION = [
  "landing",
  "dashboard",
  "app-shell-sidebar",
  "settings",
  "sign-in",
  "article",
  "top-navbar",
  "sidebar-nav",
  "card-grid",
  "data-table",
  "list-detail",
  "form-single-column",
  "modal-dialog",
  "footer",
];

/** YAML snapshot of the selected layouts, stored under x-design-md.layouts. */
export function layoutsYaml(ids: string[]): {
  items: Record<
    string,
    { name: string; kind: LayoutKind; regions: string[]; responsive: string }
  >;
} {
  const items: Record<
    string,
    { name: string; kind: LayoutKind; regions: string[]; responsive: string }
  > = {};
  for (const id of ids) {
    const l = getLayout(id);
    if (l) {
      items[id] = {
        name: l.name,
        kind: l.kind,
        regions: l.regions,
        responsive: l.responsive,
      };
    }
  }
  return { items };
}
