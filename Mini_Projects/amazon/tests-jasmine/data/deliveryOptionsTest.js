import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";

describe("test suite: delivery options", () => {
  it("exposes the three delivery options", () => {
    expect(deliveryOptions.length).toEqual(3);
    expect(deliveryOptions.map((option) => option.id)).toEqual(["1", "2", "3"]);
  });

  it("has the expected days and prices", () => {
    expect(deliveryOptions).toEqual([
      { id: "1", deliveryDays: 7, priceCents: 0 },
      { id: "2", deliveryDays: 3, priceCents: 499 },
      { id: "3", deliveryDays: 1, priceCents: 999 },
    ]);
  });

  it("finds a delivery option by id", () => {
    expect(getDeliveryOption("2")).toEqual(deliveryOptions[1]);
    expect(getDeliveryOption("3")).toEqual(deliveryOptions[2]);
  });

  it("falls back to the first option for an unknown id", () => {
    expect(getDeliveryOption("does-not-exist")).toEqual(deliveryOptions[0]);
    expect(getDeliveryOption(undefined)).toEqual(deliveryOptions[0]);
    expect(getDeliveryOption(null)).toEqual(deliveryOptions[0]);
  });
});
