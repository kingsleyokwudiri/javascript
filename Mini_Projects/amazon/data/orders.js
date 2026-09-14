export let orders = [];

export function addOrder(order) {
  orders.push(order);
  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem("orders", JSON.stringify(orders));
}

export function loadOrders() {
  const storedOrders = localStorage.getItem("orders");
  if (storedOrders) {
    orders = JSON.parse(storedOrders);
  }
}

export function getOrder(orderId) {
  return orders.find((order) => order.id === orderId);
}

loadOrders();
