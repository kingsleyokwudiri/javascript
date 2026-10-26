import { loadFromStorage } from "../../../data/cart.js";
import { loadOrders } from "../../../data/orders.js";
import { loadProductsFetch } from "../../../data/products.js";
import { renderPaymentSummary } from "../../../scripts/checkout/paymentSummary.js";
import {
  jsonResponse,
  productFixtures,
} from "../../helpers/fixtures.js";

// Clicking "Place your order" redirects the page. That is safe to assert in
// Node/jsdom, but it would navigate away from the browser spec runner.
const isNode = typeof process !== "undefined" && !!process.versions?.node;
const itInNode = isNode ? it : xit;

describe("test suite: checkout payment summary", () => {
  beforeEach(async () => {
    globalThis.fetch = jasmine
      .createSpy("fetch")
      .and.resolveTo(jsonResponse(productFixtures));
    await loadProductsFetch();
    loadFromStorage();

    localStorage.setItem("orders", "[]");
    loadOrders();
  });

  function setCart(items) {
    localStorage.setItem("cart", JSON.stringify(items));
    loadFromStorage();
  }

  function renderWith(items) {
    setCart(items);
    renderPaymentSummary();
  }

  it("shows zero totals and a disabled button for an empty cart", () => {
    renderPaymentSummary();

    const summary = document.querySelector(".js-payment-summary");
    expect(summary.textContent).toContain("Order Summary");
    expect(summary.textContent).toContain("Items (0):");
    expect(summary.textContent).toContain("$0.00");
    expect(summary.querySelector(".js-place-order").disabled).toBeTrue();
  });

  it("calculates items, shipping, tax, and total", () => {
    renderWith([
      { productId: "prod-socks", quantity: 2, deliveryOptionId: "1" },
      { productId: "prod-basketball", quantity: 1, deliveryOptionId: "2" },
    ]);

    const rows = document.querySelectorAll(".payment-summary-row");
    const text = [...rows].map((row) => row.textContent.replace(/\s+/g, " "));

    expect(text[0]).toContain("Items (3):");
    expect(text[0]).toContain("$42.75");
    expect(text[1]).toContain("Shipping & handling:");
    expect(text[1]).toContain("$4.99");
    expect(text[2]).toContain("Total before tax:");
    expect(text[2]).toContain("$47.74");
    expect(text[3]).toContain("Estimated tax (10%):");
    expect(text[3]).toContain("$4.77");
    expect(text[4]).toContain("Order total:");
    expect(text[4]).toContain("$52.51");
  });

  it("includes the selected shipping price", () => {
    renderWith([
      { productId: "prod-socks", quantity: 1, deliveryOptionId: "3" },
    ]);

    const summary = document.querySelector(".js-payment-summary");
    expect(summary.textContent).toContain("Items (1):");
    expect(summary.textContent).toContain("$9.99");
    expect(summary.textContent).toContain("$20.89");
    expect(summary.textContent).toContain("$2.09");
    expect(summary.textContent).toContain("$22.98");
  });

  it("enables the place order button when the cart has items", () => {
    renderWith([
      { productId: "prod-socks", quantity: 1, deliveryOptionId: "1" },
    ]);

    expect(
      document.querySelector(".js-place-order").disabled,
    ).toBeFalse();
  });

  itInNode("submits the order and saves it", async () => {
    const backendOrder = { id: "order-from-backend", products: [] };
    globalThis.fetch.and.resolveTo(jsonResponse(backendOrder));
    renderWith([
      { productId: "prod-socks", quantity: 2, deliveryOptionId: "1" },
      { productId: "prod-basketball", quantity: 1, deliveryOptionId: "2" },
    ]);

    document.querySelector(".js-place-order").click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://supersimplebackend.dev/orders",
      jasmine.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );

    const savedOrders = JSON.parse(localStorage.getItem("orders"));
    expect(savedOrders.length).toEqual(1);
    expect(savedOrders[0].id).toEqual("order-from-backend");
    expect(savedOrders[0].totalCents).toBeCloseTo(5251.4, 5);
    expect(savedOrders[0].orderTime).toBeDefined();
  });

  itInNode("still redirects when the order request fails", async () => {
    globalThis.fetch.and.rejectWith(new Error("network down"));
    spyOn(console, "log");
    renderWith([
      { productId: "prod-socks", quantity: 1, deliveryOptionId: "1" },
    ]);

    document.querySelector(".js-place-order").click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(console.log).toHaveBeenCalledWith(
      "Unexpected error. Try again later.",
    );
    expect(JSON.parse(localStorage.getItem("orders"))).toEqual([]);
  });
});
