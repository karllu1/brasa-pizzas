
/* =========================================
BRASA PIZZAS — CARDÁPIO E PRODUTOS
   ========================================= */

let selectedCategory = "todas";
let selectedProduct = null;

const categoryBar = document.getElementById("categoryBar");
const productsGrid = document.getElementById("productsGrid");
const featuredGrid = document.getElementById("featuredGrid");

/* =========================================
FUNÇÕES AUXILIARES
   ========================================= */

function findProductById(id) {
    return PRODUCTS.find(
        (product) => String(product.id) === String(id)
    );
}

function getAvailablePizzaProducts() {
    return PRODUCTS.filter(
        (product) =>
            product.category !== "bebidas" &&
            product.available &&
            product.prices
    );
}

function isDrink(product) {
    return product.category === "bebidas";
}

function escapeAttribute(value) {
    return escapeHTML(value);
}

/* =========================================
CATEGORIAS
   ========================================= */

function renderCategories() {
    if (!categoryBar) return;

    categoryBar.innerHTML = Object.entries(CATEGORY_LABELS)
        .map(([key, label]) => `
            <button
                class="category-button ${key === selectedCategory ? "is-active" : ""}"
                type="button"
                data-category="${escapeAttribute(key)}"
                role="tab"
                aria-selected="${key === selectedCategory}"
            >
                ${escapeHTML(label)}
            </button>
        `)
        .join("");
}

/* =========================================
CARD DO PRODUTO
   ========================================= */

function productCard(product) {
    const drink = isDrink(product);
    const imageFitClass = product.category === "bebidas"
        ? " product-card__image--drink product-card__image--drink-" + escapeAttribute(product.id)
        : "";

    const imageMarkup =
        CONFIG.useProductImages && product.image
            ? `
                <img
                    class="product-card__image${imageFitClass}"
                    src="${escapeAttribute(product.image)}"
                    alt="${escapeAttribute(product.name)}"
                    loading="lazy"
                    onerror="this.remove(); this.parentElement.classList.add('no-image');"
                >
            `
            : `
                <div class="product-card__visual" aria-hidden="true">
                    <span>${drink ? "🥤" : "🍕"}</span>
                    <i></i>
                </div>
            `;

    const priceMarkup = drink
        ? `
            <div class="product-card__price">
                ${formatCurrency(product.price)}
            </div>
        `
        : `
            <div class="product-card__prices">
                <span>P ${formatCurrency(product.prices.P)}</span>
                <span>M ${formatCurrency(product.prices.M)}</span>
                <span>G ${formatCurrency(product.prices.G)}</span>
            </div>
        `;

    const categoryLabel =
        CATEGORY_LABELS[product.category] || product.category;

    return `
        <article class="product-card ${product.available ? "" : "is-unavailable"}">
            <button
                class="product-card__click"
                type="button"
                data-product-id="${escapeAttribute(product.id)}"
                ${product.available ? "" : "disabled"}
                aria-label="${product.available
                    ? `Escolher ${escapeAttribute(product.name)}`
                    : `${escapeAttribute(product.name)} indisponível`}"
            >
                <div class="product-card__media ${CONFIG.useProductImages && product.image ? "has-image" : "no-image"}">
                    ${imageMarkup}

                    ${!product.available
                        ? '<span class="unavailable-badge">Indisponível</span>'
                        : ""}
                </div>

                <div class="product-card__body">
                    <span class="product-card__category">
                        ${escapeHTML(categoryLabel)}
                    </span>

                    <h3>${escapeHTML(product.name)}</h3>

                    <p>${escapeHTML(product.description || "")}</p>

                    ${priceMarkup}

                    <span class="product-card__cta">
                        ${product.available ? "Adicionar" : "Indisponível"}
                        <b>+</b>
                    </span>
                </div>
            </button>
        </article>
    `;
}

/* =========================================
LISTAGEM DE PRODUTOS
   ========================================= */

function renderProducts() {
    if (!productsGrid) return;

    const filtered =
        selectedCategory === "todas"
            ? PRODUCTS
            : PRODUCTS.filter(
                (product) => product.category === selectedCategory
            );

    productsGrid.innerHTML = filtered
        .map(productCard)
        .join("");
}

function renderFeatured() {
    if (!featuredGrid) return;

    const featured = PRODUCTS
        .filter(
            (product) => product.featured && product.available
        )
        .slice(0, 4);

    featuredGrid.innerHTML = featured
        .map(productCard)
        .join("");
}

/* =========================================
PREÇO DE PIZZA MEIO A MEIO
   ========================================= */

/*
 * Uma pizza com dois sabores custa a média
 * dos preços dos dois sabores no mesmo tamanho.
 *
 * Exemplo:
 * Sabor A: R$ 30,00
 * Sabor B: R$ 40,00
 * Preço da pizza: R$ 35,00
 */

function pizzaPriceForFlavors(first, second, size) {
    if (!first || !first.prices) return 0;

    const firstPrice = Number(first.prices[size]);

    if (!Number.isFinite(firstPrice)) return 0;

    if (
        !second ||
        !second.prices ||
        String(first.id) === String(second.id)
    ) {
        return firstPrice;
    }

    const secondPrice = Number(second.prices[size]);

    if (!Number.isFinite(secondPrice)) {
        return firstPrice;
    }

    return Math.round(
        ((firstPrice + secondPrice) / 2 + Number.EPSILON) * 100
    ) / 100;
}

/* =========================================
ABRIR MODAL DO PRODUTO
   ========================================= */

function openProduct(product) {
    if (!product || !product.available) return;

    selectedProduct = product;

    const content = document.getElementById("productModalContent");

    if (!content) {
        showToast("Não foi possível abrir este produto.");
        return;
    }

    if (isDrink(product)) {
        content.innerHTML = `
            <div class="modal-product-visual">🥤</div>

            <span class="eyebrow">
                ${escapeHTML(CATEGORY_LABELS[product.category] || "Bebidas")}
            </span>

            <h2 id="productModalTitle">
                ${escapeHTML(product.name)}
            </h2>

            <p class="modal-product-description">
                ${escapeHTML(product.description || "")}
            </p>

            <div class="quantity-row">
                <span>Quantidade</span>

                <div class="quantity-control">
                    <button type="button" id="modalMinus" aria-label="Diminuir quantidade">−</button>
                    <b id="modalQuantity">1</b>
                    <button type="button" id="modalPlus" aria-label="Aumentar quantidade">+</button>
                </div>
            </div>

            <div class="modal-price-line">
                <strong id="modalTotal">
                    ${formatCurrency(product.price)}
                </strong>
            </div>

            <button
                class="button button--primary button--full"
                id="modalAddButton"
                type="button"
            >
                ADICIONAR AO PEDIDO
            </button>
        `;
    } else {
        const pizzaProducts = getAvailablePizzaProducts();

        const options = pizzaProducts
            .map((item) => `
                <option
                    value="${escapeAttribute(item.id)}"
                    ${String(item.id) === String(product.id) ? "selected" : ""}
                >
                    ${escapeHTML(item.name)}
                </option>
            `)
            .join("");

        const secondOptions = pizzaProducts
            .map((item) => `
                <option value="${escapeAttribute(item.id)}">
                    ${escapeHTML(item.name)}
                </option>
            `)
            .join("");

        content.innerHTML = `
            <div class="modal-product-visual">🍕</div>

            <span class="eyebrow">
                ${escapeHTML(CATEGORY_LABELS[product.category] || "Pizzas")}
            </span>

            <h2 id="productModalTitle">Monte sua pizza</h2>

            <p class="modal-product-description">
                Escolha o tamanho e até dois sabores.
                Na pizza meio a meio, o preço é calculado
                pela média dos valores dos sabores escolhidos.
            </p>

            <fieldset class="size-fieldset">
                <legend>Tamanho da pizza</legend>

                <div class="size-options">
                    ${["P", "M", "G"].map((size) => `
                        <label>
                            <input
                                type="radio"
                                name="modalSize"
                                value="${size}"
                                ${size === "M" ? "checked" : ""}
                            >

                            <span>
                                <b>${size}</b>

                                <small>
                                    ${escapeHTML(getSizeLabel(size).split(" — ")[1] || "")}
                                </small>

                                <strong id="price-${size}">
                                    ${formatCurrency(product.prices[size])}
                                </strong>
                            </span>
                        </label>
                    `).join("")}
                </div>
            </fieldset>

            <div class="flavor-picker">
                <label class="field" for="firstFlavor">
                    1º sabor

                    <select id="firstFlavor" required>
                        ${options}
                    </select>
                </label>

                <label class="field" for="secondFlavor">
                    2º sabor
                    <span class="optional-label">
                        Opcional · meio a meio
                    </span>

                    <select id="secondFlavor">
                        <option value="">Sem segundo sabor</option>
                        ${secondOptions}
                    </select>
                </label>

                <p class="flavor-price-note" id="flavorPriceNote">
                    Escolha um segundo sabor para calcular o valor meio a meio.
                </p>
            </div>

            <div class="quantity-row">
                <span>Quantidade</span>

                <div class="quantity-control">
                    <button type="button" id="modalMinus" aria-label="Diminuir quantidade">−</button>
                    <b id="modalQuantity">1</b>
                    <button type="button" id="modalPlus" aria-label="Aumentar quantidade">+</button>
                </div>
            </div>

            <div class="modal-price-line">
                <span>Total</span>
                <strong id="modalTotal">
                    ${formatCurrency(product.prices.M)}
                </strong>
            </div>

            <button
                class="button button--primary button--full"
                id="modalAddButton"
                type="button"
            >
                ADICIONAR AO PEDIDO
            </button>
        `;
    }

    openModal("productModal");
    setupProductModal();
}

/* =========================================
INTERAÇÕES DO MODAL
   ========================================= */

function setupProductModal() {
    if (!selectedProduct) return;

    let quantity = 1;

    const content = document.getElementById("productModalContent");

    if (!content) return;

    const drink = isDrink(selectedProduct);
    const quantityEl = content.querySelector("#modalQuantity");
    const totalEl = content.querySelector("#modalTotal");
    const minusButton = content.querySelector("#modalMinus");
    const plusButton = content.querySelector("#modalPlus");
    const addButton = content.querySelector("#modalAddButton");

    if (
        !quantityEl ||
        !totalEl ||
        !minusButton ||
        !plusButton ||
        !addButton
    ) {
        return;
    }

    function getSelectedFlavors() {
        const firstSelect = content.querySelector("#firstFlavor");
        const secondSelect = content.querySelector("#secondFlavor");

        const first = firstSelect
            ? findProductById(firstSelect.value)
            : null;

        const second = secondSelect && secondSelect.value
            ? findProductById(secondSelect.value)
            : null;

        return { first, second };
    }

    function update() {
        let unitPrice = 0;

        if (!drink) {
            const size = content.querySelector(
                'input[name="modalSize"]:checked'
            )?.value || "M";

            const { first, second } = getSelectedFlavors();

            if (!first || !first.prices) {
                addButton.disabled = true;
                return;
            }

            addButton.disabled = false;

            unitPrice = pizzaPriceForFlavors(first, second, size);

            ["P", "M", "G"].forEach((currentSize) => {
                const priceElement = content.querySelector(
                    `#price-${currentSize}`
                );

                if (!priceElement) return;

                const price = pizzaPriceForFlavors(
                    first,
                    second,
                    currentSize
                );

                priceElement.textContent = formatCurrency(price);
            });

            const note = content.querySelector("#flavorPriceNote");

            if (note) {
                if (
                    second &&
                    String(first.id) !== String(second.id)
                ) {
                    note.textContent =
                        `Meio a meio: (${formatCurrency(first.prices[size])} + ` +
                        `${formatCurrency(second.prices[size])}) ÷ 2 = ` +
                        `${formatCurrency(unitPrice)}.`;
                } else {
                    note.textContent =
                        "Escolha um segundo sabor para calcular o valor meio a meio.";
                }
            }
        } else {
            unitPrice = Number(selectedProduct.price) || 0;
        }

        quantityEl.textContent = quantity;
        totalEl.textContent = formatCurrency(unitPrice * quantity);
    }

    minusButton.addEventListener("click", () => {
        quantity = Math.max(1, quantity - 1);
        update();
    });

    plusButton.addEventListener("click", () => {
        quantity += 1;
        update();
    });

    content.querySelectorAll('input[name="modalSize"]').forEach((radio) => {
        radio.addEventListener("change", update);
    });

    ["firstFlavor", "secondFlavor"].forEach((id) => {
        const select = content.querySelector(`#${id}`);

        if (select) {
            select.addEventListener("change", update);
        }
    });

    addButton.addEventListener("click", () => {
        if (drink) {
            addToCart(selectedProduct, null, quantity);
            closeModal("productModal");
            return;
        }

        const size = content.querySelector(
            'input[name="modalSize"]:checked'
        )?.value;

        const { first, second } = getSelectedFlavors();

        if (!first || !size) {
            showToast("Escolha o sabor e o tamanho da pizza.");
            return;
        }

        const flavors = second &&
            String(second.id) !== String(first.id)
            ? [first, second]
            : [first];

        const unitPrice = pizzaPriceForFlavors(
            first,
            flavors.length > 1 ? flavors[1] : null,
            size
        );

        addToCart(first, size, quantity, {
            flavors,
            unitPrice
        });

        closeModal("productModal");
    });

    update();
}

/* =========================================
CLIQUES NAS CATEGORIAS E PRODUTOS
   ========================================= */

document.addEventListener("click", (event) => {
    const categoryButton = event.target.closest("[data-category]");

    if (categoryButton) {
        selectedCategory = categoryButton.dataset.category;

        renderCategories();
        renderProducts();

        return;
    }

    const productButton = event.target.closest("[data-product-id]");

    if (productButton) {
        const product = findProductById(
            productButton.dataset.productId
        );

        if (product && product.available) {
            openProduct(product);
        }
    }
});

/* =========================================
INICIALIZAÇÃO DO CARDÁPIO
   ========================================= */

function initializeMenu() {
    renderCategories();
    renderProducts();
    renderFeatured();

    if (typeof updateCartUI === "function") {
        updateCartUI();
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeMenu);
} else {
    initializeMenu();
}



