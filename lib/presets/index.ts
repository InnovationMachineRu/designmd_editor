import type { PresetId, StylePreset } from "../designmd/types";
import { glassPreset } from "./glass";
import { materialPreset } from "./material";
import { minimalPreset } from "./minimal";
import { neoPreset } from "./neo";
import { vintagePreset } from "./vintage";
import { asianPreset } from "./asian";

export const PRESETS: Record<PresetId, StylePreset> = {
  material: materialPreset,
  glass: glassPreset,
  minimal: minimalPreset,
  neo: neoPreset,
  vintage: vintagePreset,
  asian: asianPreset,
};

/** Built-in presets in display order. */
export const PRESET_LIST: StylePreset[] = [
  materialPreset,
  glassPreset,
  minimalPreset,
  neoPreset,
  vintagePreset,
  asianPreset,
];

export function getPreset(id: PresetId): StylePreset {
  return PRESETS[id];
}
