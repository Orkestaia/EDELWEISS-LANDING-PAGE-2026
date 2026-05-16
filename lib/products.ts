export type Product = {
  slug: string;
  name: string;
  category: "Viennoiserie" | "Bread" | "Pastry" | "Cookie";
  description: string;
  image: string;
};

export const products: Product[] = [
  {
    slug: "butter-croissant",
    name: "Butter Croissant",
    category: "Viennoiserie",
    description:
      "72 hours of cold fermentation and layer upon layer of French butter. A honest, golden Swiss morning ritual.",
    image: "/images/products/butter-croissant.jpg",
  },
  {
    slug: "almond-croissant",
    name: "Almond Croissant",
    category: "Viennoiserie",
    description:
      "Twice-baked with Madagascar almond cream, toasted slivers and a soft kiss of powdered sugar.",
    image: "/images/products/almond-croissant.jpg",
  },
  {
    slug: "chocolate-croissant",
    name: "Chocolate Croissant",
    category: "Viennoiserie",
    description:
      "Two batons of single-origin dark chocolate tucked inside our flagship laminated dough.",
    image: "/images/products/chocolate-croissant.jpg",
  },
  {
    slug: "brioche",
    name: "Brioche à tête",
    category: "Viennoiserie",
    description:
      "Rich, buttery, pillow-soft. Baked in fluted molds the way our grandmothers taught us.",
    image: "/images/products/brioche.jpg",
  },
  {
    slug: "berliner",
    name: "Berliner",
    category: "Pastry",
    description:
      "An old-world brioche doughnut filled with seasonal jam and dusted with vanilla-scented sugar.",
    image: "/images/products/berliner.jpg",
  },
  {
    slug: "chocolate-tart",
    name: "Chocolate · Cocoa Nib Tart",
    category: "Pastry",
    description:
      "Crisp pâte sucrée, dark chocolate cremeux, apricot pearls and a rain of roasted cocoa nibs.",
    image: "/images/products/chocolate-tart.jpg",
  },
  {
    slug: "carrot-cake",
    name: "Carrot Cake",
    category: "Pastry",
    description:
      "Spiced sponge with walnut crunch, finished with whipped cream cheese frosting and citrus peel.",
    image: "/images/products/carrot-cake.jpg",
  },
  {
    slug: "creme-puff",
    name: "Crème Puff",
    category: "Pastry",
    description:
      "Choux pastry, Tahitian vanilla diplomat cream and a crackling craquelin lid.",
    image: "/images/products/creme-puff.jpg",
  },
  {
    slug: "black-forest",
    name: "Black Forest",
    category: "Pastry",
    description:
      "Kirsch-soaked chocolate sponge, Morello cherries and mountains of fresh Chantilly.",
    image: "/images/products/black-forest.jpg",
  },
  {
    slug: "chocolate-chip-cookie",
    name: "Chocolate Chip Cookie",
    category: "Cookie",
    description:
      "Brown-butter dough, dark chocolate chunks and flaky sea salt. Best slightly warm.",
    image: "/images/products/chocolate-chip-cookie.jpg",
  },
  {
    slug: "basler-laeckerli",
    name: "Basler Läckerli",
    category: "Cookie",
    description:
      "A 700-year-old Basel recipe — honey, almonds, candied citrus and warming Swiss spices.",
    image: "/images/products/basler-laeckerli.jpg",
  },
  {
    slug: "zopf",
    name: "Zopf",
    category: "Bread",
    description:
      "The braided Sunday loaf of the Swiss table — enriched with milk and butter, brushed with egg yolk.",
    image: "/images/products/zopf.jpg",
  },
];

export const productCategories = [
  "All",
  "Viennoiserie",
  "Pastry",
  "Cookie",
  "Bread",
] as const;
