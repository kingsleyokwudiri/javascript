import {
  cart,
  removeFromCart,
  updateQuantity,
  updateDeliveryOption,
} from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

// ../ and ./ are for files that are out of the folder
// and in the same folder respectively

export function renderOrderSummary() {
  // Calculate total quantity in cart
  function updateCheckoutItemCount() {
    let totalItems = 0;
    // Loop through each cart item and add up quantities
    cart.forEach((cartItem) => {
      totalItems += cartItem.quantity;
    });
    const countElement = document.querySelector(".js-checkout-item-count");
    if (countElement) {
      countElement.textContent = totalItems;
    }
  }

  // Function to generate delivery options HTML for a specific product
  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = "";
    // Loop through all available delivery options
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      // Calculate delivery date based on delivery days
      const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
      const dateString = deliveryDate.format("dddd, MMMM D");
      // Ternary operator: if price is 0, show "FREE Shipping", otherwise show price with $ sign
      const priceString =
        deliveryOption.priceCents === 0
          ? "FREE Shipping"
          : `$${formatCurrency(deliveryOption.priceCents)} - Shipping`;

      // Check if this delivery option matches the one saved in the cart
      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      // Build HTML for each delivery option
      html += `
      <div class="delivery-option js-delivery-option"
      data-product-id="${matchingProduct.id}"
      data-delivery-option-id="${deliveryOption.id}">
        <input 
          type="radio"
          ${isChecked ? "checked" : ""}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}"
        />
        <div>
          <div class="delivery-option-date">${dateString}</div>
          <div class="delivery-option-price">${priceString}</div>
        </div>
      </div>
    `;
    });
    return html;
  }

  let cartSummaryHTML = "";

  // Loop through each item in the cart to build the order summary
  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    // Find the matching product details from the products array
    let matchingProduct = getProduct(productId);

    // Find the saved delivery option for this cart item
    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    // Calculate and format the delivery date
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    // Generate delivery options HTML for this product
    const deliveryOptionsHTMLString = deliveryOptionsHTML(
      matchingProduct,
      cartItem,
    );

    // Build the HTML for each cart item
    cartSummaryHTML += `
    <div class="cart-item-container 
    js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">Delivery date: ${dateString}</div>

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
          ${deliveryOptionsHTMLString}
        </div>
      </div>
    </div>
    `;
  });

  // Insert the generated HTML into the page
  const orderSummaryElement = document.querySelector(".js-order-summary");
  orderSummaryElement.innerHTML = cartSummaryHTML;
  // Update checkout item count in the header
  updateCheckoutItemCount();

  // Update link functionality - when clicked, enters editing mode
  document.querySelectorAll(".js-update-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`,
      );
      // Add CSS class to show the input field
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
    const quantityLabel = container.querySelector(".quantity-label");
    const newQuantity = Number(quantityInput.value);

    // Check if it's a valid number
    if (isNaN(newQuantity)) {
      alert("Please enter a valid number");
      return;
    }

    // Try to update the quantity in the cart
    const success = updateQuantity(productId, newQuantity);

    if (success) {
      // Update the quantity label
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
      quantityInput.value = quantityLabel.textContent;
    }
    renderPaymentSummary();
  }

  // Save link functionality - saves the new quantity
  document.querySelectorAll(".js-save-link").forEach((link) => {
    link.addEventListener("click", () => {
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

  // Delete link functionality - removes item from cart
  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`,
      );
      container.remove(); // Remove the item from the DOM
      // Update the item count after deletion
      updateCheckoutItemCount();
      renderPaymentSummary();
    });
  });

  // Delivery option functionality - updates delivery option for a product
  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      // Destructure dataset to get productId and deliveryOptionId
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary(); // Re-render to reflect the change
      renderPaymentSummary();
    });
  });
}
