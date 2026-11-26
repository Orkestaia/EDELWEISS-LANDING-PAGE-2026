export type ProductCategory =
  | "Breakfast"
  | "Breads"
  | "Pastries"
  | "Cookies"
  | "Granola"
  // Dated pre-order blocks (lib/thanksgiving.ts, lib/christmas.ts); not part of `categories`.
  | "Thanksgiving"
  | "Christmas";

export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  image: string;
  price?: string;
  tag?: string;
  /** Clover item ID in the REAL Edelweiss merchant (production).
   *  Optional because a product can be listed without inventory tracking. */
  cloverItemId?: string;
  /** Optional Clover item ID in the Test Merchant sandbox.
   *  Only set on items we've replicated in the sandbox for testing. */
  cloverItemIdSandbox?: string;
  /** "cover" for styled, full-frame photos (dark backgrounds); default "contain" for cut-outs on cream. */
  imageFit?: "cover" | "contain";
};

/** Returns the right Clover item ID for the active environment.
 *  In sandbox, products without a sandbox replica return undefined → treated as unlimited. */
export function effectiveCloverItemId(product: Product): string | undefined {
  if (process.env.NEXT_PUBLIC_ENV === "sandbox") {
    return product.cloverItemIdSandbox;
  }
  return product.cloverItemId;
}

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
    cloverItemId: "8NX71FCSKNWA0",
  },
  {
    slug: "pain-au-chocolat",
    name: "Pain au Chocolat",
    category: "Breakfast",
    description:
      "Our flagship laminated dough wrapped around two batons of single-origin dark chocolate.",
    image: "/images/products/chocolate-croissant.jpg",
    price: "$4.50",
    cloverItemId: "SDWE3YVGBMQJG",
    cloverItemIdSandbox: "RHXB6T7QPF6N6",
  },
  {
    slug: "almond-croissant",
    name: "Almond Croissant",
    category: "Breakfast",
    description:
      "Twice-baked with almond cream, toasted slivers and a soft kiss of powdered sugar.",
    image: "/images/products/almond-croissant.jpg",
    price: "$6.00",
    cloverItemId: "BEA6FRX0PV4EM",
  },
  {
    slug: "ham-cheese-croissant",
    name: "Ham & Cheese Croissant",
    category: "Breakfast",
    description:
      "Italian Bresaola and aged Appenzeller cheese tucked into a flaky butter croissant.",
    image: "/images/products/ham-cheese-croissant.jpg",
    price: "$6.50",
    cloverItemId: "0WHMSSG9HM984",
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
    cloverItemId: "DWZGKSRKFSYZY",
  },
  {
    slug: "brioche-hazelnut",
    // Renamed in Clover 2026-10 (same item id).
    name: "Brioche with Chocolate, Orange and Hazelnut",
    category: "Breakfast",
    description:
      "Buttery orange-scented brioche with milk chocolate, hazelnut and candied orange pieces.",
    image: "/images/products/brioche.jpg",
    price: "$6.00",
    tag: "Weekend",
    cloverItemId: "X088WXZSZ4A7M",
  },
  {
    slug: "berliner",
    name: "Berliner",
    category: "Breakfast",
    description:
      "Old-world fried yeast doughnut filled with raspberry jam and vanilla-scented sugar.",
    image: "/images/products/berliner.jpg",
    price: "$4.00",
    cloverItemId: "DB0KKYYDSFKYP",
    cloverItemIdSandbox: "3T8YHQ79HP91R",
  },
  {
    slug: "blueberry-scone",
    name: "Blueberry & Lemon Scone",
    category: "Breakfast",
    description:
      "Buttery scone studded with Maine blueberries and brightened with candied lemon.",
    image: "/images/products/blueberry-scone.jpg",
    price: "$4.00",
    cloverItemId: "3077398B7HQF4",
  },
  {
    slug: "nuss-schnecken",
    name: "Nuss Schnecken",
    category: "Breakfast",
    description:
      "Moist and tender nut spiral pastry drizzled with a delicate vanilla glaze.",
    image: "/images/products/nuss-schnecken.jpg",
    price: "$5.50",
    cloverItemId: "BN3VYDHA5DGWJ",
    cloverItemIdSandbox: "YQRBB7N2T84NM",
  },
  {
    slug: "chocolate-weggli",
    name: "Chocolate Weggli",
    category: "Breakfast",
    description:
      "A classic from Basel — a soft white roll generously studded with chocolate pieces.",
    image: "/images/products/chocolate-weggli.jpg",
    price: "$3.00",
    cloverItemId: "KHQDRQRECKWHW",
  },
  {
    slug: "seasonal-quiche",
    name: "Seasonal Quiche",
    category: "Breakfast",
    description:
      "Buttery shortcrust filled with seasonal vegetables and aged Appenzeller cheese.",
    image: "/images/products/quiche.jpg",
    price: "$6.00",
    cloverItemId: "G96MDNXVCW1H6",
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
    cloverItemId: "YBZCXXGBF39RJ",
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
    cloverItemId: "N5TFWTQZHNWSA",
  },
  {
    slug: "maine-grains-wheat",
    name: "Maine Grains Whole Wheat",
    category: "Breads",
    description:
      "Naturally leavened whole wheat sourdough. Dense, fragrant, alive.",
    image: "/images/products/rye-sesame.jpg",
    price: "$6.50",
    cloverItemId: "ZC8TCHQEZBJC8",
  },
  {
    slug: "daily-focaccia",
    name: "Daily Focaccia",
    category: "Breads",
    description:
      "Olive-oil rich focaccia, dimpled, finished with rosemary and flaky sea salt.",
    image: "/images/thanksgiving/rosemary-focaccia.webp",
    price: "$5.00",
    cloverItemId: "WNGNQAP6MMC7M",
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
    cloverItemId: "GTCV3E2PY6HQ6",
  },
  {
    slug: "streusel-kuchen",
    name: "Chocolate & Raspberry Streusel Kuchen",
    category: "Pastries",
    description:
      "Pound cake topped with salty, sweet and crunchy pieces of vanilla streusel.",
    image: "/images/products/streusel-kuchen.jpg",
    price: "$7.00",
    cloverItemId: "PTREMQKEAS0JW",
  },
  {
    slug: "baileys-bread-pudding",
    name: "Baileys Bread & Butter Pudding",
    category: "Pastries",
    description:
      "Thick slices of buttery brioche-style bread baked slowly in a Baileys custard.",
    image: "/images/products/baileys-bread-pudding.jpg",
    price: "$7.50",
    cloverItemId: "Z4EJQZW51BGW2",
  },
  {
    slug: "chocolate-tart",
    name: "Seasonal Chocolate Tart",
    category: "Pastries",
    description:
      "Dark chocolate seasonal ganache with fluid gel and cocoa nibs.",
    image: "/images/products/chocolate-tart.jpg",
    price: "$7.50",
    cloverItemId: "Z68MW2HBV8Q1G",
  },
  {
    slug: "creme-puff",
    name: "Crème Puff",
    category: "Pastries",
    description:
      "Choux pastry, Tahitian vanilla diplomat cream and a crackling craquelin lid.",
    image: "/images/products/creme-puff.jpg",
    price: "$4.00",
    cloverItemId: "8JNNQMW6T8AEA",
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
    cloverItemId: "G2WKAN44J37J4",
  },
  {
    slug: "lemon-square",
    // Now a round tart (renamed in Clover 2026-10). Photo still shows the old
    // square until Valentina sends a new one.
    name: "Lemon Tart",
    category: "Pastries",
    description:
      "Buttery shortbread tart filled with vibrant lemon curd, finished with a dusting of sugar. Pictured as our former square; now baked as a round tart.",
    image: "/images/products/lemon-square.jpg",
    price: "$7.00",
    cloverItemId: "500QB5ZR31DB8",
  },
  {
    slug: "vanilla-kuchen",
    name: "Seasonal Vanilla Kuchen",
    category: "Pastries",
    description:
      "Fresh fruit baked into vanilla custard, cradled by a sweet dough tart shell.",
    image: "/images/products/vanilla-kuchen.jpg",
    price: "$6.00",
    cloverItemId: "G10WYGQM7WQ3A",
  },
  {
    slug: "carrot-cake",
    name: "Carrot Cake",
    category: "Pastries",
    description:
      "Moist and spiced carrot cake, baked with walnuts and raisins, topped with rich and tangy cream cheese frosting. Allergens: tree nuts, wheat, eggs.",
    image: "/images/products/carrot-cake.jpg",
    price: "$9.00",
    cloverItemId: "6BXC43Z1R6W8R",
  },

  // --- Christmas 2026 pre-orders (lib/christmas.ts) ---
  // Valentina renamed the Thanksgiving items in Clover to "Christmas ..." and
  // kept their ids (2026-11-26), so these replace the Thanksgiving products
  // one to one; Stollen and Panettone are new. Separate Clover items, so stock
  // never mixes with the daily bake. Names carry "(Christmas)" where a daily
  // twin exists: the webhook matches line items to products BY NAME for stock.
  {
    slug: "xmas-stollen",
    name: "Christmas Stollen",
    category: "Christmas",
    description: "Our Christmas stollen, rich with dried fruit and nuts and finished in a snowy coat of sugar.",
    image: "/images/christmas/stollen.jpg",
    imageFit: "cover",
    price: "$35.00",
    tag: "New",
    cloverItemId: "QVRPXRGKZS3QW",
  },
  {
    slug: "xmas-panettone",
    name: "Panettone",
    category: "Christmas",
    description: "Tall, airy panettone with candied orange and raisins under a pearl-sugar crust. Baked to order.",
    image: "/images/christmas/panettone.jpg",
    imageFit: "cover",
    price: "$40.00",
    tag: "Special order",
    cloverItemId: "XM20DSWR5FS66",
  },
  {
    slug: "xmas-pear-streusel-kuchen",
    name: "Pear Streusel Kuchen",
    category: "Christmas",
    description: "Spiced cake baked with pears and a spiced streusel topping.",
    image: "/images/thanksgiving/pear-streusel-kuchen.jpg",
    imageFit: "cover",
    price: "$35.00",
    tag: "Pre-order",
    cloverItemId: "4PA2SZV88YM28",
  },
  {
    slug: "xmas-apple-cranberry-tart",
    name: "Apple & Cranberry Almond Tart 9\"",
    category: "Christmas",
    description: "Apples and cranberries over almond cream in a buttery 9-inch tart.",
    image: "/images/thanksgiving/apple-cranberry-tart.jpg",
    imageFit: "cover",
    price: "$35.00",
    tag: "Pre-order",
    cloverItemId: "DS451ENN9BTXP",
  },
  {
    slug: "xmas-dinner-rolls",
    name: "Dinner Rolls (6)",
    category: "Christmas",
    description: "Soft milk rolls, six to a bag.",
    image: "/images/thanksgiving/dinner-rolls.jpg",
    imageFit: "cover",
    price: "$7.00",
    tag: "Pre-order",
    cloverItemId: "K87AA09380AZC",
  },
  {
    slug: "xmas-rosemary-focaccia",
    name: "Rosemary Focaccia (quarter)",
    category: "Christmas",
    description: "A quarter sheet of rosemary focaccia topped with olive oil and sea salt.",
    image: "/images/thanksgiving/rosemary-focaccia-table.jpg",
    imageFit: "cover",
    price: "$10.00",
    tag: "Pre-order",
    cloverItemId: "JKNQFTDC6S7CY",
  },
  {
    slug: "xmas-plain-croissant",
    name: "Plain Croissant (Christmas)",
    category: "Christmas",
    description: "The classic butter croissant, laminated over three days.",
    image: "/images/products/butter-croissant.jpg",
    price: "$4.00",
    cloverItemId: "49W1RRQBKWZPG",
  },
  {
    slug: "xmas-chocolate-croissant",
    name: "Chocolate Croissant (Christmas)",
    category: "Christmas",
    description: "Flaky croissant with two batons of dark chocolate.",
    image: "/images/products/chocolate-croissant.jpg",
    price: "$4.50",
    cloverItemId: "AE36658HVZSQ2",
  },
  {
    slug: "xmas-almond-croissant",
    name: "Almond Croissant (Christmas)",
    category: "Christmas",
    description: "Filled with almond cream, baked twice, finished with toasted almonds.",
    image: "/images/products/almond-croissant.jpg",
    price: "$6.00",
    cloverItemId: "X5Z015S6JTP5P",
  },
  {
    slug: "xmas-blueberry-scone",
    name: "Blueberry & Lemon Scone (Christmas)",
    category: "Christmas",
    description: "Buttery scone studded with Maine blueberries and brightened with candied lemon.",
    image: "/images/products/blueberry-scone.jpg",
    price: "$4.00",
    cloverItemId: "57SSY9YZHGTVW",
  },
  {
    slug: "xmas-nuss-schnecken",
    name: "Nuss Schnecken (Christmas)",
    category: "Christmas",
    description: "Our Swiss nut spiral, moist and tender, with a vanilla glaze.",
    image: "/images/products/nuss-schnecken.jpg",
    price: "$5.50",
    cloverItemId: "42AZ5H2R5W4GA",
  },

  // --- Cookies ---
  {
    slug: "chocolate-chip",
    name: "Chocolate Chip Cookie",
    category: "Cookies",
    description:
      "Brown-butter dough and dark chocolate chunks. Best slightly warm.",
    image: "/images/products/chocolate-chip-cookie.jpg",
    price: "$3.00",
    cloverItemId: "BZT370F6Z1RJM",
  },
  {
    slug: "spitzbub",
    name: "Spitzbub",
    category: "Cookies",
    description:
      "A sandwich shortbread cookie filled with bright raspberry jam.",
    image: "/images/products/spitzbub.jpg",
    price: "$3.00",
    cloverItemId: "YRTM437X57FCC",
  },
  {
    slug: "chocolate-sable",
    name: "Chocolate Sablé",
    category: "Cookies",
    description:
      "Crunchy chocolate sablé with chocolate chunks. Three pieces per bag.",
    image: "/images/products/chocolate-sable.jpg",
    price: "$6.00",
    cloverItemId: "NDQMK4A4B6D8Y",
  },
  {
    slug: "basler-laeckerli",
    name: "Basler Läckerli",
    category: "Cookies",
    description:
      "A 700-year-old Basel recipe — honey, almonds, candied orange, spices and Kirschwasser. Six pieces.",
    image: "/images/products/basler-laeckerli.jpg",
    price: "$7.00",
    cloverItemId: "333Q09ZX0RHFE",
  },

  // --- Granola ---
  {
    slug: "house-granola",
    name: "House Granola",
    category: "Granola",
    description:
      "Slow-toasted oats, maple syrup, pecans, almonds, sunflower seeds and pumpkin seeds. Crunchy clusters, jar-ready.",
    image: "/images/products/granola.jpg",
    cloverItemId: "WMHQDE7KZB9JM",
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
  Thanksgiving:
    "Pre-order for pick-up on Thanksgiving Eve: large desserts, breads and breakfast pastries.",
  Christmas:
    "Pre-order for pick-up on December 23: stollen, panettone, large desserts, breads and breakfast pastries.",
};
