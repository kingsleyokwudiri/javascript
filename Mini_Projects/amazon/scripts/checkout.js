import { cart, removeFromCart, updateQuantity } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

const today = dayjs();
const deliveryDate = today.add(7, "days");
deliveryDate.format("dddd, MMMM D");

// ../ and ./ are for files that are out of the folder
//  and in the same folder respectively

// Calculate total quantity in cart
function updateCheckoutItemCount() {
  let totalItems = 0;
  cart.forEach((cartItem) => {
    totalItems += cartItem.quantity;
  });
  const countElement = document.querySelector(".js-checkout-item-count");
  if (countElement) {
    countElement.textContent = totalItems;
  }
}

let cartSummaryHTML = "";

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;
  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });
  cartSummaryHTML += `
  <div class="cart-item-container 
  js-cart-item-container-${matchingProduct.id}">
    <div class="delivery-date">Delivery date: Tuesday, June 21</div>

    <div class="cart-item-details-grid">
      <img
        class="product-image"
        src="${matchingProduct.image}"
      />

      <div class="cart-item-details">
        <div class="product-name">
          ${matchingProduct.name}
        </div>
        <div class="product-price">
          $${formatCurrency(matchingProduct.priceCents)}
        </div>
        <div class="product-quantity">
          <span> Quantity: <span class="quantity-label">${cartItem.quantity}</span> </span>
          <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
            Update
          </span>
          <input class="quantity-input" type="number" value="${cartItem.quantity}" min="0" max="999" />
          <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">
            Save
          </span>
          <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
            Delete
          </span>
        </div>
      </div>

      <div class="delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>
        <div class="delivery-option">
          <input
            type="radio"
            checked
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}"
          />
          <div>
            <div class="delivery-option-date">Tuesday, June 21</div>
            <div class="delivery-option-price">FREE Shipping</div>
          </div>
        </div>
        <div class="delivery-option">
          <input
            type="radio"
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}"
          />
          <div>
            <div class="delivery-option-date">Wednesday, June 15</div>
            <div class="delivery-option-price">$4.99 - Shipping</div>
          </div>
        </div>
        <div class="delivery-option">
          <input
            type="radio"
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}"
          />
          <div>
            <div class="delivery-option-date">Monday, June 13</div>
            <div class="delivery-option-price">$9.99 - Shipping</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
});

function deliveryOptionsHTML() {}

document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

// Update checkout item count
updateCheckoutItemCount();

// Update link functionality
document.querySelectorAll(".js-update-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    const container = document.querySelector(
      `.js-cart-item-container-${productId}`,
    );
    container.classList.add("is-editing-quantity");

    // Focus the input field when entering edit mode
    const quantityInput = container.querySelector(".quantity-input");
    quantityInput.focus();
    quantityInput.select(); // Select the text for easy editing
  });
});

// Helper function to handle saving quantity
function handleSaveQuantity(productId) {
  const container = document.querySelector(
    `.js-cart-item-container-${productId}`,
  );

  // Get the new quantity from the input
  const quantityInput = container.querySelector(".quantity-input");
  const newQuantity = Number(quantityInput.value);

  // Check if it's a valid number
  if (isNaN(newQuantity)) {
    alert("Please enter a valid number");
    return;
  }

  // Try to update the quantity
  const success = updateQuantity(productId, newQuantity);

  if (success) {
    // Update the quantity label
    const quantityLabel = container.querySelector(".quantity-label");
    quantityLabel.textContent = newQuantity;

    // Remove editing mode
    container.classList.remove("is-editing-quantity");

    // Update the cart quantity in the header
    updateCheckoutItemCount();
  } else {
    // If validation failed, show an error
    if (newQuantity < 0) {
      alert("Quantity cannot be negative");
    } else if (newQuantity >= 1000) {
      alert("Quantity must be less than 1000");
    }
    // Reset the input to the current quantity
    const currentQuantity = Number(quantityLabel.textContent);
    quantityInput.value = currentQuantity;
  }
}

// Save link functionality
document.querySelectorAll(".js-save-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    const productId = link.dataset.productId;
    handleSaveQuantity(productId);
  });
});

// Keyboard support: Press Enter to save
document.querySelectorAll(".quantity-input").forEach((input) => {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      const container = input.closest(".cart-item-container");
      const saveLink = container.querySelector(".js-save-link");
      const productId = saveLink.dataset.productId;
      handleSaveQuantity(productId);
    }
  });

  // Also handle Escape key to cancel editing
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const container = input.closest(".cart-item-container");
      const productId =
        container.querySelector(".js-save-link").dataset.productId;
      const quantityLabel = container.querySelector(".quantity-label");
      // Reset input to current quantity and exit edit mode
      input.value = quantityLabel.textContent;
      container.classList.remove("is-editing-quantity");
    }
  });
});

// Delete link functionality
document.querySelectorAll(".js-delete-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);
    const container = document.querySelector(
      `.js-cart-item-container-${productId}`,
    );
    container.remove();
    // Update the item count after deletion
    updateCheckoutItemCount();
  });
});
