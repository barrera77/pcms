export const SeverityLevels = {
  LIGHT: "Light",
  MEDIUM: "Medium",
  HEAVY: "Heavy",
} as const;

export type SeverityLevel =
  (typeof SeverityLevels)[keyof typeof SeverityLevels];
