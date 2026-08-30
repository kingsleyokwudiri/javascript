import { loadProductsFetch } from "../data/products.js";
import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";

// Load products using fetch, then render
loadProductsFetch().then(() => {
  renderOrderSummary();
  renderPaymentSummary();
});
