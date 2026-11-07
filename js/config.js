
/* =========================================
BRASA PIZZAS — CONFIGURAÇÕES GERAIS
   ========================================= */

const CONFIG = {
    businessName: "BRASA PIZZAS",
    slogan: "Sabor que marca. Qualidade que conquista.",

    // WhatsApp da pizzaria com código do Brasil e DDD.
    // Formato: 55 + DDD + número, somente dígitos.
    whatsapp: "5583996044707",

    // Arquivos da identidade visual.
    logo: "assets/logo.png",
    favicon: "assets/favicon.png",

    // Imagens dos produtos.
    useProductImages: true,

    // Cores do site.
    primaryColor: "#ff9d00",
    secondaryColor: "#ff5a00",
    backgroundColor: "#080808",
    textColor: "#ffffff",

    // Taxa de entrega.
    deliveryFee: 0,

    // Formatação monetária.
    currency: "BRL",
    locale: "pt-BR"
};

/* =========================================
APLICAR CORES DO TEMA
   ========================================= */

function applyTheme() {
    const root = document.documentElement;

    root.style.setProperty("--primary", CONFIG.primaryColor);
    root.style.setProperty("--secondary", CONFIG.secondaryColor);
    root.style.setProperty("--background", CONFIG.backgroundColor);
    root.style.setProperty("--text", CONFIG.textColor);
}

/* =========================================
APLICAR NOME E SLOGAN
   ========================================= */

function applyBusinessInfo() {
    document.querySelectorAll("[data-business-name]").forEach((element) => {
        element.textContent = CONFIG.businessName;
    });

    document.querySelectorAll("[data-slogan]").forEach((element) => {
        element.textContent = CONFIG.slogan;
    });
}

/* =========================================
APLICAR FAVICON
   ========================================= */

function applyFavicon() {
    const faviconLink = document.getElementById("faviconLink");

    if (faviconLink && CONFIG.favicon) {
        faviconLink.href = CONFIG.favicon;
    }
}

/* =========================================
APLICAR LOGO
   ========================================= */

function applyLogo() {
    if (!CONFIG.logo) return;

    document.querySelectorAll(".brand").forEach((brand) => {
        const textBlock = brand.querySelector(".brand__text");
        const mark = brand.querySelector(".brand__mark");

        if (!textBlock || !mark) return;

        // Evita adicionar a mesma imagem várias vezes.
        if (brand.querySelector(".brand__logo")) return;

        const logo = new Image();

        logo.className = "brand__logo";
        logo.alt = CONFIG.businessName;
        logo.src = CONFIG.logo;
        logo.decoding = "async";

        logo.onload = () => {
            if (mark.isConnected) {
                mark.replaceWith(logo);
            }
        };

        logo.onerror = () => {
            // Se a imagem não existir, mantém o símbolo original.
            logo.remove();
        };
    });
}

/* =========================================
FORMATAÇÃO DE PREÇOS
   ========================================= */

function formatCurrency(value) {
    const amount = Number(value);

    return new Intl.NumberFormat(CONFIG.locale, {
        style: "currency",
        currency: CONFIG.currency
    }).format(
        Number.isFinite(amount) ? amount : 0
    );
}

/* =========================================
INICIALIZAÇÃO
   ========================================= */

function initializeConfig() {
    applyTheme();
    applyBusinessInfo();
    applyFavicon();
    applyLogo();
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeConfig
    );
} else {
    initializeConfig();
}
