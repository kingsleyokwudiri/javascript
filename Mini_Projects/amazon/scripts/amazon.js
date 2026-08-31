import { cart, addToCart } from "../data/cart.js";
import { products, loadProductsFetch } from "../data/products.js";

// ----- RENDER PRODUCTS -----
function renderProductsGrid() {
  let productsHTML = "";

  products.forEach((product) => {
    productsHTML += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image" src="${product.image}" />
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars" src="${product.getStarsUrl()}" />
          <div class="product-rating-count link-primary">${product.rating.count}</div>
        </div>

        <div class="product-price">${product.getPrice()}</div>

        <div class="product-quantity-container">
          <select class="js-quantity-select" data-product-id="${product.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        ${product.extraInfoHTML()}

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart-${product.id}">
          <img src="images/icons/checkmark.png" />
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
  });

  document.querySelector(".js-products-grid").innerHTML = productsHTML;
  setupAddToCartButtons();
  updateCartQuantity();
}

// ----- CART QUANTITY -----
function updateCartQuantity() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelector(".js-cart-quantity").innerHTML = totalItems;
}

// ----- ADD TO CART BUTTONS -----
const addedMessageTimeouts = {};

function setupAddToCartButtons() {
  document.querySelectorAll(".js-add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      const quantitySelector = document.querySelector(
        `.js-quantity-select[data-product-id="${productId}"]`,
      );
      const quantity = Number(quantitySelector.value);

      addToCart(productId, quantity);
      updateCartQuantity();
      showAddedMessage(productId);
    });
  });
}

function showAddedMessage(productId) {
  const message = document.querySelector(`.js-added-to-cart-${productId}`);
  message.classList.add("added-to-cart-visible");

  if (addedMessageTimeouts[productId]) {
    clearTimeout(addedMessageTimeouts[productId]);
  }

  addedMessageTimeouts[productId] = setTimeout(() => {
    message.classList.remove("added-to-cart-visible");
    delete addedMessageTimeouts[productId];
  }, 2000);
}

// ----- INITIALIZE -----
loadProductsFetch().then(renderProductsGrid);
