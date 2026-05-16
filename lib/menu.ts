export type MenuItem = {
  name: string;
  price: string;
  description?: string;
  tag?: string;
};

export type MenuSection = {
  title: string;
  items: MenuItem[];
};

export const menuSections: MenuSection[] = [
  {
    title: "Breakfast Items",
    items: [
      { name: "Plain Croissants", price: "4.00" },
      { name: "Pain au Chocolate", price: "4.50" },
      {
        name: "Ham and Cheese Croissant",
        price: "6.50",
        description: "Bresaola and Appenzeller",
      },
      { name: "Blueberry and Lemon Scone", price: "4.00" },
      {
        name: "Nuss Schnecken",
        price: "5.50",
        description:
          "Moist and tender nut spiral pastry drizzled with a vanilla glaze",
      },
      {
        name: "Chocolate Weggli",
        price: "3.00",
        description:
          "A classic from Basel city — a soft white roll with chocolate pieces",
      },
      {
        name: "Berliner",
        price: "4.00",
        description: "Fried yeast dough filled with raspberry jam",
      },
      { name: "Almond Croissants", price: "6.00" },
      {
        name: "Seasonal Quiche",
        price: "6.00",
        description: "With Appenzeller cheese",
      },
      { name: "Daily Focaccia", price: "5.00" },
    ],
  },
  {
    title: "Weekend Breakfast Pastry Special",
    items: [
      { name: "Fruit Danish", price: "6.00" },
      {
        name: "Vanilla Creme Croissants",
        price: "4.50",
        description: "Our flaky croissant filled with vanilla pastry crème",
      },
      {
        name: "Orange Brioche with Hazelnut Creme",
        price: "5.00",
        description: "Buttery brioche filled with hazelnut pastry crème",
      },
      { name: "Rye and Sesame Bread", price: "6.50" },
      { name: "Braided Zopf", price: "7.00" },
    ],
  },
  {
    title: "Daily Desserts",
    items: [
      {
        name: "Seasonal Financier",
        price: "9.00",
        description: "Almond and brown butter cake with fresh fruit",
      },
      {
        name: "Chocolate and Raspberry Streusel Kuchen",
        price: "7.00",
        description:
          "Pound cake topped with salty, sweet and crunchy pieces of vanilla streusel",
      },
      {
        name: "Baileys Bread and Butter Pudding",
        price: "7.50",
        description:
          "Thick slices of buttery, brioche-style bread baked in a Baileys custard",
      },
      { name: "Seasonal Chocolate Tart", price: "7.50" },
      { name: "Creme Puff", price: "4.00" },
      {
        name: "Black Forest",
        price: "8.00",
        tag: "GF",
        description:
          "Three layers with the distinctive Black Forest flavors — kirsch pannacotta, cherry coulis and a chocolate cremeux",
      },
      { name: "Lemon Square", price: "7.00" },
      {
        name: "Seasonal Vanilla Kuchen",
        price: "6.00",
        description:
          "Fresh fruit baked in vanilla custard with a sweet dough tart shell",
      },
    ],
  },
  {
    title: "Cookies",
    items: [
      { name: "Chocolate Chip", price: "3.00" },
      {
        name: "Spitzbub",
        price: "3.00",
        description: "A sandwich shortbread cookie filled with raspberry jam",
      },
      {
        name: "Chocolate Sable",
        price: "6.00",
        description:
          "Crunchy chocolate sable with Ovaltine and chocolate chunks · 3 pieces",
      },
      {
        name: "Basler Läckerli",
        price: "7.00",
        description:
          "Semi-soft cookie made of honey, almonds, candied orange, spices and Kirschwasser · 6 pieces",
      },
    ],
  },
];
