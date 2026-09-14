import { cart, addToCart } from "../data/cart.js";
import { products, loadProductsFetch } from "../data/products.js";

let searchTerm = "";

// ----- GET SEARCH FROM URL -----
function getSearchFromURL() {
  const url = new URL(window.location.href);
  return url.searchParams.get("search") || "";
}

// ----- FILTER PRODUCTS -----
function filterProducts(products, searchTerm) {
  if (!searchTerm) return products;

  const lowerSearch = searchTerm.toLowerCase();

  return products.filter((product) => {
    const nameMatch = product.name.toLowerCase().includes(lowerSearch);
    const keywordMatch = product.keywords.some((keyword) =>
      keyword.toLowerCase().includes(lowerSearch),
    );
    return nameMatch || keywordMatch;
  });
}

// ----- RENDER PRODUCTS -----
function renderProductsGrid() {
  searchTerm = getSearchFromURL();
  const filteredProducts = filterProducts(products, searchTerm);

  // Update search bar with current search
  const searchBar = document.querySelector(".search-bar");
  if (searchBar) {
    searchBar.value = searchTerm;
  }

  let productsHTML = "";

  filteredProducts.forEach((product) => {
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
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => `<option value="${n}">${n}</option>`).join("")}
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

  if (filteredProducts.length === 0) {
    document.querySelector(".js-products-grid").innerHTML = `
      <p style="text-align: center; padding: 40px;">No products found for "${searchTerm}"</p>
    `;
  }

  setupAddToCartButtons();
  updateCartQuantity();
}

// ----- SEARCH BAR -----
function setupSearch() {
  const searchButton = document.querySelector(".search-button");
  const searchBar = document.querySelector(".search-bar");

  function performSearch() {
    const searchValue = searchBar.value.trim();
    const url = new URL(window.location.href);
    if (searchValue) {
      url.searchParams.set("search", searchValue);
    } else {
      url.searchParams.delete("search");
    }
    window.location.href = url.toString();
  }

  searchButton.addEventListener("click", performSearch);

  searchBar.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      performSearch();
    }
  });
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
loadProductsFetch().then(() => {
  renderProductsGrid();
  setupSearch();
});
