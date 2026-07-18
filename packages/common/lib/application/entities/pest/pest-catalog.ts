import { PestCategories } from "lib/pcms-core";

export const PestCatalog = {
  GERMAN_COCKORACH: {
    name: "German cockroach",
    category: PestCategories.INSECTS,
    description:
      "German cockroach (Blattella germanica) is a small indoor pest identified by two dark stripes behind its head. Commonly found in kitchens and warm areas with access to food and moisture.",
  },

  HOUSE_MOUSE: {
    name: "House Mouse",
    category: PestCategories.RODENTS,
    description:
      "House mouse (Mus musculus) is a small rodent commonly found inside buildings seeking food and shelter.",
  },

  BED_BUG: {
    name: "Bed Bug",
    category: PestCategories.INSECTS,
    description:
      "Bed bug (Cimex lectularius) is a small parasitic insect that hides in cracks, furniture, and sleeping areas. It feeds on blood and can spread through infested belongings.",
  },

  TICK: {
    name: "Tick",
    category: PestCategories.INSECTS,
    description:
      "Tick is a small parasitic arachnid that attaches to animals and humans to feed on blood. Commonly found in wooded areas, grass, and locations with wildlife activity.",
  },

  PHARAOH_ANT: {
    name: "Pharaoh Ant",
    category: PestCategories.INSECTS,
    description:
      "Pharaoh ant (Monomorium pharaonis) is a small indoor ant species commonly found in buildings. It can establish colonies in warm areas and is difficult to eliminate without proper treatment.",
  },

  FRUIT_FLY: {
    name: "Fruit Fly",
    category: PestCategories.INSECTS,
    description:
      "Fruit fly (Drosophila melanogaster) is a small fly commonly found around ripening fruit, organic waste, and food preparation areas.",
  },

  YELLOW_JACKET: {
    name: "Yellow Jacket",
    category: PestCategories.INSECTS,
    description:
      "Yellow jacket (Vespula spp.) is an aggressive stinging wasp commonly found around buildings, gardens, and outdoor areas. It builds nests in the ground, wall voids, and other sheltered locations and can become a safety concern when disturbed.",
  },

  BEE: {
    name: "Bee",
    category: PestCategories.INSECTS,
    description:
      "Bee (Anthophila) is a pollinating insect that can establish colonies in and around buildings. Some species may become a concern when nests are located near human activity.",
  },
} as const;
