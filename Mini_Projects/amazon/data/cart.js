export let cart;

loadFromStorage();

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem("cart"));

  if (!cart) {
    cart = [];
  }
}

// ----- LOAD CART FROM BACKEND -----
export async function loadCartFetch() {
  try {
    const response = await fetch("https://supersimplebackend.dev/cart");
    const text = await response.text();
    console.log(text); // Log the response text
  } catch (error) {
    console.log("Unexpected error. Try again later.");
  }
}

// ----- CART FUNCTIONS -----
export function addToCart(productId, quantity) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId: productId,
      quantity: quantity,
      deliveryOptionId: "1",
    });
  }
  saveToStorage();
}

export function removeFromCart(productId) {
  const newCart = [];
  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });
  cart = newCart;
  saveToStorage();
}

export function updateQuantity(productId, newQuantity) {
  if (newQuantity < 0 || newQuantity >= 1000) {
    console.log("Quantity must be between 0 and 999");
    return false;
  }

  let found = false;
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      cartItem.quantity = newQuantity;
      found = true;
    }
  });

  if (!found) {
    console.log("Product not found in cart");
    return false;
  }

  saveToStorage();
  return true;
}

function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });
  if (matchingItem) {
    matchingItem.deliveryOptionId = deliveryOptionId;
    saveToStorage();
  }
}
