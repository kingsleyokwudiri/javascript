// Shared product fixtures used by the Amazon test suite.
// They intentionally cover every product type (plain, clothing, appliance).

export const productFixtures = [
  {
    id: "prod-socks",
    image: "images/products/athletic-cotton-socks-6-pairs.jpg",
    name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
    rating: { stars: 4.5, count: 87 },
    priceCents: 1090,
    keywords: ["socks", "sports", "apparel"],
  },
  {
    id: "prod-basketball",
    image: "images/products/intermediate-composite-basketball.jpg",
    name: "Intermediate Size Basketball",
    rating: { stars: 4, count: 127 },
    priceCents: 2095,
    keywords: ["sports", "basketballs"],
  },
  {
    id: "prod-shirt",
    image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
    name: "Adults Plain Cotton T-Shirt - 2 Pack",
    rating: { stars: 5, count: 42 },
    priceCents: 1599,
    keywords: ["shirt", "apparel"],
    type: "clothing",
    sizeChartLink: "images/clothing-size-chart.png",
  },
  {
    id: "prod-toaster",
    image: "images/products/black-2-slot-toaster.jpg",
    name: "2 Slot Toaster - Black",
    rating: { stars: 3.5, count: 18 },
    priceCents: 2499,
    keywords: ["toaster", "kitchen"],
    type: "appliance",
    instructionsLink: "images/appliance-instructions.png",
    warrantyLink: "images/appliance-warranty.png",
  },
  {
    id: "prod-no-keywords",
    image: "images/products/umbrella.jpg",
    name: "Umbrella",
    rating: { stars: 0, count: 0 },
    priceCents: 799,
    keywords: [],
  },
];

export function jsonResponse(data) {
  return {
    ok: true,
    status: 200,
    json: async () => data,
    text: async () => JSON.stringify(data),
  };
}

export function makeOrder(overrides = {}) {
  const now = Date.now();

  return {
    id: "order-1",
    orderTime: now,
    totalCents: 3185,
    products: [
      {
        productId: "prod-socks",
        quantity: 2,
        estimatedDeliveryTime: now + 3 * 24 * 60 * 60 * 1000,
      },
    ],
    ...overrides,
  };
}
