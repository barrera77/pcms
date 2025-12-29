export const SeverityLevels = {
  LIGHT: "Light",
  MEDIUM: "Medium",
  HEAVY: "Heavy",
  UNKNOWN: "Unknown",
} as const;

export type SeverityLevel =
  (typeof SeverityLevels)[keyof typeof SeverityLevels];
