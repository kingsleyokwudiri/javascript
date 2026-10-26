import { loadOrders } from "../../data/orders.js";
import { loadProductsFetch } from "../../data/products.js";
import {
  jsonResponse,
  productFixtures,
} from "../helpers/fixtures.js";

const DAY = 24 * 60 * 60 * 1000;
const NOW = new Date("2026-10-26T12:00:00Z").getTime();

function makeTrackingOrder({
  orderId = "order-1",
  productId = "prod-socks",
  orderTime = NOW - DAY,
  deliveryTime = NOW + DAY,
} = {}) {
  return {
    id: orderId,
    orderTime,
    totalCents: 2180,
    products: [
      {
        productId,
        quantity: 2,
        estimatedDeliveryTime: deliveryTime,
      },
    ],
  };
}

describe("test suite: tracking page", () => {
  let trackingPage;
  const originalFetch = globalThis.fetch;

  beforeAll(async () => {
    globalThis.fetch = async () => jsonResponse(productFixtures);
    trackingPage = await import("../../scripts/tracking.js");
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
    spyOn(Date, "now").and.returnValue(NOW);
  });

  function setOrders(savedOrders) {
    localStorage.setItem("orders", JSON.stringify(savedOrders));
    loadOrders();
  }

  function setTrackingUrl(orderId = "order-1", productId = "prod-socks") {
    window.history.replaceState(
      {},
      "",
      `/tracking.html?orderId=${orderId}&productId=${productId}`,
    );
  }

  describe("calculateProgress", () => {
    it("returns 100 when the delivery time is at or before the order time", () => {
      expect(trackingPage.calculateProgress(NOW, NOW, NOW)).toEqual(100);
      expect(trackingPage.calculateProgress(NOW, NOW - 1, NOW)).toEqual(100);
    });

    it("returns 100 once the delivery time has passed", () => {
      expect(trackingPage.calculateProgress(NOW - DAY, NOW - 1, NOW)).toEqual(
        100,
      );
    });

    it("returns 0 at or before the order time", () => {
      expect(trackingPage.calculateProgress(NOW, NOW + DAY, NOW)).toEqual(0);
      expect(trackingPage.calculateProgress(NOW + 1, NOW + DAY, NOW)).toEqual(0);
    });

    it("calculates a percentage between the two times", () => {
      expect(
        trackingPage.calculateProgress(NOW - DAY, NOW + DAY, NOW),
      ).toEqual(50);
      expect(
        trackingPage.calculateProgress(NOW - DAY, NOW + 3 * DAY, NOW),
      ).toEqual(25);
    });
  });

  describe("getTrackingStatus", () => {
    it("is Preparing below 50%", () => {
      expect(trackingPage.getTrackingStatus(0)).toEqual("Preparing");
      expect(trackingPage.getTrackingStatus(49.9)).toEqual("Preparing");
    });

    it("is Shipped from 50% up to 100%", () => {
      expect(trackingPage.getTrackingStatus(50)).toEqual("Shipped");
      expect(trackingPage.getTrackingStatus(99.9)).toEqual("Shipped");
    });

    it("is Delivered at 100% or more", () => {
      expect(trackingPage.getTrackingStatus(100)).toEqual("Delivered");
      expect(trackingPage.getTrackingStatus(150)).toEqual("Delivered");
    });
  });

  describe("renderTracking", () => {
    it("shows an error when URL parameters are missing", () => {
      window.history.replaceState({}, "", "/tracking.html");

      trackingPage.renderTracking();

      expect(document.querySelector(".order-tracking").textContent).toContain(
        "Invalid tracking link",
      );
    });

    it("shows an error when the order does not exist", () => {
      setOrders([]);
      setTrackingUrl("missing-order", "prod-socks");

      trackingPage.renderTracking();

      expect(document.querySelector(".order-tracking").textContent).toContain(
        "Order not found",
      );
    });

    it("shows an error when the product is not part of the order", () => {
      setOrders([makeTrackingOrder()]);
      setTrackingUrl("order-1", "prod-basketball");

      trackingPage.renderTracking();

      expect(document.querySelector(".order-tracking").textContent).toContain(
        "Product not found in this order",
      );
    });

    it("shows an error when the product no longer exists", () => {
      setOrders([makeTrackingOrder({ productId: "missing-product" })]);
      setTrackingUrl("order-1", "missing-product");

      trackingPage.renderTracking();

      expect(document.querySelector(".order-tracking").textContent).toContain(
        "Product no longer available",
      );
    });

    it("renders the product and delivery information", () => {
      setOrders([makeTrackingOrder()]);
      setTrackingUrl();

      trackingPage.renderTracking();

      const tracking = document.querySelector(".order-tracking");
      expect(tracking.textContent).toContain(
        "Black and Gray Athletic Cotton Socks",
      );
      expect(tracking.textContent).toContain("Quantity: 2");
      expect(tracking.textContent).toContain("Arriving on");
      expect(tracking.querySelector(".product-image").getAttribute("src")).toEqual(
        "images/products/athletic-cotton-socks-6-pairs.jpg",
      );
    });

    it("marks Preparing as the current status below 50%", () => {
      setOrders([
        makeTrackingOrder({
          orderTime: NOW - DAY,
          deliveryTime: NOW + 3 * DAY,
        }),
      ]);
      setTrackingUrl();

      trackingPage.renderTracking();

      const labels = document.querySelectorAll(".progress-label");
      expect(labels[0].classList).toContain("current-status");
      expect(labels[1].classList).not.toContain("current-status");
      expect(
        document.querySelector(".progress-bar").style.width,
      ).toEqual("25%");
    });

    it("marks Shipped as the current status from 50%", () => {
      setOrders([
        makeTrackingOrder({
          orderTime: NOW - 2 * DAY,
          deliveryTime: NOW + 2 * DAY,
        }),
      ]);
      setTrackingUrl();

      trackingPage.renderTracking();

      const labels = document.querySelectorAll(".progress-label");
      expect(labels[0].classList).not.toContain("current-status");
      expect(labels[1].classList).toContain("current-status");
      expect(
        document.querySelector(".progress-bar").style.width,
      ).toEqual("50%");
    });

    it("marks Delivered as the current status at 100%", () => {
      setOrders([
        makeTrackingOrder({
          orderTime: NOW - 2 * DAY,
          deliveryTime: NOW - DAY,
        }),
      ]);
      setTrackingUrl();

      trackingPage.renderTracking();

      const labels = document.querySelectorAll(".progress-label");
      expect(labels[2].classList).toContain("current-status");
      expect(
        document.querySelector(".progress-bar").style.width,
      ).toEqual("100%");
    });

    it("includes a link back to the orders page", () => {
      setOrders([makeTrackingOrder()]);
      setTrackingUrl();

      trackingPage.renderTracking();

      expect(
        document.querySelector(".back-to-orders-link").getAttribute("href"),
      ).toEqual("orders.html");
    });
  });
});
