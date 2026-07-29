export let cart = JSON.parse(localStorage.getItem("cart"));

if (!cart) {
  cart = []; // Empty cart by default
}

export function addToCart(productId, quantity = 1) {
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
  // Validation: check if newQuantity is >= 0 and < 1000
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

// for localStorage
function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
