import { getOrder } from "../data/orders.js";
import { getProduct, loadProductsFetch } from "../data/products.js";

function renderTracking() {
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get("orderId");
  const productId = url.searchParams.get("productId");

  const trackingEl = document.querySelector(".order-tracking");

  // If URL params are missing, show a fallback
  if (!orderId || !productId) {
    trackingEl.innerHTML = `
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>
      <p>Invalid tracking link. Please go back to your orders.</p>
    `;
    return;
  }

  const order = getOrder(orderId);
  if (!order) {
    trackingEl.innerHTML = `
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>
      <p>Order not found.</p>
    `;
    return;
  }

  const productData = order.products.find((p) => p.productId === productId);
  if (!productData) {
    trackingEl.innerHTML = `
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>
      <p>Product not found in this order.</p>
    `;
    return;
  }

  const product = getProduct(productId);
  if (!product) {
    trackingEl.innerHTML = `
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>
      <p>Product no longer available.</p>
    `;
    return;
  }

  const currentTime = Date.now();
  const orderTime = order.orderTime;
  const deliveryTime = productData.estimatedDeliveryTime;

  // 18o: Calculate progress (0-100) with divide-by-zero guard
  let progress;
  if (deliveryTime <= orderTime) {
    progress = 100;
  } else if (currentTime >= deliveryTime) {
    progress = 100;
  } else if (currentTime <= orderTime) {
    progress = 0;
  } else {
    progress = ((currentTime - orderTime) / (deliveryTime - orderTime)) * 100;
  }

  // 18o: Determine status based on progress
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

  trackingEl.innerHTML = trackingHTML;
}

// Load products first, then render
loadProductsFetch().then(renderTracking);
