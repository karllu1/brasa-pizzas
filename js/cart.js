
const CART_STORAGE_KEY = "brasa-pizzas-cart";

const DELIVERY_FEES = {
    "Cidade": 5,
    "Tabuleiro": 7,
    "Maria Morais": 7,
    "Tanques": 7,
    "Manguape": 12,
    "Caracol": 12,
    "Palhaça": 12,
    "Camuca": 12,
    "Esperança": 15,
    "Lagoa Seca": 15
};

let cart = loadCart();

/* =========================================
TAXA DE ENTREGA
   ========================================= */

function getDeliveryLocation() {
    const select = document.getElementById("deliveryLocation");

    if (select && select.value) {
        return select.value;
    }

    if (
        typeof checkoutData !== "undefined" &&
        checkoutData?.deliveryLocation
    ) {
        return checkoutData.deliveryLocation;
    }

    return "";
}

function getDeliveryFee() {
    const location = getDeliveryLocation();
    return DELIVERY_FEES[location] ?? 0;
}

/* =========================================
CARREGAMENTO E VALIDAÇÃO
   ========================================= */

function loadCart() {
    try {
        const stored = JSON.parse(
            localStorage.getItem(CART_STORAGE_KEY)
        );

        if (!Array.isArray(stored)) return [];

        return stored
            .filter((item) => (
                item &&
                typeof item.key === "string" &&
                typeof item.name === "string" &&
                Number.isFinite(Number(item.price)) &&
                Number(item.price) >= 0 &&
                Number.isInteger(Number(item.quantity)) &&
                Number(item.quantity) > 0
            ))
            .map((item) => ({
                ...item,
                price: Number(item.price),
                quantity: Number(item.quantity),
                flavors: Array.isArray(item.flavors)
                    ? item.flavors.filter(
                        (flavor) => typeof flavor === "string"
                    )
                    : [],
                stuffedCrust: typeof item.stuffedCrust === "string" ? item.stuffedCrust : "",
                stuffedCrustPrice: Number.isFinite(Number(item.stuffedCrustPrice)) ? Number(item.stuffedCrustPrice) : 0
            }));
    } catch {
        return [];
    }
}

/* =========================================
SALVAR CARRINHO
   ========================================= */

function saveCart() {
    try {
        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(cart)
        );
    } catch (error) {
        console.error("Erro ao salvar o carrinho:", error);
        showToast("Não foi possível salvar o carrinho.");
    }

    updateCartUI();
}

/* =========================================
CÁLCULOS
   ========================================= */

function getCartCount() {
    return cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );
}

function getCartSubtotal() {
    return cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
}

function getCartTotal() {
    return getCartSubtotal() + (
        cart.length > 0 ? getDeliveryFee() : 0
    );
}

/* =========================================
ADICIONAR PRODUTO
   ========================================= */

function addToCart(product, size = null, quantity = 1, options = {}) {
    if (!product || !product.id || !product.name) {
        showToast("Não foi possível adicionar esta pizza.");
        return;
    }

    quantity = Number(quantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
        showToast("Escolha uma quantidade válida.");
        return;
    }

    const flavors = Array.isArray(options.flavors) &&
        options.flavors.length
        ? options.flavors
        : [product];

    if (
        flavors.length > 2 ||
        flavors.some(
            (flavor) => !flavor || !flavor.id || !flavor.name
        )
    ) {
        showToast("Selecione até dois sabores válidos.");
        return;
    }

    const flavorNames = flavors.map((flavor) => flavor.name);
    const stuffedCrust = typeof options.stuffedCrust === "string" ? options.stuffedCrust : "";
    const stuffedCrustPrice = Number.isFinite(Number(options.stuffedCrustPrice))
        ? Number(options.stuffedCrustPrice)
        : 0;

    const name = flavorNames.length > 1
        ? `${flavorNames[0]} / ${flavorNames[1]}`
        : product.name;

    let unitPrice;

    if (Number.isFinite(options.unitPrice)) {
        unitPrice = options.unitPrice;
    } else if (size && product.prices) {
        unitPrice = product.prices[size];
    } else {
        unitPrice = product.price;
    }

    unitPrice = Number(unitPrice);

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
        showToast("O preço deste produto é inválido.");
        return;
    }

    // O preço do meio a meio continua vindo do menu.
    const key = [
        product.id,
        flavors.map((flavor) => flavor.id).join("-"),
        size || "unit",
        unitPrice,
        stuffedCrust || "no-crust"
    ].join("-");

    const existing = cart.find((item) => item.key === key);

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            key,
            productId: product.id,
            name,
            flavors: flavorNames,
            size,
            sizeLabel: size ? getSizeLabel(size) : null,
            price: unitPrice,
            stuffedCrust,
            stuffedCrustPrice,
            quantity
        });
    }

    saveCart();
    showToast(`${name} foi adicionada ao pedido.`);
}

/* =========================================
ALTERAR QUANTIDADE
   ========================================= */

function changeCartQuantity(key, delta) {
    const item = cart.find((entry) => entry.key === key);
    if (!item) return;

    delta = Number(delta);
    if (!Number.isInteger(delta)) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        removeCartItem(key);
        return;
    }

    saveCart();
}

function removeCartItem(key) {
    cart = cart.filter((item) => item.key !== key);
    saveCart();
}

function clearCart() {
    cart = [];

    try {
        localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
        console.error("Erro ao limpar o armazenamento:", error);
    }

    updateCartUI();
}

/* =========================================
TAMANHOS
   ========================================= */

function getSizeLabel(size) {
    return {
        P: "Pequena — 4 fatias",
        M: "Média — 6 fatias",
        G: "Grande — 8 fatias"
    }[size] || size;
}

/* =========================================
ATUALIZAR INTERFACE
   ========================================= */

function updateCartUI() {
    const count = getCartCount();
    const subtotalValue = getCartSubtotal();
    const deliveryValue = count > 0 ? getDeliveryFee() : 0;
    const totalValue = subtotalValue + deliveryValue;

    ["navCartCount", "mobileCartCount"].forEach((id) => {
        const element = document.getElementById(id);
        if (element) element.textContent = count;
    });

    const mobileTotal = document.getElementById("mobileCartTotal");
    if (mobileTotal) {
        mobileTotal.textContent = formatCurrency(totalValue);
    }

    const mobileBar = document.getElementById("mobileCartBar");
    if (mobileBar) mobileBar.hidden = count === 0;

    const subtotal = document.getElementById("cartSubtotal");
    const delivery = document.getElementById("cartDelivery");
    const total = document.getElementById("cartTotal");

    if (subtotal) {
        subtotal.textContent = formatCurrency(subtotalValue);
    }

    if (delivery) {
        delivery.textContent = formatCurrency(deliveryValue);
    }

    if (total) {
        total.textContent = formatCurrency(totalValue);
    }

    renderCartItems();
}

/* =========================================
RENDERIZAR ITENS
   ========================================= */

function renderCartItems() {
    const container = document.getElementById("cartItems");
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <span>🛒</span>
                <h3>Seu carrinho está vazio.</h3>
                <p>Escolha uma delícia no cardápio para começar.</p>
                <button
                    type="button"
                    class="button button--primary"
                    data-close-cart
                >
                    VER CARDÁPIO
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = cart.map((item) => {
        const key = escapeHTML(item.key);
        const name = escapeHTML(item.name);

        const crustInfo = item.stuffedCrust
            ? `<small>Borda recheada: ${escapeHTML(item.stuffedCrust)} (+${formatCurrency(item.stuffedCrustPrice || 0)})</small>` : "";

        const sizeInfo = item.sizeLabel
            ? `
                <small>
                    ${escapeHTML(item.sizeLabel)}
                    ${item.flavors.length > 1 ? " · Meio a meio" : ""}
                </small>
            `
            : "";

        return `
            <article class="cart-item">
                <div class="cart-item__info">
                    <strong>${name}</strong>
                    ${sizeInfo}
                    ${crustInfo}
                    <span>${formatCurrency(item.price)} cada</span>
                </div>

                <div class="cart-item__controls">
                    <button
                        type="button"
                        data-cart-minus="${key}"
                        aria-label="Diminuir quantidade de ${name}"
                    >−</button>

                    <b>${item.quantity}</b>

                    <button
                        type="button"
                        data-cart-plus="${key}"
                        aria-label="Aumentar quantidade de ${name}"
                    >+</button>

                    <button
                        type="button"
                        class="remove-button"
                        data-cart-remove="${key}"
                        aria-label="Remover ${name}"
                    >×</button>
                </div>
            </article>
        `;
    }).join("");
}

/* =========================================
ESCAPAR HTML
   ========================================= */

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[char]));
}

/* =========================================
EVENTOS
   ========================================= */

document.addEventListener("click", (event) => {
    const target = event.target.closest(
        "[data-cart-minus], [data-cart-plus], [data-cart-remove], [data-close-cart]"
    );

    if (!target) return;

    if (target.hasAttribute("data-cart-minus")) {
        changeCartQuantity(target.dataset.cartMinus, -1);
    }

    if (target.hasAttribute("data-cart-plus")) {
        changeCartQuantity(target.dataset.cartPlus, 1);
    }

    if (target.hasAttribute("data-cart-remove")) {
        removeCartItem(target.dataset.cartRemove);
    }

    if (target.hasAttribute("data-close-cart")) {
        closeModal("cartModal");
    }
});

document.getElementById("deliveryLocation")?.addEventListener(
    "change",
    updateCartUI
);

document.addEventListener("DOMContentLoaded", updateCartUI);

