// uses an empty array by default if there is nothing in local storage
export const orders = JSON.parse(localStorage.getItem("orders")) || [];

export function addOrder(order) {
  // adds new orders to the front of the array
  orders.unshift(order);
  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem("orders", JSON.stringify(orders));
}
