import { cart, loadFromStorage } from "../../data/cart.js";
import { loadProductsFetch, products } from "../../data/products.js";
import {
  jsonResponse,
  productFixtures,
} from "../helpers/fixtures.js";

describe("test suite: Amazon product page", () => {
  let amazon;
  const originalFetch = globalThis.fetch;

  beforeAll(async () => {
    globalThis.fetch = async () => jsonResponse(productFixtures);
    amazon = await import("../../scripts/amazon.js");
    // Let the module's initial loadProductsFetch().then(...) finish.
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  afterAll(() => {
    globalThis.fetch = originalFetch;
  });

  beforeEach(async () => {
    globalThis.fetch = jasmine
      .createSpy("fetch")
      .and.resolveTo(jsonResponse(productFixtures));
    await loadProductsFetch();
    loadFromStorage();
  });

  describe("filterProducts", () => {
    it("returns every product when there is no search term", () => {
      expect(amazon.filterProducts(productFixtures, "")).toEqual(productFixtures);
    });

    it("matches product names case-insensitively", () => {
      const result = amazon.filterProducts(productFixtures, "BASKETBALL");

      expect(result.map((product) => product.id)).toEqual(["prod-basketball"]);
    });

    it("matches keywords", () => {
      const result = amazon.filterProducts(productFixtures, "kitchen");

      expect(result.map((product) => product.id)).toEqual(["prod-toaster"]);
    });

    it("matches either the name or a keyword", () => {
      const result = amazon.filterProducts(productFixtures, "apparel");

      expect(result.map((product) => product.id)).toEqual([
        "prod-socks",
        "prod-shirt",
      ]);
    });

    it("returns an empty list when nothing matches", () => {
      expect(amazon.filterProducts(productFixtures, "zzzz")).toEqual([]);
    });

    it("does not mutate the original list", () => {
      const originalLength = productFixtures.length;

      amazon.filterProducts(productFixtures, "socks");

      expect(productFixtures.length).toEqual(originalLength);
    });
  });

  describe("search URL helpers", () => {
    it("reads the search term from the URL", () => {
      window.history.replaceState({}, "", "/amazon.html?search=socks");

      expect(amazon.getSearchFromURL()).toEqual("socks");
    });

    it("returns an empty string when there is no search term", () => {
      window.history.replaceState({}, "", "/amazon.html");

      expect(amazon.getSearchFromURL()).toEqual("");
    });

    it("adds a search term to the URL", () => {
      window.history.replaceState({}, "", "/amazon.html");

      const url = new URL(amazon.getSearchUrl("toaster"));

      expect(url.searchParams.get("search")).toEqual("toaster");
    });

    it("removes the search term from the URL when the value is empty", () => {
      window.history.replaceState({}, "", "/amazon.html?search=socks");

      const url = new URL(amazon.getSearchUrl(""));

      expect(url.searchParams.has("search")).toBeFalse();
    });
  });

  describe("renderProductsGrid", () => {
    it("renders every product when there is no search", () => {
      window.history.replaceState({}, "", "/amazon.html");

      amazon.renderProductsGrid();

      const grid = document.querySelector(".js-products-grid");
      expect(grid.querySelectorAll(".product-container").length).toEqual(
        products.length,
      );
      expect(grid.textContent).not.toContain("Showing");
    });

    it("fills the search bar with the current search", () => {
      window.history.replaceState({}, "", "/amazon.html?search=socks");

      amazon.renderProductsGrid();

      expect(document.querySelector(".search-bar").value).toEqual("socks");
    });

    it("shows the result count for a search", () => {
      window.history.replaceState({}, "", "/amazon.html?search=socks");

      amazon.renderProductsGrid();

      const text = document.querySelector(".js-products-grid").textContent;
      expect(text).toContain('Showing 1 result(s) for "socks"');
      expect(text).toContain("Black and Gray Athletic Cotton Socks");
    });

    it("shows an empty state when nothing matches", () => {
      window.history.replaceState({}, "", "/amazon.html?search=zzzz");

      amazon.renderProductsGrid();

      expect(document.querySelector(".js-products-grid").textContent).toContain(
        'No products found for "zzzz"',
      );
    });

    it("renders product details and a quantity selector", () => {
      window.history.replaceState({}, "", "/amazon.html");

      amazon.renderProductsGrid();

      const firstCard = document.querySelector(".product-container");
      expect(firstCard.querySelector(".product-name").textContent.trim()).toEqual(
        productFixtures[0].name,
      );
      expect(firstCard.querySelector(".product-price").textContent).toEqual(
        "$10.90",
      );
      expect(
        firstCard.querySelectorAll(".js-quantity-select option").length,
      ).toEqual(10);
      expect(firstCard.querySelector(".js-add-to-cart")).not.toBeNull();
    });

    it("adds extra info for clothing and appliances", () => {
      window.history.replaceState({}, "", "/amazon.html");

      amazon.renderProductsGrid();

      const text = document.querySelector(".js-products-grid").textContent;
      expect(text).toContain("Size Chart");
      expect(text).toContain("Instructions");
      expect(text).toContain("Warranty");
    });
  });

  describe("cart quantity", () => {
    it("shows the total quantity in the header", () => {
      localStorage.setItem(
        "cart",
        JSON.stringify([
          { productId: "prod-socks", quantity: 2, deliveryOptionId: "1" },
          { productId: "prod-basketball", quantity: 3, deliveryOptionId: "1" },
        ]),
      );
      loadFromStorage();

      amazon.updateCartQuantity();

      expect(document.querySelector(".js-cart-quantity").textContent).toEqual(
        "5",
      );
    });

    it("shows 0 for an empty cart", () => {
      amazon.updateCartQuantity();

      expect(document.querySelector(".js-cart-quantity").textContent).toEqual(
        "0",
      );
    });
  });

  describe("add to cart buttons", () => {
    it("adds the selected quantity when a button is clicked", () => {
      window.history.replaceState({}, "", "/amazon.html");
      amazon.renderProductsGrid();
      spyOn(Storage.prototype, "setItem").and.callThrough();

      const select = document.querySelector(
        '.js-quantity-select[data-product-id="prod-socks"]',
      );
      select.value = "3";
      document
        .querySelector('.js-add-to-cart[data-product-id="prod-socks"]')
        .click();

      expect(cart).toContain({
        productId: "prod-socks",
        quantity: 3,
        deliveryOptionId: "1",
      });
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      expect(document.querySelector(".js-cart-quantity").textContent).toEqual(
        "3",
      );
    });

    it("shows the added message and hides it after two seconds", () => {
      jasmine.clock().install();

      try {
        const message = document.createElement("div");
        message.className = "added-to-cart js-added-to-cart-prod-socks";
        document.body.appendChild(message);

        amazon.showAddedMessage("prod-socks");

        expect(message.classList).toContain("added-to-cart-visible");

        jasmine.clock().tick(2000);

        expect(message.classList).not.toContain("added-to-cart-visible");
      } finally {
        jasmine.clock().uninstall();
      }
    });
  });
});
