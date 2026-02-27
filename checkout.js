// ===== SELECT ELEMENTS =====
const cartCount = document.getElementById("cartCount");
const floatingCart = document.getElementById("floatingCart");
const cartSidebar = document.getElementById("cartSidebar");
const cartItemsContainer = document.getElementById("cartItems");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===== SAVE TO LOCALSTORAGE =====
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ADD TO CART
function addToCart(name, price, image) {
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name, price, image, quantity: 1 });
  }
  saveCart();
  updateCartUI();

  floatingCart.classList.add("pop");
  setTimeout(() => floatingCart.classList.remove("pop"), 200);
}

// INCREASE QUANTITY
function increaseQuantity(index) {
  cart[index].quantity++;
  saveCart();
  updateCartUI();
}

// DECREASE QUANTITY
function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  saveCart();
  updateCartUI();
}

// REMOVE ITEM COMPLETELY
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartUI();
}

// CLEAR ENTIRE CART
function clearCart() {
  if (!confirm("Are you sure you want to clear your cart?")) return;
  cart = [];
  saveCart();
  updateCartUI();
}

// UPDATE UI
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

  // Clear cart button at top
  const clearBtnWrap = document.createElement("div");
  clearBtnWrap.className = "clear-cart-wrap";
  clearBtnWrap.innerHTML = `<button class="clear-cart-btn" onclick="clearCart()">Clear Cart</button>`;
  cartItemsContainer.appendChild(clearBtnWrap);

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
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

// ===== OPEN / CLOSE CART =====
document.getElementById("floatingCart").onclick = function () {
  document.getElementById("cartSidebar").classList.add("open");
};

document.getElementById("closeCart").onclick = function () {
  document.getElementById("cartSidebar").classList.remove("open");
};

// ===== CHECKOUT =====
document.getElementById("checkoutBtn").addEventListener("click", function () {
  window.location.href = "checkout.html";
});

// Init on load
updateCartUI();