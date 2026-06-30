import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DESIGN.md Editor",
  description:
    "Interactive editor for design.md design systems with live preview, themes, style presets, and UIKit spec generation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preview fonts used by the built-in presets (Inter, Roboto, Poppins). */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Poppins:wght@400;500;600;700&family=Merriweather:wght@400;700&family=Playfair+Display:wght@400;600;700&family=Noto+Serif:wght@400;600;700&family=Noto+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
