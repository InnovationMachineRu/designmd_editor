"use client";

import type { DesignDoc } from "@/lib/designmd/types";
import { useEditor } from "@/lib/store";
import { resolveTypography } from "@/lib/designmd/tokens";
import { type Decor } from "./decor";
import { makeMark } from "./inspect";
import { Reveal } from "./Reveal";
import { motionOf } from "./sections/common";
import { SnapshotSection } from "./sections/Snapshot";
import { ColorPaletteSection } from "./sections/ColorPalette";
import { TypographySection } from "./sections/Typography";
import { ButtonsSection } from "./sections/Buttons";
import { CardsSection } from "./sections/Cards";
import { CalloutSection } from "./sections/Callout";
import { TileGridSection } from "./sections/TileGrid";
import { PricingSection } from "./sections/Pricing";
import { FormsSection } from "./sections/Forms";
import { VisualHierarchySection } from "./sections/VisualHierarchy";
import { ColumnGridSection } from "./sections/ColumnGrid";
import { IconsSection } from "./sections/Icons";
import { LabelsSection } from "./sections/Labels";
import { DividersSection } from "./sections/Dividers";
import { AlertsSection } from "./sections/Alerts";
import { BadgesSection } from "./sections/Badges";
import { SpacingScaleSection } from "./sections/SpacingScale";
import { RadiiSection } from "./sections/Radii";
import { ElevationSection } from "./sections/Elevation";
import { MediaQueriesSection } from "./sections/MediaQueries";
import { TouchTargetsSection } from "./sections/TouchTargets";
import { AccessibilitySection } from "./sections/Accessibility";

/**
 * The live preview rendered as a design-system documentation page. Sections are
 * token-driven (recolor with theme/preset/direction). Elements behave like real
 * components; holding Option/Alt turns clicks into token inspection (see inspect.ts).
 */
export function Gallery({ doc, decor }: { doc: DesignDoc; decor: Decor }) {
  const highlight = useEditor((s) => s.highlight);
  const setHighlight = useEditor((s) => s.setHighlight);
  const mark = makeMark(highlight, setHighlight);

  const props = { doc, decor, mark };
  const motion = motionOf(doc);

  // Ordered documentation sections — each revealed on scroll in brand motion.
  const SECTIONS = [
    SnapshotSection,
    ColorPaletteSection,
    TypographySection,
    ButtonsSection,
    CardsSection,
    CalloutSection,
    TileGridSection,
    PricingSection,
    FormsSection,
    VisualHierarchySection,
    ColumnGridSection,
    IconsSection,
    LabelsSection,
    DividersSection,
    AlertsSection,
    BadgesSection,
    SpacingScaleSection,
    RadiiSection,
    ElevationSection,
    MediaQueriesSection,
    TouchTargetsSection,
    AccessibilitySection,
  ];

  return (
    <div>
      {/* Cover */}
      <header className="mb-2">
        {(() => {
          const logo = doc.brandbook?.logos.find((l) => l.label === "Primary");
          return logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo.dataUrl} alt="" className="h-10 mb-3 object-contain" />
          ) : null;
        })()}
        <div style={resolveTypography(doc, "{typography.display-lg}")}>{doc.name}</div>
        {doc.description && (
          <p
            className="mt-2 opacity-70 max-w-xl"
            style={resolveTypography(doc, "{typography.body-lg}")}
          >
            {doc.description}
          </p>
        )}
      </header>

      {SECTIONS.map((Section, i) => (
        <Reveal key={Section.name || i} ms={motion.ms} easing={motion.easing}>
          <Section {...props} />
        </Reveal>
      ))}
    </div>
  );
}
