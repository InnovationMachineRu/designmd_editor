"use client";

import { useEditor } from "@/lib/store";
import { Icon, BRAND_ICONS } from "@/components/icons";
import { AssetDrop } from "./AssetDrop";

export function Iconography() {
  const icons = useEditor(
    (s) => s.brandbook.icons ?? { strokeWidth: 1.8, size: 24, corner: "round" as const, custom: [] }
  );
  const setIconStyle = useEditor((s) => s.setIconStyle);
  const addAsset = useEditor((s) => s.addAsset);
  const removeAsset = useEditor((s) => s.removeAsset);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs text-app-muted">
            Stroke · {icons.strokeWidth.toFixed(1)}
          </span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={icons.strokeWidth}
            onChange={(e) => setIconStyle({ strokeWidth: Number(e.target.value) })}
            className="w-full accent-app-accent"
          />
        </label>
        <label className="block">
          <span className="text-xs text-app-muted">Size · {icons.size}px</span>
          <input
            type="range"
            min={16}
            max={40}
            value={icons.size}
            onChange={(e) => setIconStyle({ size: Number(e.target.value) })}
            className="w-full accent-app-accent"
          />
        </label>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-app-muted">Corners</span>
        {(["round", "sharp"] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setIconStyle({ corner: c })}
            className={`px-2.5 py-1 rounded-md text-xs border transition-colors ${
              icons.corner === c
                ? "bg-app-accent text-white border-app-accent"
                : "border-app-border text-app-muted hover:text-app-text"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Live gallery of built-in glyphs */}
      <div>
        <div className="text-xs text-app-muted mb-2">Icon set · live style</div>
        <div className="grid grid-cols-8 gap-2">
          {BRAND_ICONS.map((g) => (
            <div
              key={g.name}
              className="aspect-square rounded-lg border border-app-border flex items-center justify-center text-app-text"
              title={g.name}
            >
              <Icon
                path={g.path}
                size={icons.size}
                strokeWidth={icons.strokeWidth}
                corner={icons.corner}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Custom SVG icons */}
      <div>
        <div className="text-xs text-app-muted mb-2">Custom icons (SVG)</div>
        <AssetDrop
          items={icons.custom}
          onAdd={(label, dataUrl) => addAsset("icon", label, dataUrl)}
          onRemove={(id) => removeAsset("icon", id)}
          accept="image/svg+xml,image/png"
          addLabel="SVG"
          cols={8}
        />
      </div>
    </div>
  );
}
