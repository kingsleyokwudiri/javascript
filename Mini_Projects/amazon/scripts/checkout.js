import { loadProductsFetch } from "../data/products.js";
import { loadCartFetch } from "../data/cart.js";
import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";

async function loadPage() {
  // Run both fetches at the same time using Promise.all
  await Promise.all([loadProductsFetch(), loadCartFetch()]);

  renderOrderSummary();
  renderPaymentSummary();
}

loadPage();
