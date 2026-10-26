import { JSDOM, VirtualConsole } from "jsdom";
import { jsonResponse, productFixtures } from "./fixtures.js";

// The Amazon project is browser-first. Give Jasmine a browser-like environment
// (document, localStorage, URL, etc.) before any spec imports application code.
// The virtual console is intentionally left without listeners so jsdom's
// "navigation not implemented" noise does not pollute the test output.
const virtualConsole = new VirtualConsole();
const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
  pretendToBeVisual: true,
  virtualConsole,
});

const { window } = dom;

function defineGlobal(name, value) {
  Object.defineProperty(globalThis, name, {
    value,
    configurable: true,
    writable: true,
  });
}

defineGlobal("window", window);
defineGlobal("document", window.document);
defineGlobal("localStorage", window.localStorage);
defineGlobal("sessionStorage", window.sessionStorage);
defineGlobal("navigator", window.navigator);
defineGlobal("HTMLElement", window.HTMLElement);
defineGlobal("HTMLInputElement", window.HTMLInputElement);
defineGlobal("Node", window.Node);
defineGlobal("Event", window.Event);
defineGlobal("MouseEvent", window.MouseEvent);
defineGlobal("KeyboardEvent", window.KeyboardEvent);
defineGlobal("XMLHttpRequest", window.XMLHttpRequest);
defineGlobal("Storage", window.Storage);

window.alert = () => {};
window.confirm = () => true;
defineGlobal("alert", window.alert);
defineGlobal("confirm", window.confirm);

// A safe default fetch so modules that load data at import time never hit the
// network. Individual specs replace this with their own spies.
defineGlobal("fetch", async (input) => {
  const url = String(input);

  if (url.includes("/cart")) {
    return jsonResponse([]);
  }

  if (url.includes("/orders")) {
    return jsonResponse({ id: "order-from-backend", products: [] });
  }

  return jsonResponse(productFixtures);
});

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
  window.localStorage.clear();
  window.sessionStorage.clear();
  window.history.replaceState({}, "", "/");
  window.document.body.innerHTML = pageHarness;
});
