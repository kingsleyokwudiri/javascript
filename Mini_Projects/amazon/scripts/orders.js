import { orders } from "../data/orders.js";
import { getProduct } from "../data/products.js";
import { cart, addToCart } from "../data/cart.js";
import { formatCurrency } from "./utils/money.js";

function updateCartQuantity() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const el = document.querySelector(".js-cart-quantity");
  if (el) el.innerHTML = totalItems;
}

function renderOrders() {
  let ordersHTML = "";

  orders.forEach((order) => {
    const orderDate = new Date(order.orderTime);
    const dateString = orderDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });

    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${dateString}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCents)}</div>
            </div>
          </div>
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>

        <div class="order-details-grid">
          ${order.products
            .map((productData) => {
              const product = getProduct(productData.productId);
              if (!product) return ""; // skip missing products

              const deliveryDate = new Date(productData.estimatedDeliveryTime);
              const deliveryDateString = deliveryDate.toLocaleDateString(
                "en-US",
                { month: "long", day: "numeric" },
              );

              return `
              <div class="product-image-container">
                <img src="${product.image}" />
              </div>

              <div class="product-details">
                <div class="product-name">${product.name}</div>
                <div class="product-delivery-date">Arriving on: ${deliveryDateString}</div>
                <div class="product-quantity">Quantity: ${productData.quantity}</div>
                <button class="buy-again-button button-primary js-buy-again" data-product-id="${product.id}">
                  <img class="buy-again-icon" src="images/icons/buy-again.png" />
                  <span class="buy-again-message">Buy it again</span>
                </button>
              </div>

              <div class="product-actions">
                <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
                  <button class="track-package-button button-secondary">
                    Track package
                  </button>
                </a>
              </div>
            `;
            })
            .join("")}
        </div>
      </div>
    `;
  });

  document.querySelector(".orders-grid").innerHTML = ordersHTML;

  // Buy it again buttons
  document.querySelectorAll(".js-buy-again").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      addToCart(productId, 1);
      updateCartQuantity();
      alert("Added to cart!");
    });
  });
}

renderOrders();
updateCartQuantity();
