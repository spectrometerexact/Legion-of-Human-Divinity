// Shopping Cart Functions
let cart = [];

function addToCart(product) {
    let existing = cart.find(i => i.id === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
    saveCart();
}

function removeFromCart(id) {
    let idx = cart.findIndex(i => i.id === id);
    if (idx !== -1) {
        if (cart[idx].quantity > 1) {
            cart[idx].quantity--;
        } else {
            cart.splice(idx, 1);
        }
        updateCartUI();
        saveCart();
    }
}

function updateCartUI() {
    let container = document.getElementById('cartItemsList');
    let totalSpan = document.getElementById('cartTotalDisplay');
    let badge = document.getElementById('cartCountBadge');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart">Your cart is empty ✨</div>';
        totalSpan.innerText = '$0.00';
        if (badge) badge.innerText = '0';
        return;
    }
    
    let totalItems = 0, totalPrice = 0, html = '';
    cart.forEach(item => {
        let tot = item.price * item.quantity;
        totalItems += item.quantity;
        totalPrice += tot;
        html += `<div class="cart-item">
                    <span><strong>${escapeHtml(item.name)}</strong> x${item.quantity}</span>
                    <span>$${tot.toFixed(2)} 
                        <button class="remove-item-btn" data-id="${item.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </span>
                </div>`;
    });
    
    container.innerHTML = html;
    totalSpan.innerText = `$${totalPrice.toFixed(2)}`;
    if (badge) badge.innerText = totalItems;
    
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id)));
    });
}

function saveCart() {
    localStorage.setItem('hopeful_cart', JSON.stringify(cart));
}

function loadCart() {
    let saved = localStorage.getItem('hopeful_cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartUI();
    }
}
