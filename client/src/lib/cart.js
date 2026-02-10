function notifyCartChanged() {
  window.dispatchEvent(new Event("dressup_cart_changed"));
}


const KEY = "dressup_cart_v1";

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function setCart(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
  notifyCartChanged();
}

export function addToCart(item) {
  // item: { productId, title, price, image, size, qty }
  const cart = getCart();

  const existingIndex = cart.findIndex(
    (x) => x.productId === item.productId && x.size === item.size
  );

  if (existingIndex >= 0) {
    cart[existingIndex].qty += item.qty;
  } else {
    cart.push(item);
  }

  setCart(cart);
  return cart;
}

export function removeFromCart(productId, size) {
  const cart = getCart().filter((x) => !(x.productId === productId && x.size === size));
  setCart(cart);
  return cart;
}

export function updateQty(productId, size, qty) {
  const cart = getCart().map((x) => {
    if (x.productId === productId && x.size === size) return { ...x, qty };
    return x;
  });
  setCart(cart);
  return cart;
}

export function clearCart() {
  setCart([]);
  notifyCartChanged();
}
