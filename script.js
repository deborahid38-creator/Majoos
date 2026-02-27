// ===== ELEMENTS =====
const cartCount = document.getElementById("cartCount");
const floatingCart = document.getElementById("floatingCart");
const cartItemsContainer = document.getElementById("cartItems");

// Items that cannot be delivered
const PICKUP_ONLY_KEYWORDS = ["spring rolls", "samosa", "chicken wings", "fruit salad"];

function isPickupOnly(name) {
  return PICKUP_ONLY_KEYWORDS.some(k => name.toLowerCase().includes(k));
}

function cartHasPickupOnlyItem() {
  return cart.some(item => isPickupOnly(item.name));
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ADD TO CART
function addToCart(name, price, image) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ name, price, image, quantity: 1 });
  }
  saveCart();
  updateCartUI();

  floatingCart.classList.add("pop");
  setTimeout(() => floatingCart.classList.remove("pop"), 220);
}

// INCREASE
function increaseQuantity(index) {
  cart[index].quantity++;
  saveCart();
  updateCartUI();
}

// DECREASE
function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  saveCart();
  updateCartUI();
}

// REMOVE
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartUI();
}

// CLEAR ALL
function clearCart() {
  if (!confirm("Clear your entire cart?")) return;
  cart = [];
  saveCart();
  updateCartUI();
}

// ===== UPDATE CART UI =====
function updateCartUI() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  cartCount.textContent = totalItems;
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
    document.getElementById("cartTotal").textContent = "0.00";
    return;
  }

  // Pickup-only notice banner inside cart
  if (cartHasPickupOnlyItem()) {
    const notice = document.createElement("div");
    notice.className = "cart-pickup-notice";
    notice.innerHTML = `🏪 <strong>Collection only</strong> — your order contains items that must be picked up.`;
    cartItemsContainer.appendChild(notice);
  }

  // Clear cart button
  const clearWrap = document.createElement("div");
  clearWrap.className = "clear-cart-wrap";
  clearWrap.innerHTML = `<button class="clear-cart-btn" onclick="clearCart()">Clear Cart</button>`;
  cartItemsContainer.appendChild(clearWrap);

  cart.forEach((item, index) => {
    const pickupFlag = isPickupOnly(item.name);
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}${pickupFlag ? ' <span class="cart-pickup-tag">Pickup</span>' : ''}</p>
        <p class="cart-item-price">£${item.price.toFixed(2)}</p>
        <div class="qty-controls">
          <button class="qty-btn" onclick="decreaseQuantity(${index})">−</button>
          <span class="qty-display">${item.quantity}</span>
          <button class="qty-btn" onclick="increaseQuantity(${index})">+</button>
        </div>
      </div>
      <button class="remove-item-btn" onclick="removeItem(${index})" title="Remove">✕</button>
    `;
    cartItemsContainer.appendChild(div);
  });

  document.getElementById("cartTotal").textContent = total.toFixed(2);
}

// ===== OPEN / CLOSE =====
document.getElementById("floatingCart").onclick = function () {
  document.getElementById("cartSidebar").classList.add("open");
};

document.getElementById("closeCart").onclick = function () {
  document.getElementById("cartSidebar").classList.remove("open");
};

document.getElementById("checkoutBtn").addEventListener("click", function () {
  window.location.href = "checkout.html";
});

// Init
updateCartUI();