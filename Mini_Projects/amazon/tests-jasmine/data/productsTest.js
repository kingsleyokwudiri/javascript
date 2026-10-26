import {
  Appliance,
  Clothing,
  Product,
  createProduct,
  getProduct,
  loadProductsFetch,
  products,
} from "../../data/products.js";
import {
  jsonResponse,
  productFixtures,
} from "../helpers/fixtures.js";

describe("test suite: products", () => {
  beforeEach(async () => {
    spyOn(globalThis, "fetch").and.resolveTo(jsonResponse(productFixtures));
    await loadProductsFetch();
  });

  it("loads products from the backend", () => {
    expect(globalThis.fetch).toHaveBeenCalledOnceWith(
      "https://supersimplebackend.dev/products",
    );
    expect(products.length).toEqual(productFixtures.length);
    expect(products[0].name).toEqual(productFixtures[0].name);
  });

  it("creates the right class for each product type", () => {
    expect(createProduct(productFixtures[0])).toEqual(jasmine.any(Product));
    expect(createProduct(productFixtures[2])).toEqual(jasmine.any(Clothing));
    expect(createProduct(productFixtures[3])).toEqual(jasmine.any(Appliance));
  });

  it("copies the product details onto the instance", () => {
    const product = createProduct(productFixtures[0]);

    expect(product.id).toEqual("prod-socks");
    expect(product.image).toEqual(productFixtures[0].image);
    expect(product.rating).toEqual({ stars: 4.5, count: 87 });
    expect(product.priceCents).toEqual(1090);
    expect(product.keywords).toEqual(["socks", "sports", "apparel"]);
  });

  it("defaults keywords to an empty array", () => {
    const detailsWithoutKeywords = { ...productFixtures[4] };
    delete detailsWithoutKeywords.keywords;

    const product = createProduct(detailsWithoutKeywords);

    expect(product.keywords).toEqual([]);
  });

  it("builds the star image URL", () => {
    expect(createProduct(productFixtures[0]).getStarsUrl()).toEqual(
      "images/ratings/rating-45.png",
    );
    expect(createProduct(productFixtures[1]).getStarsUrl()).toEqual(
      "images/ratings/rating-40.png",
    );
    expect(createProduct(productFixtures[4]).getStarsUrl()).toEqual(
      "images/ratings/rating-0.png",
    );
  });

  it("formats the price with a dollar sign", () => {
    expect(createProduct(productFixtures[0]).getPrice()).toEqual("$10.90");
    expect(createProduct(productFixtures[1]).getPrice()).toEqual("$20.95");
  });

  it("adds no extra info to a plain product", () => {
    expect(createProduct(productFixtures[0]).extraInfoHTML()).toEqual("");
  });

  it("adds a size chart link to clothing", () => {
    const clothing = createProduct(productFixtures[2]);

    expect(clothing.sizeChartLink).toEqual("images/clothing-size-chart.png");
    expect(clothing.extraInfoHTML()).toContain("Size Chart");
    expect(clothing.extraInfoHTML()).toContain(
      'href="images/clothing-size-chart.png"',
    );
  });

  it("adds instructions and warranty links to appliances", () => {
    const appliance = createProduct(productFixtures[3]);

    expect(appliance.instructionsLink).toEqual(
      "images/appliance-instructions.png",
    );
    expect(appliance.warrantyLink).toEqual("images/appliance-warranty.png");
    expect(appliance.extraInfoHTML()).toContain("Instructions");
    expect(appliance.extraInfoHTML()).toContain("Warranty");
  });

  it("finds a loaded product by id", () => {
    expect(getProduct("prod-basketball").name).toEqual(
      "Intermediate Size Basketball",
    );
    expect(getProduct("missing-product")).toBeUndefined();
  });

  it("logs an error when loading products fails", async () => {
    const consoleSpy = spyOn(console, "log");
    globalThis.fetch.and.rejectWith(new Error("network down"));

    await loadProductsFetch();

    expect(consoleSpy).toHaveBeenCalledWith(
      "Unexpected error. Please try again later",
    );
  });
});
