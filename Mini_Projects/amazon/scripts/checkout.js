import { cart } from "../data/cart.js";
import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
// import "../data/cart-class.js";

// Call the function to render the order summary
renderOrderSummary();
renderPaymentSummary();
