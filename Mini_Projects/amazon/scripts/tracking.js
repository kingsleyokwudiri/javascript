import { getOrder } from "../data/orders.js";
import { getProduct } from "../data/products.js";

function renderTracking() {
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get("orderId");
  const productId = url.searchParams.get("productId");

  if (!orderId || !productId) {
    document.querySelector(".order-tracking").innerHTML = `
      <p>Invalid tracking link. Please go back to your orders.</p>
    `;
    return;
  }

  const order = getOrder(orderId);
  if (!order) {
    document.querySelector(".order-tracking").innerHTML = `
      <p>Order not found.</p>
    `;
    return;
  }

  const productData = order.products.find((p) => p.productId === productId);
  if (!productData) {
    document.querySelector(".order-tracking").innerHTML = `
      <p>Product not found in this order.</p>
    `;
    return;
  }

  const product = getProduct(productId);
  if (!product) {
    document.querySelector(".order-tracking").innerHTML = `
      <p>Product no longer available.</p>
    `;
    return;
  }

  const currentTime = Date.now();
  const orderTime = order.orderTime;
  const deliveryTime = productData.estimatedDeliveryTime;

  // Calculate progress (0-100), guard against bad data
  let progress = 0;
  if (deliveryTime <= orderTime) {
    progress = 100;
  } else if (currentTime < orderTime) {
    progress = 0;
  } else if (currentTime >= deliveryTime) {
    progress = 100;
  } else {
    progress = ((currentTime - orderTime) / (deliveryTime - orderTime)) * 100;
  }

  // Determine status based on progress
  let status = "Preparing";
  if (progress >= 50 && progress < 100) {
    status = "Shipped";
  } else if (progress >= 100) {
    status = "Delivered";
  }

  const deliveryDate = new Date(deliveryTime);
  const deliveryDateString = deliveryDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const trackingHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">Arriving on ${deliveryDateString}</div>

    <div class="product-info">${product.name}</div>
    <div class="product-info">Quantity: ${productData.quantity}</div>

    <img class="product-image" src="${product.image}" />

    <div class="progress-labels-container">
      <div class="progress-label ${status === "Preparing" ? "current-status" : ""}">Preparing</div>
      <div class="progress-label ${status === "Shipped" ? "current-status" : ""}">Shipped</div>
      <div class="progress-label ${status === "Delivered" ? "current-status" : ""}">Delivered</div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${progress}%;"></div>
    </div>
  `;

  document.querySelector(".order-tracking").innerHTML = trackingHTML;
}

renderTracking();
