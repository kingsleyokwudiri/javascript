import { cart, loadFromStorage } from "../../data/cart.js";
import { loadOrders } from "../../data/orders.js";
import { loadProductsFetch } from "../../data/products.js";
import {
  jsonResponse,
  makeOrder,
  productFixtures,
} from "../helpers/fixtures.js";

describe("test suite: orders page", () => {
  let ordersPage;
  const originalFetch = globalThis.fetch;

  beforeAll(async () => {
    globalThis.fetch = async () => jsonResponse(productFixtures);
    ordersPage = await import("../../scripts/orders.js");
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

    localStorage.setItem("orders", "[]");
    loadOrders();
    loadFromStorage();
  });

  function setOrders(savedOrders) {
    localStorage.setItem("orders", JSON.stringify(savedOrders));
    loadOrders();
  }

  it("renders an empty grid when there are no orders", () => {
    ordersPage.renderOrders();

    expect(document.querySelector(".orders-grid").innerHTML).toEqual("");
  });

  it("renders the order header and product details", () => {
    setOrders([makeOrder()]);

    ordersPage.renderOrders();

    const grid = document.querySelector(".orders-grid");
    expect(grid.querySelectorAll(".order-container").length).toEqual(1);
    expect(grid.textContent).toContain("Order Placed:");
    expect(grid.textContent).toContain("Order ID:");
    expect(grid.textContent).toContain("order-1");
    expect(grid.textContent).toContain("$31.85");
    expect(grid.textContent).toContain("Black and Gray Athletic Cotton Socks");
    expect(grid.textContent).toContain("Quantity: 2");
    expect(grid.textContent).toContain("Arriving on:");
  });

  it("falls back to a zero total when totalCents is missing", () => {
    setOrders([makeOrder({ totalCents: undefined })]);

    ordersPage.renderOrders();

    expect(document.querySelector(".orders-grid").textContent).toContain(
      "$0.00",
    );
  });

  it("renders multiple orders", () => {
    setOrders([
      makeOrder({ id: "order-1" }),
      makeOrder({ id: "order-2" }),
    ]);

    ordersPage.renderOrders();

    expect(
      document.querySelectorAll(".orders-grid .order-container").length,
    ).toEqual(2);
    expect(document.querySelector(".orders-grid").textContent).toContain(
      "order-2",
    );
  });

  it("shows a tracking link for a package that is not delivered yet", () => {
    setOrders([makeOrder()]);

    ordersPage.renderOrders();

    const link = document.querySelector(".product-actions a");
    expect(link).not.toBeNull();
    expect(link.getAttribute("href")).toEqual(
      "tracking.html?orderId=order-1&productId=prod-socks",
    );
    expect(link.textContent).toContain("Track package");
  });

  it("shows a disabled Delivered button for delivered products", () => {
    const order = makeOrder();
    order.products[0].estimatedDeliveryTime = Date.now() - 1000;
    setOrders([order]);

    ordersPage.renderOrders();

    const button = document.querySelector(".product-actions button");
    expect(button.textContent.trim()).toEqual("Delivered");
    expect(button.disabled).toBeTrue();
    expect(document.querySelector(".product-actions a")).toBeNull();
  });

  it("skips products that no longer exist", () => {
    const order = makeOrder();
    order.products.push({
      productId: "missing-product",
      quantity: 1,
      estimatedDeliveryTime: Date.now() + 1000,
    });
    setOrders([order]);

    ordersPage.renderOrders();

    expect(document.querySelectorAll(".product-details").length).toEqual(1);
  });

  it("adds a product to the cart with Buy it again", () => {
    setOrders([makeOrder()]);
    ordersPage.renderOrders();
    spyOn(Storage.prototype, "setItem").and.callThrough();
    spyOn(globalThis, "alert");

    document.querySelector(".js-buy-again").click();

    expect(cart).toEqual([
      { productId: "prod-socks", quantity: 1, deliveryOptionId: "1" },
    ]);
    expect(globalThis.alert).toHaveBeenCalledWith("Added to cart!");
    expect(document.querySelector(".js-cart-quantity").textContent).toEqual(
      "1",
    );
  });

  it("updates the cart quantity in the header", () => {
    localStorage.setItem(
      "cart",
      JSON.stringify([
        { productId: "prod-socks", quantity: 2, deliveryOptionId: "1" },
        { productId: "prod-basketball", quantity: 4, deliveryOptionId: "1" },
      ]),
    );
    loadFromStorage();

    ordersPage.updateCartQuantity();

    expect(document.querySelector(".js-cart-quantity").textContent).toEqual(
      "6",
    );
  });

  it("does not update the header when the cart quantity element is missing", () => {
    document.querySelector(".js-cart-quantity").remove();

    expect(() => ordersPage.updateCartQuantity()).not.toThrow();
  });
});
