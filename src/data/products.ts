export interface ProductVariant {
  weight: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  variants: ProductVariant[];
}

const defaultVariants: ProductVariant[] = [
  { weight: "50g", price: 40 },
  { weight: "100g", price: 75 },
  { weight: "250g", price: 180 },
  { weight: "500g", price: 350 },
  { weight: "1kg", price: 680 }
];

export const products: Product[] = [
  {
    id: "p1",
    name: "Spicy Banana Chips",
    description: "Crispy Nendran banana chips coated with a fiery blend of red chilies and traditional spices.",
    image: "/4.jpeg",
    category: "Banana Chips",
    variants: [
      { weight: "50g", price: 45 },
      { weight: "100g", price: 85 },
      { weight: "250g", price: 200 },
      { weight: "500g", price: 380 },
      { weight: "1kg", price: 700 }
    ]
  },
  {
    id: "p2",
    name: "Normal Banana Chips",
    description: "Classic salted Kerala style banana chips fried in fresh coconut oil.",
    image: "/5.jpg",
    category: "Banana Chips",
    variants: defaultVariants
  },
  {
    id: "p3",
    name: "Sweet Banana Chips",
    description: "Thickly sliced banana chips richly coated in jaggery (Sarkara Upperi).",
    image: "/3.jpeg",
    category: "Banana Chips",
    variants: defaultVariants
  },
  {
    id: "p4",
    name: "Spicy Tapioca Chips",
    description: "Thinly sliced tapioca (cassava) chips dusted with spicy chili seasoning.",
    image: "/4.jpeg",
    category: "Tapioca Chips",
    variants: [
      { weight: "50g", price: 35 },
      { weight: "100g", price: 65 },
      { weight: "250g", price: 150 },
      { weight: "500g", price: 290 },
      { weight: "1kg", price: 550 }
    ]
  },
  {
    id: "p5",
    name: "Normal Tapioca Chips",
    description: "Perfectly salted, crunchy tapioca chips.",
    image: "/5.jpg",
    category: "Tapioca Chips",
    variants: [
      { weight: "50g", price: 30 },
      { weight: "100g", price: 55 },
      { weight: "250g", price: 130 },
      { weight: "500g", price: 250 },
      { weight: "1kg", price: 480 }
    ]
  },
  {
    id: "p6",
    name: "Sweet Tapioca Chips",
    description: "Tapioca chips with a light, sweet glaze for the perfect tea-time snack.",
    image: "/3.jpeg",
    category: "Tapioca Chips",
    variants: [
      { weight: "50g", price: 35 },
      { weight: "100g", price: 60 },
      { weight: "250g", price: 140 },
      { weight: "500g", price: 270 },
      { weight: "1kg", price: 500 }
    ]
  },
  {
    id: "p7",
    name: "Spicy Jackfruit Chips",
    description: "Premium jackfruit chips tossed in a zesty, spicy masala.",
    image: "/2.jpeg",
    category: "Jackfruit Chips",
    variants: [
      { weight: "50g", price: 60 },
      { weight: "100g", price: 110 },
      { weight: "250g", price: 260 },
      { weight: "500g", price: 500 },
      { weight: "1kg", price: 950 }
    ]
  },
  {
    id: "p8",
    name: "Normal Jackfruit Chips",
    description: "Authentic, naturally sweet and salty jackfruit chips crisp fried to perfection.",
    image: "/2.jpeg",
    category: "Jackfruit Chips",
    variants: [
      { weight: "50g", price: 55 },
      { weight: "100g", price: 100 },
      { weight: "250g", price: 240 },
      { weight: "500g", price: 460 },
      { weight: "1kg", price: 900 }
    ]
  }
];
