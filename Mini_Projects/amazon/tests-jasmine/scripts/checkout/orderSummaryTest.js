import { cart, loadFromStorage } from "../../../data/cart.js";
import { loadProductsFetch } from "../../../data/products.js";
import { renderOrderSummary } from "../../../scripts/checkout/orderSummary.js";
import {
  jsonResponse,
  productFixtures,
} from "../../helpers/fixtures.js";

const FIXED_DATE = new Date(2026, 9, 26, 12, 0, 0); // Monday, October 26, 2026

describe("test suite: checkout order summary", () => {
  beforeEach(async () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(FIXED_DATE);

    globalThis.fetch = jasmine
      .createSpy("fetch")
      .and.resolveTo(jsonResponse(productFixtures));
    await loadProductsFetch();
    loadFromStorage();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  function setCart(items) {
    localStorage.setItem("cart", JSON.stringify(items));
    loadFromStorage();
  }

  function getContainer(productId = "prod-socks") {
    return document.querySelector(`.js-cart-item-container-${productId}`);
  }

  it("shows an empty message when the cart is empty", () => {
    renderOrderSummary();

    const summary = document.querySelector(".js-order-summary");
    expect(summary.textContent).toContain("Your cart is empty.");
    expect(summary.querySelector("a").getAttribute("href")).toEqual(
      "amazon.html",
    );
    expect(
      document.querySelector(".js-checkout-item-count").textContent,
    ).toEqual("0");
  });

  it("renders the cart item details", () => {
    setCart([
      { productId: "prod-socks", quantity: 2, deliveryOptionId: "2" },
    ]);

    renderOrderSummary();

    const container = getContainer();
    expect(container).not.toBeNull();
    expect(container.querySelector(".product-name").textContent.trim()).toEqual(
      "Black and Gray Athletic Cotton Socks - 6 Pairs",
    );
    expect(container.querySelector(".product-price").textContent.trim()).toEqual(
      "$10.90",
    );
    expect(container.querySelector(".quantity-label").textContent).toEqual("2");
    expect(container.querySelector(".product-image").getAttribute("src")).toEqual(
      "images/products/athletic-cotton-socks-6-pairs.jpg",
    );
    expect(container.querySelector(".delivery-date").textContent).toContain(
      "Delivery date: Thursday, October 29",
    );
  });

  it("renders every cart item", () => {
    setCart([
      { productId: "prod-socks", quantity: 2, deliveryOptionId: "1" },
      { productId: "prod-basketball", quantity: 1, deliveryOptionId: "2" },
    ]);

    renderOrderSummary();

    expect(document.querySelectorAll(".cart-item-container").length).toEqual(2);
    expect(getContainer("prod-basketball")).not.toBeNull();
  });

  it("shows the total number of items in the checkout header", () => {
    setCart([
      { productId: "prod-socks", quantity: 2, deliveryOptionId: "1" },
      { productId: "prod-basketball", quantity: 3, deliveryOptionId: "1" },
    ]);

    renderOrderSummary();

    expect(
      document.querySelector(".js-checkout-item-count").textContent,
    ).toEqual("5");
  });

  it("renders all delivery options and checks the saved one", () => {
    setCart([
      { productId: "prod-socks", quantity: 1, deliveryOptionId: "2" },
    ]);

    renderOrderSummary();

    const options = document.querySelectorAll(".js-delivery-option");
    expect(options.length).toEqual(3);
    expect(options[0].textContent).toContain("FREE Shipping");
    expect(options[1].textContent).toContain("$4.99 - Shipping");
    expect(options[2].textContent).toContain("$9.99 - Shipping");
    expect(options[1].querySelector("input").checked).toBeTrue();
    expect(options[0].querySelector("input").checked).toBeFalse();
  });

  it("enters edit mode when Update is clicked", () => {
    setCart([
      { productId: "prod-socks", quantity: 2, deliveryOptionId: "1" },
    ]);
    renderOrderSummary();

    const container = getContainer();
    container.querySelector(".js-update-link").click();

    expect(container.classList).toContain("is-editing-quantity");
    expect(document.activeElement).toBe(container.querySelector(".quantity-input"));
  });

  it("saves a new quantity", () => {
    setCart([
      { productId: "prod-socks", quantity: 2, deliveryOptionId: "1" },
    ]);
    renderOrderSummary();

    const container = getContainer();
    container.querySelector(".quantity-input").value = "5";
    container.querySelector(".js-save-link").click();

    expect(cart[0].quantity).toEqual(5);
    expect(getContainer().querySelector(".quantity-label").textContent).toEqual(
      "5",
    );
    expect(
      document.querySelector(".js-payment-summary").textContent,
    ).toContain("Items (5):");
  });

  it("rejects a negative quantity", () => {
    setCart([
      { productId: "prod-socks", quantity: 2, deliveryOptionId: "1" },
    ]);
    renderOrderSummary();
    spyOn(console, "log");
    spyOn(globalThis, "alert");

    const container = getContainer();
    container.querySelector(".quantity-input").value = "-1";
    container.querySelector(".js-save-link").click();

    expect(cart[0].quantity).toEqual(2);
    expect(globalThis.alert).toHaveBeenCalledWith("Quantity cannot be negative");
    expect(container.querySelector(".quantity-input").value).toEqual("2");
  });

  it("rejects a quantity of 1000 or more", () => {
    setCart([
      { productId: "prod-socks", quantity: 2, deliveryOptionId: "1" },
    ]);
    renderOrderSummary();
    spyOn(console, "log");
    spyOn(globalThis, "alert");

    const container = getContainer();
    container.querySelector(".quantity-input").value = "1000";
    container.querySelector(".js-save-link").click();

    expect(cart[0].quantity).toEqual(2);
    expect(globalThis.alert).toHaveBeenCalledWith(
      "Quantity must be less than 1000",
    );
    expect(container.querySelector(".quantity-input").value).toEqual("2");
  });

  it("rejects a non-numeric quantity", () => {
    setCart([
      { productId: "prod-socks", quantity: 2, deliveryOptionId: "1" },
    ]);
    renderOrderSummary();
    spyOn(globalThis, "alert");

    const container = getContainer();
    const input = container.querySelector(".quantity-input");
    input.type = "text";
    input.value = "abc";
    container.querySelector(".js-save-link").click();

    expect(cart[0].quantity).toEqual(2);
    expect(globalThis.alert).toHaveBeenCalledWith(
      "Please enter a valid number",
    );
  });

  it("saves a quantity with the Enter key", () => {
    setCart([
      { productId: "prod-socks", quantity: 2, deliveryOptionId: "1" },
    ]);
    renderOrderSummary();

    const container = getContainer();
    const input = container.querySelector(".quantity-input");
    input.value = "4";
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );

    expect(cart[0].quantity).toEqual(4);
  });

  it("cancels editing with the Escape key", () => {
    setCart([
      { productId: "prod-socks", quantity: 2, deliveryOptionId: "1" },
    ]);
    renderOrderSummary();

    const container = getContainer();
    container.querySelector(".js-update-link").click();
    const input = container.querySelector(".quantity-input");
    input.value = "9";
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );

    expect(input.value).toEqual("2");
    expect(container.classList).not.toContain("is-editing-quantity");
  });

  it("removes an item when Delete is clicked", () => {
    setCart([
      { productId: "prod-socks", quantity: 2, deliveryOptionId: "1" },
    ]);
    renderOrderSummary();

    getContainer().querySelector(".js-delete-link").click();

    expect(cart).toEqual([]);
    expect(document.querySelector(".js-order-summary").textContent).toContain(
      "Your cart is empty.",
    );
  });

  it("updates the delivery option when one is clicked", () => {
    setCart([
      { productId: "prod-socks", quantity: 1, deliveryOptionId: "1" },
    ]);
    renderOrderSummary();

    document.querySelectorAll(".js-delivery-option")[2].click();

    expect(cart[0].deliveryOptionId).toEqual("3");
    const options = document.querySelectorAll(".js-delivery-option");
    expect(options[2].querySelector("input").checked).toBeTrue();
    expect(options[0].querySelector("input").checked).toBeFalse();
  });
});
