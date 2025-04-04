const PRODUCTS = [{
    id: 1,
    name: "Laptop",
    price: 500
},
{
    id: 2,
    name: "Smartphone",
    price: 300
},
{
    id: 3,
    name: "Headphones",
    price: 100
},
{
    id: 4,
    name: "Smartwatch",
    price: 150
},
];

const FREE_GIFT = {
id: 99,
name: "Wireless Mouse",
price: 0
};
const THRESHOLD = 1000;

let cart = [];

function renderProducts() {
const productsContainer = document.getElementById('products');
productsContainer.innerHTML = PRODUCTS.map(product => `
    <div class="product-card">
        <h3>${product.name}</h3>
        <p>₹${product.price}</p>
        <button onclick="addToCart(${product.id})" class="btn btn-primary">
            Add to Cart
        </button>
    </div>
`).join('');
}

function addToCart(productId) {
const product = PRODUCTS.find(p => p.id === productId);
if (!product) return;

const existingItem = cart.find(item => item.id === product.id);
if (existingItem) {
    existingItem.quantity += 1;
} else {
    cart.push({
        ...product,
        quantity: 1
    });
}

updateCart();
}

function updateQuantity(productId, delta) {
const item = cart.find(item => item.id === productId);
if (!item) return;

item.quantity = Math.max(0, item.quantity + delta);
cart = cart.filter(item => item.quantity > 0);
updateCart();
}

function calculateSubtotal() {
return cart
    .filter(item => item.id !== FREE_GIFT.id)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function updateCart() {
const subtotal = calculateSubtotal();
const hasGift = cart.some(item => item.id === FREE_GIFT.id);

if (subtotal >= THRESHOLD && !hasGift) {
    cart.push({
        ...FREE_GIFT,
        quantity: 1
    });
} else if (subtotal < THRESHOLD && hasGift) {
    cart = cart.filter(item => item.id !== FREE_GIFT.id);
}

renderCart();
}

function renderCart() {
const subtotal = calculateSubtotal();
const progress = Math.min((subtotal / THRESHOLD) * 100, 100);

// Update subtotal
document.getElementById('subtotal').textContent = `₹${subtotal}`;

// Update progress container
const progressContainer = document.getElementById('progress-container');
if (subtotal < THRESHOLD) {
    progressContainer.innerHTML = `
        <div class="alert alert-info">
            <p>Add ₹${THRESHOLD - subtotal} more to get a FREE Wireless Mouse!</p>
            <div class="progress-bar">
                <div class="progress-bar-fill" style="width: ${progress}%"></div>
            </div>
        </div>
    `;
} else {
    progressContainer.innerHTML = `
        <div class="alert alert-success">
            You got a free Wireless Mouse!
        </div>
    `;
}

// Update cart items
const cartItems = document.getElementById('cart-items');
if (cart.length === 0) {
    cartItems.style.display = 'none';
    return;
}

cartItems.style.display = 'block';
const itemsContainer = cartItems.querySelector('.cart-items-list');
itemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
        <div class="item-info">
            <h4>${item.name}</h4>
            <p class="item-price">₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}</p>
        </div>
        ${item.id !== FREE_GIFT.id ? `
            <div class="quantity-controls">
                <button onclick="updateQuantity(${item.id}, -1)" class="btn-quantity btn-decrease">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
                <span class="quantity">${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)" class="btn-quantity btn-increase">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
            </div>
        ` : `
            <span class="free-gift-badge">FREE GIFT</span>
        `}
    </div>
`).join('');
}

// Initial render
renderProducts();
renderCart();