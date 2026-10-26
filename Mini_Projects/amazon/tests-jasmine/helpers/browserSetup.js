import { jsonResponse, productFixtures } from "./fixtures.js";

// Browser equivalent of helpers/jsdom.js: reset the page between specs and
// provide a default fetch implementation so data modules never hit the network.
globalThis.fetch = async (input) => {
  const url = String(input);

  if (url.includes("/cart")) {
    return jsonResponse([]);
  }

  if (url.includes("/orders")) {
    return jsonResponse({ id: "order-from-backend", products: [] });
  }

  return jsonResponse(productFixtures);
};

const pageHarness = `
  <div class="amazon-header">
    <input class="search-bar" type="text" />
    <button class="search-button" type="button"></button>
    <div class="js-cart-quantity">0</div>
  </div>
  <div class="js-products-grid"></div>
  <div class="js-order-summary"></div>
  <div class="js-payment-summary"></div>
  <div class="js-checkout-item-count">0</div>
  <div class="orders-grid"></div>
  <div class="order-tracking"></div>
`;

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  window.history.replaceState({}, "", window.location.pathname);
  document.body.innerHTML = pageHarness;
});
