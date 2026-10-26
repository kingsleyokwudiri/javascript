import {
  addToCart,
  cart,
  loadCartFetch,
  loadFromStorage,
  removeFromCart,
  updateDeliveryOption,
  updateQuantity,
} from "../../data/cart.js";
import { jsonResponse } from "../helpers/fixtures.js";

describe("test suite: cart storage", () => {
  beforeEach(() => {
    loadFromStorage();
  });

  it("defaults to an empty cart when nothing is stored", () => {
    expect(cart).toEqual([]);
  });

  it("loads the cart from localStorage", () => {
    const storedCart = [
      { productId: "prod-1", quantity: 2, deliveryOptionId: "2" },
      { productId: "prod-2", quantity: 1, deliveryOptionId: "1" },
    ];
    localStorage.setItem("cart", JSON.stringify(storedCart));

    loadFromStorage();

    expect(cart).toEqual(storedCart);
  });

  it("ignores invalid stored values and starts empty", () => {
    localStorage.setItem("cart", "null");

    loadFromStorage();

    expect(cart).toEqual([]);
  });
});

describe("test suite: addToCart", () => {
  beforeEach(() => {
    loadFromStorage();
    spyOn(Storage.prototype, "setItem").and.callThrough();
  });

  it("adds a new product to the cart", () => {
    addToCart("prod-1", 3);

    expect(cart).toEqual([
      { productId: "prod-1", quantity: 3, deliveryOptionId: "1" },
    ]);
    expect(localStorage.setItem).toHaveBeenCalledOnceWith(
      "cart",
      JSON.stringify(cart),
    );
  });

  it("adds an existing product to the cart", () => {
    cart.push({ productId: "prod-1", quantity: 2, deliveryOptionId: "1" });

    addToCart("prod-1", 3);

    expect(cart.length).toEqual(1);
    expect(cart[0].quantity).toEqual(5);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it("keeps different products as separate cart items", () => {
    addToCart("prod-1", 1);
    addToCart("prod-2", 4);

    expect(cart.map((item) => item.productId)).toEqual(["prod-1", "prod-2"]);
    expect(cart[1].quantity).toEqual(4);
  });

  it("adds the selected quantity", () => {
    addToCart("prod-1", 10);

    expect(cart[0].quantity).toEqual(10);
  });
});

describe("test suite: removeFromCart", () => {
  beforeEach(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify([
        { productId: "prod-1", quantity: 2, deliveryOptionId: "1" },
        { productId: "prod-2", quantity: 1, deliveryOptionId: "2" },
      ]),
    );
    loadFromStorage();
    spyOn(Storage.prototype, "setItem").and.callThrough();
  });

  it("removes the matching product", () => {
    removeFromCart("prod-1");

    expect(cart).toEqual([
      { productId: "prod-2", quantity: 1, deliveryOptionId: "2" },
    ]);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it("does nothing when the product is not in the cart", () => {
    removeFromCart("missing");

    expect(cart.length).toEqual(2);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });
});

describe("test suite: updateQuantity", () => {
  beforeEach(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify([
        { productId: "prod-1", quantity: 2, deliveryOptionId: "1" },
      ]),
    );
    loadFromStorage();
    spyOn(Storage.prototype, "setItem").and.callThrough();
  });

  it("updates the quantity of an existing product", () => {
    const result = updateQuantity("prod-1", 7);

    expect(result).toBeTrue();
    expect(cart[0].quantity).toEqual(7);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it("accepts 0", () => {
    const result = updateQuantity("prod-1", 0);

    expect(result).toBeTrue();
    expect(cart[0].quantity).toEqual(0);
  });

  it("accepts 999", () => {
    const result = updateQuantity("prod-1", 999);

    expect(result).toBeTrue();
    expect(cart[0].quantity).toEqual(999);
  });

  it("rejects negative quantities", () => {
    spyOn(console, "log");

    const result = updateQuantity("prod-1", -1);

    expect(result).toBeFalse();
    expect(cart[0].quantity).toEqual(2);
    expect(console.log).toHaveBeenCalledWith(
      "Quantity must be between 0 and 999",
    );
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it("rejects quantities of 1000 or more", () => {
    spyOn(console, "log");

    const result = updateQuantity("prod-1", 1000);

    expect(result).toBeFalse();
    expect(cart[0].quantity).toEqual(2);
    expect(console.log).toHaveBeenCalledWith(
      "Quantity must be between 0 and 999",
    );
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it("returns false when the product is not in the cart", () => {
    spyOn(console, "log");

    const result = updateQuantity("missing", 3);

    expect(result).toBeFalse();
    expect(console.log).toHaveBeenCalledWith("Product not found in cart");
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
});

describe("test suite: updateDeliveryOption", () => {
  beforeEach(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify([
        { productId: "prod-1", quantity: 2, deliveryOptionId: "1" },
      ]),
    );
    loadFromStorage();
    spyOn(Storage.prototype, "setItem").and.callThrough();
  });

  it("updates the delivery option of an existing product", () => {
    updateDeliveryOption("prod-1", "3");

    expect(cart[0].deliveryOptionId).toEqual("3");
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it("does nothing when the product is not in the cart", () => {
    updateDeliveryOption("missing", "3");

    expect(cart[0].deliveryOptionId).toEqual("1");
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
});

describe("test suite: loadCartFetch", () => {
  it("returns the response text", async () => {
    spyOn(console, "log");
    spyOn(globalThis, "fetch").and.resolveTo(jsonResponse(["item"]));

    const result = await loadCartFetch();

    expect(globalThis.fetch).toHaveBeenCalledOnceWith(
      "https://supersimplebackend.dev/cart",
    );
    expect(result).toEqual(JSON.stringify(["item"]));
  });

  it("logs an error when the request fails", async () => {
    spyOn(console, "log");
    spyOn(globalThis, "fetch").and.rejectWith(new Error("network down"));

    const result = await loadCartFetch();

    expect(result).toBeUndefined();
    expect(console.log).toHaveBeenCalledWith(
      "Unexpected error. Try again later.",
    );
  });
});
