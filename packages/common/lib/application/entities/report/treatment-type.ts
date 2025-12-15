export const TreatmentTypes = {
  INSPECTION: "INSPECTION",
  CHEMICAL: "CHEMICAL",
  BAITING: "BAITING",
} as const;

export type TreatmentType =
  (typeof TreatmentTypes)[keyof typeof TreatmentTypes];
