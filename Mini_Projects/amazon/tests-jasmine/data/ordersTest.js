import {
  addOrder,
  getOrder,
  loadOrders,
  orders,
} from "../../data/orders.js";

describe("test suite: orders", () => {
  beforeEach(() => {
    localStorage.setItem("orders", "[]");
    loadOrders();
    spyOn(Storage.prototype, "setItem").and.callThrough();
  });

  it("starts empty after loading an empty list", () => {
    expect(orders).toEqual([]);
  });

  it("adds an order and saves it to localStorage", () => {
    const order = { id: "order-1", totalCents: 1000, products: [] };

    addOrder(order);

    expect(orders).toEqual([order]);
    expect(localStorage.setItem).toHaveBeenCalledOnceWith(
      "orders",
      JSON.stringify([order]),
    );
  });

  it("keeps previously added orders", () => {
    addOrder({ id: "order-1" });
    addOrder({ id: "order-2" });

    expect(orders.map((order) => order.id)).toEqual(["order-1", "order-2"]);
    expect(localStorage.setItem).toHaveBeenCalledTimes(2);
  });

  it("loads saved orders from localStorage", () => {
    const saved = [{ id: "saved-1" }, { id: "saved-2" }];
    localStorage.setItem("orders", JSON.stringify(saved));

    loadOrders();

    expect(orders).toEqual(saved);
  });

  it("ignores stored data that is not an array", () => {
    localStorage.setItem("orders", JSON.stringify({ id: "not-an-array" }));

    loadOrders();

    expect(orders).toEqual([]);
  });

  it("keeps the current list when there is no saved data", () => {
    addOrder({ id: "order-1" });
    localStorage.removeItem("orders");

    loadOrders();

    expect(orders).toEqual([{ id: "order-1" }]);
  });

  it("finds an order by id", () => {
    const first = { id: "order-1" };
    const second = { id: "order-2" };
    addOrder(first);
    addOrder(second);

    expect(getOrder("order-2")).toBe(second);
    expect(getOrder("missing")).toBeUndefined();
  });
});
