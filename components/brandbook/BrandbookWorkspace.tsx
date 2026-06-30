"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { FontLoader } from "@/components/FontLoader";
import { Stepper } from "@/components/wizard/Stepper";
import { ChromeThemeSwitcher } from "@/components/ui/ChromeThemeSwitcher";
import { PreviewPane } from "@/components/preview/PreviewPane";
import { ColorWheel } from "./ColorWheel";
import { SchemePanel } from "./SchemePanel";
import { FontManager } from "./FontManager";
import { LogoUploader } from "./LogoUploader";
import { Iconography } from "./Iconography";
import { Gradients } from "./Gradients";
import { ShapeElevation } from "./ShapeElevation";
import { Imagery } from "./Imagery";
import { Motion } from "./Motion";
import { Voice } from "./Voice";
import { SpacingGrid } from "./SpacingGrid";
import { AccessibilityMatrix } from "./AccessibilityMatrix";

interface SectionDef {
  id: string;
  title: string;
  hint?: string;
  body: ReactNode;
}

const SECTIONS: SectionDef[] = [
  {
    id: "color",
    title: "Color scheme",
    hint: "Rotate the wheel and pick a harmony — colors apply to the design tokens live.",
    body: (
      <>
        <ColorWheel />
        <SchemePanel />
      </>
    ),
  },
  {
    id: "typography",
    title: "Typography",
    hint: "Choose Google Fonts for headings and body — they load and apply instantly.",
    body: <FontManager />,
  },
  {
    id: "icons",
    title: "Iconography",
    hint: "Set the icon style (it drives the preview icons) and upload custom SVG icons.",
    body: <Iconography />,
  },
  {
    id: "gradients",
    title: "Gradients",
    hint: "Brand gradients auto-derived from your color scheme. Click to copy CSS.",
    body: <Gradients />,
  },
  {
    id: "shape",
    title: "Shape & elevation",
    hint: "Roundness drives the rounded tokens live; pick an elevation depth.",
    body: <ShapeElevation />,
  },
  {
    id: "spacing",
    title: "Spacing & grid",
    hint: "Density drives the spacing tokens live.",
    body: <SpacingGrid />,
  },
  {
    id: "imagery",
    title: "Imagery & moodboard",
    hint: "Upload reference images and preview them with the brand treatment.",
    body: <Imagery />,
  },
  {
    id: "motion",
    title: "Motion",
    hint: "Define the motion language — duration and easing.",
    body: <Motion />,
  },
  {
    id: "voice",
    title: "Brand voice",
    hint: "Tagline, tone of voice, and do / don't copy.",
    body: <Voice />,
  },
  {
    id: "logos",
    title: "Logos",
    hint: "Reusable brand logos for different contexts. Stored with your DESIGN.md.",
    body: <LogoUploader />,
  },
  {
    id: "a11y",
    title: "Accessibility",
    hint: "Contrast matrix and colorblind simulation of the palette.",
    body: <AccessibilityMatrix />,
  },
];

export function BrandbookWorkspace() {
  return (
    <div className="h-screen flex flex-col">
      <FontLoader />
      {/* Top bar */}
      <header className="flex items-center gap-4 px-5 h-16 border-b border-app-border shrink-0">
        <div className="font-display font-semibold text-[15px] tracking-tight text-app-text shrink-0">
          DESIGN<span className="text-app-accent">.md</span>
          <span className="text-app-muted font-sans font-normal text-xs ml-2 align-middle">
            Brandbook
          </span>
        </div>
        <div className="flex-1 flex justify-center">
          <Stepper current={1} />
        </div>
        <ChromeThemeSwitcher />
        <Link href="/" className="text-sm text-app-accent hover:underline font-medium">
          Next: Design system →
        </Link>
      </header>

      {/* Body: nav | controls | live preview */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2">
        <div className="min-h-0 flex border-r border-app-border">
          {/* Sticky in-page section nav */}
          <nav className="w-36 shrink-0 border-r border-app-border p-3 overflow-auto scroll-thin hidden md:block">
            <ul className="space-y-0.5 sticky top-0">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#bb-${s.id}`}
                    className="block px-2 py-1.5 rounded-md text-xs text-app-muted hover:text-app-text hover:bg-app-panel-2 transition-colors"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Panels */}
          <div className="min-h-0 flex-1 overflow-auto scroll-thin p-5 space-y-10">
            {SECTIONS.map((s) => (
              <section key={s.id} id={`bb-${s.id}`} className="space-y-3 scroll-mt-4">
                <div>
                  <h2 className="text-sm font-semibold text-app-text">{s.title}</h2>
                  {s.hint && <p className="text-xs text-app-muted mt-0.5">{s.hint}</p>}
                </div>
                {s.body}
              </section>
            ))}
          </div>
        </div>

        <div className="min-h-0 p-4">
          <PreviewPane enableFonts />
        </div>
      </div>
    </div>
  );
}
