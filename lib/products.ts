export type ProductCategory =
  | "Breakfast"
  | "Breads"
  | "Pastries"
  | "Cookies"
  | "Granola";

export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  image: string;
  price?: string;
  tag?: string;
};

export const products: Product[] = [
  // --- Breakfast ---
  {
    slug: "plain-croissant",
    name: "Plain Croissant",
    category: "Breakfast",
    description:
      "72 hours of cold fermentation and layer upon layer of French butter. Honest, golden, Swiss.",
    image: "/images/products/butter-croissant.jpg",
    price: "$4.00",
  },
  {
    slug: "pain-au-chocolat",
    name: "Pain au Chocolat",
    category: "Breakfast",
    description:
      "Our flagship laminated dough wrapped around two batons of single-origin dark chocolate.",
    image: "/images/products/chocolate-croissant.jpg",
    price: "$4.50",
  },
  {
    slug: "almond-croissant",
    name: "Almond Croissant",
    category: "Breakfast",
    description:
      "Twice-baked with almond cream, toasted slivers and a soft kiss of powdered sugar.",
    image: "/images/products/almond-croissant.jpg",
    price: "$6.00",
  },
  {
    slug: "ham-cheese-croissant",
    name: "Ham & Cheese Croissant",
    category: "Breakfast",
    description:
      "Italian Bresaola and aged Appenzeller cheese tucked into a flaky butter croissant.",
    image: "/images/products/ham-cheese-croissant.jpg",
    price: "$6.50",
  },
  {
    slug: "vanilla-creme-croissant",
    name: "Vanilla Crème Croissant",
    category: "Breakfast",
    description:
      "Our flaky croissant generously filled with Tahitian vanilla pastry crème. Weekend special.",
    image: "/images/products/vanilla-creme-croissant.jpg",
    price: "$4.50",
    tag: "Weekend",
  },
  {
    slug: "brioche-hazelnut",
    name: "Orange Brioche · Hazelnut Crème",
    category: "Breakfast",
    description:
      "Buttery orange-scented brioche filled with house-made hazelnut pastry crème.",
    image: "/images/products/brioche.jpg",
    price: "$5.00",
    tag: "Weekend",
  },
  {
    slug: "berliner",
    name: "Berliner",
    category: "Breakfast",
    description:
      "Old-world fried yeast doughnut filled with raspberry jam and vanilla-scented sugar.",
    image: "/images/products/berliner.jpg",
    price: "$4.00",
  },
  {
    slug: "blueberry-scone",
    name: "Blueberry & Lemon Scone",
    category: "Breakfast",
    description:
      "Buttery scone studded with Maine blueberries and brightened with candied lemon.",
    image: "/images/products/blueberry-scone.jpg",
    price: "$4.00",
  },
  {
    slug: "nuss-schnecken",
    name: "Nuss Schnecken",
    category: "Breakfast",
    description:
      "Moist and tender nut spiral pastry drizzled with a delicate vanilla glaze.",
    image: "/images/products/nuss-schnecken.jpg",
    price: "$5.50",
  },
  {
    slug: "chocolate-weggli",
    name: "Chocolate Weggli",
    category: "Breakfast",
    description:
      "A classic from Basel — a soft white roll generously studded with chocolate pieces.",
    image: "/images/products/chocolate-weggli.jpg",
    price: "$3.00",
  },
  {
    slug: "seasonal-quiche",
    name: "Seasonal Quiche",
    category: "Breakfast",
    description:
      "Buttery shortcrust filled with seasonal vegetables and aged Appenzeller cheese.",
    image: "/images/products/quiche.jpg",
    price: "$6.00",
  },
  {
    slug: "fruit-danish",
    name: "Fruit Danish",
    category: "Breakfast",
    description:
      "Pillowy danish dough cradling seasonal fruit, vanilla custard and a thin glaze.",
    image: "/images/products/fruit-danish.jpg",
    price: "$6.00",
    tag: "Weekend",
  },

  // --- Breads ---
  {
    slug: "zopf",
    name: "Zopf",
    category: "Breads",
    description:
      "The Sunday loaf of the Swiss table — enriched with milk and butter, brushed with egg yolk, braided by hand.",
    image: "/images/products/zopf-new.jpg",
    price: "$7.00",
  },
  {
    slug: "braided-zopf",
    name: "Braided Zopf",
    category: "Breads",
    description:
      "The Sunday loaf of the Swiss table — enriched with milk and butter, brushed with egg yolk.",
    image: "/images/products/zopf.jpg",
    price: "$7.00",
  },
  {
    slug: "maine-grains-wheat",
    name: "Maine Grains Whole Wheat",
    category: "Breads",
    description:
      "Naturally leavened whole wheat with a toasted sesame crust. Dense, fragrant, alive.",
    image: "/images/products/rye-sesame.jpg",
    price: "$6.50",
  },
  {
    slug: "daily-focaccia",
    name: "Daily Focaccia",
    category: "Breads",
    description:
      "Olive-oil rich focaccia, dimpled, finished with rosemary and flaky sea salt.",
    image: "/images/products/focaccia.jpg",
    price: "$5.00",
  },

  // --- Pastries ---
  {
    slug: "seasonal-financier",
    name: "Seasonal Financier",
    category: "Pastries",
    description:
      "Almond and brown-butter cake crowned with the fruit of the season.",
    image: "/images/products/financier.jpg",
    price: "$9.00",
    tag: "GF",
  },
  {
    slug: "streusel-kuchen",
    name: "Chocolate & Raspberry Streusel Kuchen",
    category: "Pastries",
    description:
      "Pound cake topped with salty, sweet and crunchy pieces of vanilla streusel.",
    image: "/images/products/streusel-kuchen.jpg",
    price: "$7.00",
  },
  {
    slug: "baileys-bread-pudding",
    name: "Baileys Bread & Butter Pudding",
    category: "Pastries",
    description:
      "Thick slices of buttery brioche-style bread baked slowly in a Baileys custard.",
    image: "/images/products/baileys-bread-pudding.jpg",
    price: "$7.50",
  },
  {
    slug: "chocolate-tart",
    name: "Seasonal Chocolate Tart",
    category: "Pastries",
    description:
      "Dark chocolate seasonal ganache with fluid gel and cocoa nibs.",
    image: "/images/products/chocolate-tart.jpg",
    price: "$7.50",
  },
  {
    slug: "creme-puff",
    name: "Crème Puff",
    category: "Pastries",
    description:
      "Choux pastry, Tahitian vanilla diplomat cream and a crackling craquelin lid.",
    image: "/images/products/creme-puff.jpg",
    price: "$4.00",
  },
  {
    slug: "black-forest",
    name: "Black Forest",
    category: "Pastries",
    description:
      "Three layers of distinctive Black Forest flavor — kirsch pannacotta, cherry coulis, chocolate cremeux. Gluten-free.",
    image: "/images/products/black-forest.jpg",
    price: "$8.00",
    tag: "GF",
  },
  {
    slug: "lemon-square",
    name: "Lemon Square",
    category: "Pastries",
    description:
      "Buttery shortbread base and a vibrant lemon curd, finished with a dusting of sugar.",
    image: "/images/products/lemon-square.jpg",
    price: "$7.00",
  },
  {
    slug: "vanilla-kuchen",
    name: "Seasonal Vanilla Kuchen",
    category: "Pastries",
    description:
      "Fresh fruit baked into vanilla custard, cradled by a sweet dough tart shell.",
    image: "/images/products/vanilla-kuchen.jpg",
    price: "$6.00",
  },
  // (Carrot Cake removed — seasonal item, not sold online per reunión 2026-05-20)

  // --- Cookies ---
  {
    slug: "chocolate-chip",
    name: "Chocolate Chip Cookie",
    category: "Cookies",
    description:
      "Brown-butter dough and dark chocolate chunks. Best slightly warm.",
    image: "/images/products/chocolate-chip-cookie.jpg",
    price: "$3.00",
  },
  {
    slug: "spitzbub",
    name: "Spitzbub",
    category: "Cookies",
    description:
      "A sandwich shortbread cookie filled with bright raspberry jam.",
    image: "/images/products/spitzbub.jpg",
    price: "$3.00",
  },
  {
    slug: "chocolate-sable",
    name: "Chocolate Sablé",
    category: "Cookies",
    description:
      "Crunchy chocolate sablé with chocolate chunks. Three pieces per bag.",
    image: "/images/products/chocolate-sable.jpg",
    price: "$6.00",
  },
  {
    slug: "basler-laeckerli",
    name: "Basler Läckerli",
    category: "Cookies",
    description:
      "A 700-year-old Basel recipe — honey, almonds, candied orange, spices and Kirschwasser. Six pieces.",
    image: "/images/products/basler-laeckerli.jpg",
    price: "$7.00",
  },

  // --- Granola ---
  {
    slug: "house-granola",
    name: "House Granola",
    category: "Granola",
    description:
      "Slow-toasted oats, maple syrup, pecans, almonds, sunflower seeds and pumpkin seeds. Crunchy clusters, jar-ready.",
    image: "/images/products/granola.jpg",
  },
];

export const categories: ProductCategory[] = [
  "Breakfast",
  "Breads",
  "Pastries",
  "Cookies",
  "Granola",
];

export const categoryDescriptions: Record<ProductCategory, string> = {
  Breakfast:
    "Croissants laminated over three days, weekend brioches and the soft Swiss rolls of our childhood.",
  Breads:
    "Naturally leavened, slow-fermented loaves baked in stone-deck ovens before dawn.",
  Pastries:
    "Desserts inspired by the Swiss countryside, plated for the Maine table.",
  Cookies:
    "Buttery, spiced, jam-filled — the snacking tradition of every Swiss kitchen.",
  Granola:
    "Toasted oats, nuts and dried fruit — perfect with yogurt, milk or by the handful.",
};
