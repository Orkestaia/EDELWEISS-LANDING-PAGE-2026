export type ChocolateGroup = "Truffles" | "Bonbons" | "2026 Bonbons";

export type Chocolate = {
  slug: string;
  name: string;
  group: ChocolateGroup;
  description: string;
  ingredients: string;
  allergens: string[];
  image: string;
};

export const chocolates: Chocolate[] = [
  // Truffles
  {
    slug: "white-chocolate-kirsch",
    name: "White Chocolate with Kirsch Brandy",
    group: "Truffles",
    description:
      "Velvety white chocolate ganache lifted with a measured pour of Kirsch Brandy.",
    ingredients:
      "White Chocolate · Cream · Butter · Glucose · Kirsch · Sorbitol · Sea Salt",
    allergens: ["Dairy", "Soy", "Alcohol"],
    image: "/images/chocolates/truffle-trio.jpg",
  },
  {
    slug: "milk-chocolate",
    name: "Milk Chocolate",
    group: "Truffles",
    description:
      "A classic Swiss truffle — silky milk chocolate ganache rolled and dusted by hand.",
    ingredients:
      "Milk Chocolate · Cream · Butter · Glucose · Invert Sugar · Sorbitol · Sea Salt",
    allergens: ["Dairy", "Soy"],
    image: "/images/chocolates/bonbon-1.jpg",
  },
  {
    slug: "maracaibo-65",
    name: "Maracaibo 65% Grand Cru",
    group: "Truffles",
    description:
      "Deep, single-origin Venezuelan dark chocolate truffle — bittersweet and intense.",
    ingredients:
      "Dark Chocolate · Cream · Butter · Glucose · Invert Sugar · Sea Salt",
    allergens: ["Dairy", "Soy"],
    image: "/images/chocolates/bonbon-2.jpg",
  },

  // Bonbons (Seasonal Rotation)
  {
    slug: "pistachio",
    name: "Pistachio",
    group: "Bonbons",
    description:
      "Sicilian pistachio cream over a white chocolate base — buttery, green, gentle.",
    ingredients: "White chocolate · Pistachio paste",
    allergens: ["Dairy", "Soy", "Tree nuts"],
    image: "/images/chocolates/bonbon-3.jpg",
  },
  {
    slug: "baileys-irish-creme",
    name: "Bailey's Irish Creme",
    group: "Bonbons",
    description:
      "Smooth milk chocolate ganache infused with a generous splash of Bailey's liqueur.",
    ingredients: "Milk chocolate · Cream · Bailey's",
    allergens: ["Dairy", "Soy", "Alcohol"],
    image: "/images/chocolates/bonbon-4.jpg",
  },
  {
    slug: "passion-mango",
    name: "Passion & Mango",
    group: "Bonbons",
    description:
      "Tropical passion fruit and mango purée layered with milk chocolate. Bright and floral.",
    ingredients: "Milk chocolate · Passion fruit · Mango purée",
    allergens: ["Dairy", "Soy"],
    image: "/images/chocolates/bonbon-5.jpg",
  },
  {
    slug: "spiced-pear-hazelnut",
    name: "Spiced Pear & Hazelnut",
    group: "Bonbons",
    description:
      "Hazelnut praline meets poached pear and warming winter spices in milk chocolate.",
    ingredients: "Milk chocolate · Hazelnut praline · Pear · Spices",
    allergens: ["Dairy", "Soy", "Tree nuts"],
    image: "/images/chocolates/bonbon-6.jpg",
  },
  {
    slug: "maine-apple-caramel",
    name: "Maine Apple Caramel",
    group: "Bonbons",
    description:
      "Local Maine apple cider folded into a salted caramel and dipped in chocolate.",
    ingredients: "Caramel · Maine apple cider · Chocolate",
    allergens: ["Dairy", "Soy"],
    image: "/images/chocolates/bonbon-1.jpg",
  },
  {
    slug: "coconut-caramel",
    name: "Coconut Caramel · V",
    group: "Bonbons",
    description:
      "A vegan bonbon — dark chocolate shell around a coconut milk caramel.",
    ingredients: "Dark chocolate · Coconut milk · Caramel",
    allergens: ["Soy", "Coconut"],
    image: "/images/chocolates/bonbon-2.jpg",
  },

  // 2026 Bonbons
  {
    slug: "gluehwein",
    name: "Glühwein",
    group: "2026 Bonbons",
    description:
      "Mulled wine reduced and folded into milk chocolate — clove, citrus, warmth.",
    ingredients: "Mulled wine · Milk chocolate",
    allergens: ["Dairy", "Soy", "Alcohol"],
    image: "/images/chocolates/bonbon-3.jpg",
  },
  {
    slug: "dark-chocolate-mint",
    name: "Dark Chocolate & Mint",
    group: "2026 Bonbons",
    description:
      "A whisper of fresh mint cutting through deep dark chocolate ganache.",
    ingredients: "Dark chocolate · Mint",
    allergens: ["Soy", "Dairy"],
    image: "/images/chocolates/bonbon-4.jpg",
  },
  {
    slug: "orange-milk-chocolate",
    name: "Orange & Milk Chocolate",
    group: "2026 Bonbons",
    description:
      "Grand Marnier and bright orange zest folded into a silky milk chocolate centre.",
    ingredients: "Milk chocolate · Grand Marnier · Orange zest",
    allergens: ["Dairy", "Soy", "Alcohol"],
    image: "/images/chocolates/bonbon-5.jpg",
  },
  {
    slug: "gingerbread",
    name: "Gingerbread",
    group: "2026 Bonbons",
    description:
      "Holiday spice, Kirschwasser and milk chocolate — the season in a single bite.",
    ingredients: "Milk chocolate · Kirschwasser · Spices",
    allergens: ["Dairy", "Soy", "Alcohol"],
    image: "/images/chocolates/bonbon-6.jpg",
  },
];

export const chocolateGroups: ChocolateGroup[] = [
  "Truffles",
  "Bonbons",
  "2026 Bonbons",
];

export const chocolateGroupDescriptions: Record<ChocolateGroup, string> = {
  Truffles:
    "Three rolled-by-hand classics — the bedrock of our Swiss chocolate tradition.",
  Bonbons:
    "Our seasonal rotation of moulded bonbons. Flavors change with the year and the harvest.",
  "2026 Bonbons":
    "The new collection for 2026 — winter spice, holiday warmth and old-world techniques.",
};
