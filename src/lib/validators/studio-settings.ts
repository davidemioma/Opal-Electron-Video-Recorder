import { z } from "zod";

export const StudioSettingsScheme = z.object({
  screen: z.string(),
  audio: z.string(),
  preset: z.enum(["HD", "SD"]),
});

export type StudioSettingsValidator = z.infer<typeof StudioSettingsScheme>;
