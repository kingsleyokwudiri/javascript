import {
  Cart,
  businessCart,
  cart as defaultCart,
} from "../../data/cart-oop.js";

const DEFAULT_ITEMS = [
  {
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 2,
    deliveryOptionId: "1",
  },
  {
    productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity: 1,
    deliveryOptionId: "2",
  },
];

describe("test suite: object-oriented Cart factory", () => {
  let testCart;

  beforeEach(() => {
    testCart = Cart("test-oop-cart");
    testCart.loadFromStorage();
  });

  it("starts without items until loadFromStorage is called", () => {
    const cart = Cart("not-loaded");

    expect(cart.cartItems).toBeUndefined();
  });

  it("loads the default cart when storage is empty", () => {
    expect(testCart.cartItems).toEqual(DEFAULT_ITEMS);
  });

  it("loads an existing cart from its localStorage key", () => {
    const stored = [
      { productId: "prod-1", quantity: 4, deliveryOptionId: "3" },
    ];
    localStorage.setItem("test-oop-cart", JSON.stringify(stored));

    const loadedCart = Cart("test-oop-cart");
    loadedCart.loadFromStorage();

    expect(loadedCart.cartItems).toEqual(stored);
  });

  it("saves to its own localStorage key", () => {
    spyOn(Storage.prototype, "setItem").and.callThrough();

    testCart.saveToStorage();

    expect(localStorage.setItem).toHaveBeenCalledOnceWith(
      "test-oop-cart",
      JSON.stringify(DEFAULT_ITEMS),
    );
  });

  it("adds a new product", () => {
    spyOn(Storage.prototype, "setItem").and.callThrough();

    testCart.addToCart("prod-new", 3);

    expect(testCart.cartItems).toContain({
      productId: "prod-new",
      quantity: 3,
      deliveryOptionId: "1",
    });
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it("increases the quantity of an existing product", () => {
    spyOn(Storage.prototype, "setItem").and.callThrough();

    testCart.addToCart(DEFAULT_ITEMS[0].productId, 5);

    expect(testCart.cartItems[0].quantity).toEqual(7);
  });

  it("removes a product", () => {
    spyOn(Storage.prototype, "setItem").and.callThrough();

    testCart.removeFromCart(DEFAULT_ITEMS[0].productId);

    expect(testCart.cartItems).toEqual([DEFAULT_ITEMS[1]]);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it("updates a quantity", () => {
    spyOn(Storage.prototype, "setItem").and.callThrough();

    const result = testCart.updateQuantity(DEFAULT_ITEMS[0].productId, 9);

    expect(result).toBeTrue();
    expect(testCart.cartItems[0].quantity).toEqual(9);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid quantities", () => {
    spyOn(console, "log");
    spyOn(Storage.prototype, "setItem").and.callThrough();

    expect(testCart.updateQuantity(DEFAULT_ITEMS[0].productId, -1)).toBeFalse();
    expect(testCart.updateQuantity(DEFAULT_ITEMS[0].productId, 1000)).toBeFalse();
    expect(testCart.cartItems[0].quantity).toEqual(2);
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it("returns false when updating a missing product", () => {
    spyOn(console, "log");
    spyOn(Storage.prototype, "setItem").and.callThrough();

    expect(testCart.updateQuantity("missing", 2)).toBeFalse();
    expect(console.log).toHaveBeenCalledWith("Product not found in cart");
  });

  it("updates a delivery option", () => {
    spyOn(Storage.prototype, "setItem").and.callThrough();

    testCart.updateDeliveryOption(DEFAULT_ITEMS[0].productId, "3");

    expect(testCart.cartItems[0].deliveryOptionId).toEqual("3");
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it("keeps separate carts for separate localStorage keys", () => {
    const otherCart = Cart("other-oop-cart");
    otherCart.loadFromStorage();

    expect(defaultCart.cartItems).toEqual(DEFAULT_ITEMS);
    expect(businessCart.cartItems).toEqual(DEFAULT_ITEMS);
    expect(otherCart.cartItems).toEqual(DEFAULT_ITEMS);
    expect(otherCart).not.toBe(defaultCart);
    expect(otherCart.cartItems).not.toBe(defaultCart.cartItems);
  });
});
