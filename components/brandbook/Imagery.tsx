"use client";

import { useEditor } from "@/lib/store";
import { AssetDrop } from "./AssetDrop";

export function Imagery() {
  const imagery = useEditor(
    (s) => s.brandbook.imagery ?? { radius: 12, overlay: 0, duotone: false, images: [] }
  );
  const brandColor = useEditor((s) => s.brandbook.schemeColors[0] ?? "#6750A4");
  const addAsset = useEditor((s) => s.addAsset);
  const removeAsset = useEditor((s) => s.removeAsset);
  const setImagery = useEditor((s) => s.setImagery);

  return (
    <div className="space-y-4">
      {/* Treatment controls */}
      <div className="grid grid-cols-2 gap-4 items-center">
        <label className="block">
          <span className="text-xs text-app-muted">Corner radius · {imagery.radius}px</span>
          <input
            type="range"
            min={0}
            max={32}
            value={imagery.radius}
            onChange={(e) => setImagery({ radius: Number(e.target.value) })}
            className="w-full accent-app-accent"
          />
        </label>
        <label className="block">
          <span className="text-xs text-app-muted">Brand overlay · {imagery.overlay}%</span>
          <input
            type="range"
            min={0}
            max={80}
            value={imagery.overlay}
            onChange={(e) => setImagery({ overlay: Number(e.target.value) })}
            className="w-full accent-app-accent"
          />
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm text-app-text">
        <input
          type="checkbox"
          checked={imagery.duotone}
          onChange={(e) => setImagery({ duotone: e.target.checked })}
          className="accent-app-accent"
        />
        Duotone (grayscale + brand tint)
      </label>

      {/* Upload + manage */}
      <AssetDrop
        items={imagery.images}
        onAdd={(label, dataUrl) => addAsset("image", label, dataUrl)}
        onRemove={(id) => removeAsset("image", id)}
        accept="image/png,image/jpeg,image/webp"
        addLabel="Image"
        checker={false}
        cols={3}
        imgStyle={{ borderRadius: imagery.radius, padding: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Treated preview */}
      {imagery.images.length > 0 && (
        <div>
          <div className="text-xs text-app-muted mb-2">Treatment preview</div>
          <div className="grid grid-cols-3 gap-2">
            {imagery.images.map((img) => (
              <div
                key={img.id}
                className="relative aspect-square overflow-hidden"
                style={{ borderRadius: imagery.radius }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.dataUrl}
                  alt={img.label}
                  className="w-full h-full object-cover"
                  style={{ filter: imagery.duotone ? "grayscale(1) contrast(1.05)" : "none" }}
                />
                <span
                  className="absolute inset-0"
                  style={{
                    background: brandColor,
                    opacity: (imagery.duotone ? Math.max(imagery.overlay, 35) : imagery.overlay) / 100,
                    mixBlendMode: imagery.duotone ? "multiply" : "normal",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
