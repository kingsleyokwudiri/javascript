import { formatCurrency } from "../scripts/utils/money.js";

// ----- PRODUCT CLASSES -----
class Product {
  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
  }

  getStarsUrl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }

  getPrice() {
    return `$${formatCurrency(this.priceCents)}`;
  }

  extraInfoHTML() {
    return "";
  }
}

class Clothing extends Product {
  constructor(productDetails) {
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
  }

  extraInfoHTML() {
    return `<a href="${this.sizeChartLink}" target="_blank">Size Chart</a>`;
  }
}

class Appliance extends Product {
  constructor(productDetails) {
    super(productDetails);
    this.instructionsLink = productDetails.instructionsLink;
    this.warrantyLink = productDetails.warrantyLink;
  }

  extraInfoHTML() {
    return `
      <a href="${this.instructionsLink}" target="_blank">Instructions</a>
      <a href="${this.warrantyLink}" target="_blank">Warranty</a>
    `;
  }
}

// ----- PRODUCT DATA -----
export let products = [];

function createProduct(productDetails) {
  if (productDetails.type === "clothing") return new Clothing(productDetails);
  if (productDetails.type === "appliance") return new Appliance(productDetails);
  return new Product(productDetails);
}

// ----- LOAD PRODUCTS -----
export function loadProductsFetch() {
  return fetch("https://supersimplebackend.dev/products")
    .then((response) => response.json())
    .then((productsData) => {
      products = productsData.map(createProduct);
    })
    .catch((error) => {
      console.log("Unexpected error. Please try again later");
    });
}

// ----- HELPERS -----
export function getProduct(productId) {
  return products.find((product) => product.id === productId);
}

// ----- INITIALIZE -----
loadProductsFetch();
