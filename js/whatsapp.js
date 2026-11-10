document.getElementById("navCartButton")?.addEventListener("click", () => {
  openModal("cartModal");
});

document.getElementById("heroCartButton")?.addEventListener("click", () => {
  openModal("cartModal");
});

document.getElementById("mobileCartButton")?.addEventListener("click", () => {
  openModal("cartModal");
});

document.getElementById("checkoutButton")?.addEventListener("click", () => {
  openCheckout();
});

document.getElementById("clearCartButton")?.addEventListener("click", () => {
  if (!cart.length) return;

  clearCart();
  showToast("Carrinho limpo.");
});

const currentYear = document.getElementById("currentYear");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

const headerWhatsapp = document.getElementById("headerWhatsapp");

if (headerWhatsapp) {
  headerWhatsapp.href = `https://wa.me/${CONFIG.whatsapp}`;
  headerWhatsapp.target = "_blank";
  headerWhatsapp.rel = "noopener noreferrer";
}

function openModal(id) {
  const modal = document.getElementById(id);

  if (!modal) return;

  modal.hidden = false;
  document.body.classList.add("modal-open");

  setTimeout(() => {
    modal.querySelector(".modal")?.focus();
  }, 0);
}

function closeModal(id) {
  const modal = document.getElementById(id);

  if (!modal) return;

  modal.hidden = true;

  if (!document.querySelector(".modal-backdrop:not([hidden])")) {
    document.body.classList.remove("modal-open");
  }
}

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    closeModal(button.dataset.closeModal);
  });
});

document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) {
      closeModal(backdrop.id);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document
      .querySelectorAll(".modal-backdrop:not([hidden])")
      .forEach((modal) => {
        closeModal(modal.id);
      });
  }
});

let toastTimer;

function showToast(message) {
  const toast = document.getElementById("toast");

  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("is-visible");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
}

function buildWhatsappMessage() {
    const itemLines = cart.map((item) => {
        const size = item.sizeLabel
            ? `\nTamanho: ${item.sizeLabel}`
            : "";

        const flavors = item.flavors?.length > 1
      ? `\\nSabores: ${item.flavors.join(" / ")} (meio a meio)`
      : "";
    const crust = item.stuffedCrust
      ? `\\nBorda recheada: ${item.stuffedCrust} (+${formatCurrency(item.stuffedCrustPrice || 0)})`
      : "";

    return `${item.quantity}x ${item.name}${size}${flavors}${crust}\\n${formatCurrency(item.price * item.quantity)}`;
    }).join("\n\n");

    const address = [
        `${checkoutData.street}, ${checkoutData.number}`,
        `Bairro: ${checkoutData.neighborhood}`,
        `Localidade: ${checkoutData.deliveryLocation}`,
        checkoutData.complement
            ? `Complemento: ${checkoutData.complement}`
            : "",
        checkoutData.reference
            ? `Referência: ${checkoutData.reference}`
            : ""
    ].filter(Boolean).join("\n");

    const payment =
        checkoutData.payment === "Dinheiro" &&
        checkoutData.needsChange === "Sim"
            ? `Dinheiro (troco para ${formatCurrency(parseMoney(checkoutData.changeAmount))})`
            : checkoutData.payment;

    const subtotal = getCartSubtotal();
    const delivery = getDeliveryFee();
    const total = subtotal + delivery;

    return `Olá, ${CONFIG.businessName}!

Gostaria de fazer um pedido:

${itemLines}

Endereço:
${address}

Nome: ${checkoutData.name}
Telefone: ${checkoutData.phone}

Pagamento: ${payment}

Subtotal: ${formatCurrency(subtotal)}
Entrega: ${formatCurrency(delivery)}

TOTAL: ${formatCurrency(total)}`;
}

document.getElementById("sendWhatsappButton")?.addEventListener("click", () => {
    if (!checkoutData || !cart.length) {
        showToast("Não foi possível montar o pedido.");
        return;
    }

    const message = encodeURIComponent(buildWhatsappMessage());
    const url = `https://wa.me/${CONFIG.whatsapp}?text=${message}`;

    // Abre o WhatsApp uma única vez.
    const whatsappWindow = window.open(url, "_blank");

    if (!whatsappWindow) {
        showToast("O navegador bloqueou a abertura do WhatsApp. Permita pop-ups e tente novamente.");
        return;
    }

    whatsappWindow.opener = null;

    // O carrinho é limpo quando a janela do WhatsApp abre.
    clearCart();
    checkoutData = null;

    closeModal("reviewModal");
    closeModal("checkoutModal");
    closeModal("cartModal");

    document.getElementById("checkoutForm")?.reset();

    showToast("Pedido preparado no WhatsApp. Carrinho limpo!");
});

