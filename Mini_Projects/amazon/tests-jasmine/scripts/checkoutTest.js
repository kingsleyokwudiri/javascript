import { loadFromStorage } from "../../data/cart.js";
import { loadOrders } from "../../data/orders.js";
import {
  jsonResponse,
  productFixtures,
} from "../helpers/fixtures.js";

describe("test suite: checkout page entry point", () => {
  let checkoutPage;
  const originalFetch = globalThis.fetch;

  beforeAll(async () => {
    const originalLog = console.log;
    console.log = () => {};

    try {
      globalThis.fetch = async () => jsonResponse(productFixtures);
      checkoutPage = await import("../../scripts/checkout.js");
      await new Promise((resolve) => setTimeout(resolve, 0));
    } finally {
      console.log = originalLog;
    }
  });

  afterAll(() => {
    globalThis.fetch = originalFetch;
  });

  beforeEach(() => {
    spyOn(console, "log");
    globalThis.fetch = jasmine.createSpy("fetch").and.callFake((input) => {
      const url = String(input);

      if (url.includes("/cart")) {
        return Promise.resolve(jsonResponse([]));
      }

      if (url.includes("/orders")) {
        return Promise.resolve(jsonResponse({ id: "order-1", products: [] }));
      }

      return Promise.resolve(jsonResponse(productFixtures));
    });

    localStorage.setItem(
      "cart",
      JSON.stringify([
        { productId: "prod-socks", quantity: 2, deliveryOptionId: "1" },
      ]),
    );
    loadFromStorage();

    localStorage.setItem("orders", "[]");
    loadOrders();
  });

  it("loads products and the cart before rendering both summaries", async () => {
    await checkoutPage.loadPage();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://supersimplebackend.dev/products",
    );
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://supersimplebackend.dev/cart",
    );

    expect(document.querySelector(".js-order-summary").textContent).toContain(
      "Black and Gray Athletic Cotton Socks",
    );
    expect(
      document.querySelector(".js-payment-summary").textContent,
    ).toContain("Order Summary");
    expect(
      document.querySelector(".js-checkout-item-count").textContent,
    ).toEqual("2");
  });

  it("shows the empty state when the cart has no items", async () => {
    localStorage.setItem("cart", "[]");
    loadFromStorage();

    await checkoutPage.loadPage();

    expect(document.querySelector(".js-order-summary").textContent).toContain(
      "Your cart is empty.",
    );
    expect(
      document.querySelector(".js-place-order").disabled,
    ).toBeTrue();
  });
});
