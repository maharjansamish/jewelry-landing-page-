// Public product settings. Replace the sample price and delivery fee with your actual amounts before launch.
export const STORE = {
  brand: "Aura Jewels",
  product: {
    id: "temple-set-553005",
    sku: "553005",
    name: "Rang Mahal Temple Necklace Set",
    material: "Brass with gold-tone finish",
    price: 2499,
    compareAtPrice: null,
    deliveryFee: 150,
    images: [
      { src: "/temple-set-01.png", alt: "Brass temple necklace and matching earrings with red and green accents, front view" },
      { src: "/temple-set-02.png", alt: "Temple necklace and earrings showing the repeating leaf design" },
      { src: "/temple-set-03.png", alt: "Close view of the temple necklace and matching earrings" },
      { src: "/temple-set-04.png", alt: "Temple necklace set with multicolour stone accents" },
    ],
  },
  // Product highlights are brand-authored and based on the supplied catalog.
  reviewHighlights: [
    { title: "Temple-inspired design", detail: "Ornamental detailing gives the necklace its traditional statement look." },
    { title: "A matching pair", detail: "The set includes earrings designed to complete the necklace look." },
    { title: "A touch of colour", detail: "Red and green accents bring contrast to the warm gold-tone finish." },
  ],
};

export function formatNpr(amount) {
  return `Rs ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount)}`;
}
