
let checkoutData = null;

/* ABRIR FINALIZAÇÃO */

function openCheckout() {
    if (!Array.isArray(cart) || cart.length === 0) {
        showToast("Adicione pelo menos um item ao carrinho.");
        return;
    }

    closeModal("cartModal");
    openModal("checkoutModal");
}

/* DADOS DO FORMULÁRIO */

function getFormData() {
    const form = document.getElementById("checkoutForm");
    if (!form) return {};

    return Object.fromEntries(new FormData(form).entries());
}

/* VALIDAR PEDIDO */

function validateCheckout(data) {
    const required = [
        ["name", "Digite seu nome completo."],
        ["phone", "Digite seu telefone."],
        ["deliveryLocation", "Selecione a localidade de entrega."],
        ["street", "Informe a rua ou avenida."],
        ["number", "Informe o número."],
        ["neighborhood", "Informe o bairro."],
        ["payment", "Escolha uma forma de pagamento."]
    ];

    for (const [field, message] of required) {
        if (!String(data[field] || "").trim()) return message;
    }

    if (!(data.deliveryLocation in DELIVERY_FEES)) {
        return "Selecione uma localidade de entrega válida.";
    }

    const phoneDigits = String(data.phone).replace(/\D/g, "");

    if (phoneDigits.length < 10 || phoneDigits.length > 13) {
        return "Confira o telefone informado.";
    }

    if (!["Dinheiro", "Pix", "Cartão"].includes(data.payment)) {
        return "Selecione uma forma de pagamento válida.";
    }

    if (
        data.payment === "Dinheiro" &&
        data.needsChange === "Sim"
    ) {
        const changeAmount = parseMoney(data.changeAmount);

        if (!String(data.changeAmount || "").trim()) {
            return "Informe para quanto precisa do troco.";
        }

        if (changeAmount <= 0) {
            return "Informe um valor de troco válido.";
        }

        if (changeAmount < getCartTotal()) {
            return "O valor para troco precisa ser igual ou maior que o total do pedido.";
        }
    }

    return "";
}

/* CONVERTER VALORES MONETÁRIOS */

function parseMoney(value) {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : 0;
    }

    let normalized = String(value || "")
        .trim()
        .replace(/R\$\s?/gi, "")
        .replace(/\s/g, "");

    if (!normalized) return 0;

    if (normalized.includes(",")) {
        normalized = normalized
            .replace(/\./g, "")
            .replace(",", ".");
    }

    const amount = Number(normalized);

    return Number.isFinite(amount) && amount >= 0
        ? amount
        : 0;
}

/* RESUMO DO PEDIDO */

function renderReview() {
    const reviewContent = document.getElementById("reviewContent");

    if (!reviewContent || !checkoutData || !cart.length) return;

    const items = cart.map((item) => {
        const name = escapeHTML(`${item.quantity}x ${item.name}`);

        const size = item.sizeLabel
            ? `<small>${escapeHTML(item.sizeLabel)}</small>`
            : "";

        const flavors = Array.isArray(item.flavors) &&
            item.flavors.length > 1
            ? `<small>Sabores: ${item.flavors.map(escapeHTML).join(" / ")} (meio a meio)</small>`
            : "";

        return `
            <div class="review-item">
                <div>
                    <strong>${name}</strong>
                    ${size}
                    ${flavors}
                </div>
                <strong>${formatCurrency(item.price * item.quantity)}</strong>
            </div>
        `;
    }).join("");

    const street = escapeHTML(checkoutData.street);
    const number = escapeHTML(checkoutData.number);
    const complement = escapeHTML(checkoutData.complement || "");
    const neighborhood = escapeHTML(checkoutData.neighborhood);
    const location = escapeHTML(checkoutData.deliveryLocation);
    const reference = escapeHTML(checkoutData.reference || "");

    const address = `
        <p>
            ${street}, ${number}
            ${complement ? ` — ${complement}` : ""}
            <br>
            Bairro: ${neighborhood}
            <br>
            Localidade: ${location}
            ${reference ? `<br><small>Referência: ${reference}</small>` : ""}
        </p>
    `;

    const isCash = checkoutData.payment === "Dinheiro";
    const needsChange = isCash && checkoutData.needsChange === "Sim";

    const paymentDetails = `
        <p>
            <strong>${escapeHTML(checkoutData.payment)}</strong>
            ${needsChange
                ? `<br>Troco para: ${formatCurrency(parseMoney(checkoutData.changeAmount))}`
                : ""}
        </p>
    `;

    const subtotal = getCartSubtotal();
    const delivery = cart.length ? getDeliveryFee() : 0;
    const total = subtotal + delivery;

    reviewContent.innerHTML = `
        <div class="review-box">
            <h3>Itens do pedido</h3>
            ${items}
        </div>

        <div class="review-box">
            <h3>Endereço de entrega</h3>
            ${address}
        </div>

        <div class="review-box">
            <h3>Forma de pagamento</h3>
            ${paymentDetails}
        </div>

        <div class="review-totals">
            <div>
                <span>Subtotal</span>
                <strong>${formatCurrency(subtotal)}</strong>
            </div>
            <div>
                <span>Entrega</span>
                <strong>${formatCurrency(delivery)}</strong>
            </div>
            <div>
                <span>Total</span>
                <strong>${formatCurrency(total)}</strong>
            </div>
        </div>
    `;
}

/* ENVIAR FORMULÁRIO */

function handleCheckoutSubmit(event) {
    event.preventDefault();

    const data = getFormData();
    const error = validateCheckout(data);
    const errorEl = document.getElementById("checkoutError");

    if (errorEl) errorEl.textContent = "";

    if (error) {
        if (errorEl) {
            errorEl.textContent = error;
        } else {
            showToast(error);
        }
        return;
    }

    checkoutData = data;

    closeModal("checkoutModal");
    renderReview();
    openModal("reviewModal");
}

/* PAGAMENTO E TROCO */

function setupPaymentOptions() {
    const paymentInputs = document.querySelectorAll(
        'input[name="payment"]'
    );

    const changeBox = document.getElementById("changeBox");
    const changeAmountField = document.getElementById("changeAmountField");
    const needsChange = document.getElementById("needsChange");

    function updateChangeField() {
        if (!needsChange || !changeAmountField) return;

        changeAmountField.hidden = needsChange.value !== "Sim";
    }

    function updatePaymentFields() {
        const selectedPayment = document.querySelector(
            'input[name="payment"]:checked'
        );

        const isCash = selectedPayment?.value === "Dinheiro";

        if (changeBox) changeBox.hidden = !isCash;

        if (!isCash) {
            if (changeAmountField) changeAmountField.hidden = true;
            if (needsChange) needsChange.value = "Não";
        } else {
            updateChangeField();
        }
    }

    paymentInputs.forEach((input) => {
        input.addEventListener("change", updatePaymentFields);
    });

    needsChange?.addEventListener("change", updateChangeField);

    updatePaymentFields();
}

/* NAVEGAÇÃO */

function setupCheckoutNavigation() {
    const editButton = document.getElementById("editCheckoutButton");

    editButton?.addEventListener("click", () => {
        closeModal("reviewModal");
        openModal("checkoutModal");
    });

    document.getElementById("checkoutForm")?.addEventListener(
        "submit",
        handleCheckoutSubmit
    );
}

/* INICIALIZAÇÃO */

function initializeCheckout() {
    setupCheckoutNavigation();
    setupPaymentOptions();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeCheckout);
} else {
    initializeCheckout();
}
