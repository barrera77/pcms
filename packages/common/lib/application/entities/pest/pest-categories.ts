export const PestCategories = {
  RODENTS: "RODENTS",
  INSECTS: "INSECTS",
  BIRDS: "BIRDS",
  WEEDS: "WEEDS",
  FUNGI: "FUNGI",
  WILDLIFE: "WILDLIFE",
} as const;

export type PestCategory = (typeof PestCategories)[keyof typeof PestCategories];
