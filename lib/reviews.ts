/**
 * GOOGLE REVIEWS — reseñas reales de Edelweiss Pastry Shop (Google Business).
 * Todas son 5★. Texto recortado donde se indica con "…" para el formato tarjeta;
 * el contenido es fiel al original. Actualizar añadiendo nuevas reseñas reales.
 */

export interface Review {
  name: string;
  rating: number; // 1-5
  text: string;
  initials: string;
  date?: string;
  localGuide?: boolean;
}

export const reviews: Review[] = [
  {
    name: "Erik Hayes",
    rating: 5,
    localGuide: true,
    date: "2 days ago",
    text: "The pastries and chocolates looked amazing! One of the best ham & cheese croissants I have ever had. The cream puff with hazelnut cream was also delectable. The chocolates were perfect. This place is legit. I highly recommend.",
    initials: "EH",
  },
  {
    name: "Andrew Caron",
    rating: 5,
    localGuide: true,
    date: "5 weeks ago",
    text: "Simply amazing pastries! I've never been upset with anything I've gotten from here. I can 100% recommend this place for pastries and coffee!",
    initials: "AC",
  },
  {
    name: "Jen Small",
    rating: 5,
    date: "5 weeks ago",
    text: "Every single pastry we tried was absolutely incredible — beautifully made, perfectly balanced, and not overly sweet. It feels like a small European bakery: refined, fresh, and clearly made with care.",
    initials: "JS",
  },
  {
    name: "C. James Ford",
    rating: 5,
    date: "5 weeks ago",
    text: "The lemon bar was by far one of the best I've had in the states, if not ever. The hazelnut cream filled roll was also top notch. This place is a must — I'm looking forward to next time!",
    initials: "CF",
  },
  {
    name: "Matthew Gall",
    rating: 5,
    localGuide: true,
    date: "7 weeks ago",
    text: "All the pastries are exceptional! You're bound to find one (or more) for your choosing — flaky crusts, rich and velvety creams or gooey, nutty, sugary spices.",
    initials: "MG",
  },
  {
    name: "Miriam Rohini",
    rating: 5,
    localGuide: true,
    date: "18 weeks ago",
    text: "SUPERB. Pastries that will transport you to Europe. Laminated dough mastery. Balanced flavors that allow the quality of her ingredients to shine.",
    initials: "MR",
  },
  {
    name: "Tara Long",
    rating: 5,
    date: "22 weeks ago",
    text: "The most adorable and delicious pastry shop! We just finished one of the most amazing croissants I've ever had. A great stop for gifts of truffle boxes and baked goods. I highly recommend a stop in!",
    initials: "TL",
  },
  {
    name: "Mark Siladi",
    rating: 5,
    localGuide: true,
    date: "27 weeks ago",
    text: "Do yourself a favor and go here. The pastries and handmade chocolates are to die for. Perfect for small boxes for special little holiday gifts… or at least that was my excuse.",
    initials: "MS",
  },
  {
    name: "eliza anderson",
    rating: 5,
    date: "31 weeks ago",
    text: "Best almond croissant I've had for years, and it matches that Montreal croissant I still remember from years back. Seriously good.",
    initials: "EA",
  },
  {
    name: "Aitor Colino",
    rating: 5,
    date: "16 weeks ago",
    text: "The best bakery in Biddeford and surrounding areas. All the chocolates are delicious.",
    initials: "AC",
  },
];
