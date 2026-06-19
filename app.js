// ================= CART STORAGE =================

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// ================= LOGIN STATUS =================

function isLoggedIn() {
    return localStorage.getItem("loggedIn") === "true";
}

// ================= ADD TO CART =================

function addToCart(name, price) {

    let cart = getCart();

    let item = cart.find(x => x.name === name);

    if (item) {
        item.qty++;
    } else {
        cart.push({ name, price, qty: 1 });
    }

    saveCart(cart);
    updateCount();

    let msg = document.getElementById("msg");
    if (msg) {
        msg.style.display = "block";
        setTimeout(() => msg.style.display = "none", 2000);
    }
}

// ================= CART COUNT =================

function updateCount() {
    let cart = getCart();
    let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

    let count = document.getElementById("count");
    if (count) count.innerText = totalQty;
}

// ================= LOGOUT =================

function logout() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("cart");
    window.location.href = "login.html";
}

// ================= LOAD CART =================

function loadCart() {

    let cart = getCart();
    let div = document.getElementById("cart");
    if (!div) return;

    let total = 0;
    div.innerHTML = "";

    cart.forEach((item, index) => {
        total += item.price * item.qty;

        div.innerHTML += `
        <div class="item">
            <div>
                <h3>${item.name}</h3>
                <p>₹${item.price} × ${item.qty}</p>
            </div>

            <div>
                <button onclick="increase(${index})">+</button>
                <button onclick="decrease(${index})">-</button>
                <button onclick="removeItem(${index})">Remove</button>
            </div>
        </div>
        `;
    });

    let totalBox = document.getElementById("total");
    if (totalBox) totalBox.innerText = "Total: ₹" + total;
}

// ================= CART ACTIONS =================

function removeItem(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    loadCart();
    updateCount();
}

function increase(index) {
    let cart = getCart();
    cart[index].qty++;
    saveCart(cart);
    loadCart();
    updateCount();
}

function decrease(index) {
    let cart = getCart();

    if (cart[index].qty > 1) {
        cart[index].qty--;
    } else {
        cart.splice(index, 1);
    }

    saveCart(cart);
    loadCart();
    updateCount();
}

// ================= CHECKOUT =================

function loadCheckoutTotal() {

    let cart = getCart();
    let total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    let priceBox = document.getElementById("priceTotal");
    let totalBox = document.getElementById("checkoutTotal");

    if (priceBox) priceBox.innerText = "₹" + total;
    if (totalBox) totalBox.innerText = "₹" + total;
}

// ================= PLACE ORDER =================

function placeOrder() {

    let name = document.getElementById("name").value;
    let mobile = document.getElementById("mobile").value;
    let address = document.getElementById("address").value;

    if (!name || !mobile || !address) {
        alert("Please Fill All Fields");
        return;
    }

    localStorage.removeItem("cart");
    window.location.href = "success.html";
}

// ================= LOGIN FUNCTION =================
// (IMPORTANT FIX - ADD THIS IN LOGIN PAGE JS)

function login() {

    let email = document.getElementById("email").value;
    let pass = document.getElementById("pass").value;

    if (!email || !pass) {
        alert("Please fill all fields");
        return;
    }

    localStorage.setItem("loggedIn", "true"); // 🔥 IMPORTANT FIX
    window.location.href = "products.html";
}

// ================= PAGE SAFE INIT =================

document.addEventListener("DOMContentLoaded", function () {

    updateCount();

    if (document.getElementById("cart")) {
        loadCart();
    }

    if (document.getElementById("checkoutTotal")) {
        loadCheckoutTotal();
    }

    // login protection (products page)
    if (location.pathname.includes("products.html")) {
        if (!isLoggedIn()) {
            window.location.href = "login.html";
        }
    }
});