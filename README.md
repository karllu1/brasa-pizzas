# BRASA PIZZAS — Cardápio Online

Site estático feito somente com HTML5, CSS3 e JavaScript puro. Não usa React, Next.js, Node.js, banco de dados ou backend.

O pedido é montado no navegador e o cliente é direcionado ao WhatsApp com a mensagem pronta. O site **não envia a mensagem sozinho**: o cliente precisa tocar em Enviar no WhatsApp.

## 1. Estrutura

```text
brasa-pizzas/
├── index.html
├── css/
│   ├── style.css
│   └── responsive.css
├── js/
│   ├── config.js
│   ├── products.js
│   ├── menu.js
│   ├── cart.js
│   ├── checkout.js
│   └── whatsapp.js
├── assets/
│   ├── logo.png
│   ├── favicon.png
│   └── pizzas/
└── README.md
```

## 2. Como trocar a logo

Abra `js/config.js` e altere:

```js
logo: "assets/logo.png"
```

Coloque sua nova logo em `assets/logo.png`.

O projeto foi preparado para continuar funcionando mesmo sem a imagem da logo. O cabeçalho usa o nome da empresa e o ícone de fogo como identidade de fallback.

> O cabeçalho tenta carregar `assets/logo.png` automaticamente. Se o arquivo existir e carregar corretamente, ele substitui o ícone de fogo pela logo. Se não existir ou falhar, o site mantém o ícone de fogo e o nome da pizzaria, sem imagem quebrada.

## 3. Nome da pizzaria

No início de `js/config.js`:

```js
businessName: "BRASA PIZZAS"
```

Altere apenas esse valor.

## 4. Slogan

Ainda em `config.js`:

```js
slogan: "Sabor que marca. Qualidade que conquista."
```

## 5. WhatsApp

Use somente números, com código do país:

```js
whatsapp: "5583996044707"
```

Não coloque `+`, espaços, parênteses ou hífens.

## 6. Cores

As cores principais ficam centralizadas em `config.js`:

```js
primaryColor: "#ff9d00",
secondaryColor: "#ff5a00",
backgroundColor: "#080808",
textColor: "#ffffff"
```

Você pode trocar esses quatro valores. O CSS recebe automaticamente essas cores como:

- `--primary`
- `--secondary`
- `--background`
- `--text`

## 7. Alterar preços

Abra `js/products.js`.

Exemplo:

```js
prices: {
  P: 24.90,
  M: 30.90,
  G: 35.90
}
```

Para bebida:

```js
price: 6.90
```

Não é necessário alterar HTML.

## 8. Adicionar uma pizza

Dentro do array `PRODUCTS`, adicione outro objeto:

```js
{
  id: 999,
  name: "Nova Pizza",
  category: "classicas",
  description: "Descrição da pizza.",
  image: "assets/pizzas/nova-pizza.jpg",
  prices: {
    P: 25.90,
    M: 31.90,
    G: 36.90
  },
  available: true,
  featured: false
}
```

Use um `id` que ainda não exista.

Categorias disponíveis:

- `classicas`
- `classicas-especiais`
- `especiais-brasa`
- `camarao`
- `doces`
- `bebidas`

## 9. Remover uma pizza

Apague o objeto correspondente do array `PRODUCTS` em `js/products.js`.

## 10. Deixar uma pizza indisponível

Altere:

```js
available: true
```

para:

```js
available: false
```

Ela continuará aparecendo no cardápio, mas ficará desabilitada e mostrará “Indisponível”.

## 11. Adicionar fotos

Coloque os arquivos em:

```text
assets/pizzas/
```

Exemplo:

```text
assets/pizzas/calabresa.jpg
assets/pizzas/mussarela.jpg
assets/pizzas/frango.jpg
```

Depois, em `products.js`, o campo `image` deve apontar para o arquivo correto:

```js
image: "assets/pizzas/calabresa.jpg"
```

Não é necessário alterar o HTML.

## 12. Ativar fotos

Em `config.js`:

```js
useProductImages: true
```

Quando estiver `false`, as fotos são escondidas e o card usa o visual gráfico de pizza/bebida.

Quando estiver `true`, as fotos cadastradas serão exibidas.

Se uma imagem estiver faltando ou não puder ser carregada, o card automaticamente remove a imagem e volta ao visual sem foto. Assim, nunca aparece uma imagem quebrada.

## 13. Desativar fotos

Em `config.js`:

```js
useProductImages: false
```

Esse é o estado recomendado enquanto a pizzaria ainda não possui fotos oficiais.

## 14. Taxa de entrega

No `config.js`:

```js
deliveryFee: 0
```

Exemplo futuro:

```js
deliveryFee: 5
```

O valor é usado no carrinho, na revisão e na mensagem do WhatsApp.

O projeto não inventa valores por bairro.

## 15. Destaques / Mais pedidas

Em `products.js`, use:

```js
featured: true
```

para colocar o produto na seção “Mais pedidas”.

## 16. Carrinho

O carrinho usa `localStorage`.

Por isso, se o cliente atualizar ou fechar a página, os itens permanecem no navegador.

A chave usada é:

```text
brasa-pizzas-cart
```

## 17. Pedido pelo WhatsApp

O fluxo é:

1. Cliente escolhe produtos.
2. Escolhe tamanho e quantidade.
3. Adiciona ao carrinho.
4. Preenche os dados.
5. Escolhe pagamento.
6. Revisa o pedido.
7. O site monta a mensagem.
8. O site abre `https://wa.me/5583996044707?...`.
9. O cliente toca em **Enviar** no WhatsApp.

O site não envia mensagens automaticamente.

## 18. Como publicar

### Opção A — Netlify

1. Acesse o Netlify.
2. Crie um novo site.
3. Arraste a pasta `brasa-pizzas` para a área de publicação.
4. Aguarde o deploy.
5. Abra o endereço gerado.

### Opção B — GitHub Pages

1. Crie um repositório no GitHub.
2. Envie todos os arquivos mantendo as pastas.
3. Vá em Settings → Pages.
4. Selecione a branch principal e a pasta raiz.
5. Salve.
6. O GitHub Pages fornecerá o endereço do site.

### Opção C — Hospedagem tradicional

Envie os arquivos para a pasta pública da hospedagem, normalmente chamada `public_html`.

O arquivo inicial é:

```text
index.html
```

## 19. Teste local

Você pode abrir `index.html` diretamente no navegador.

Para um ambiente local mais próximo de uma hospedagem, também pode usar a extensão Live Server do VS Code.

## 20. Onde alterar cada coisa

| O que você quer mudar | Arquivo |
|---|---|
| Nome | `js/config.js` |
| Slogan | `js/config.js` |
| WhatsApp | `js/config.js` |
| Cores | `js/config.js` |
| Taxa de entrega | `js/config.js` |
| Fotos ativadas/desativadas | `js/config.js` |
| Produtos | `js/products.js` |
| Layout | `index.html` |
| Visual | `css/style.css` |
| Responsividade | `css/responsive.css` |
| Carrinho | `js/cart.js` |
| Cardápio/modal | `js/menu.js` |
| Checkout | `js/checkout.js` |
| WhatsApp | `js/whatsapp.js` |

## 21. Aviso sobre dados

Como este é um site estático, os dados do checkout existem somente no navegador até o cliente abrir o WhatsApp. Não existe banco de dados.

O pedido final depende do WhatsApp.

---

**Brasa Pizzas**  
Sabor que marca. Qualidade que conquista.


### Pizzas meio a meio

Ao abrir uma pizza, selecione o tamanho e escolha o primeiro sabor. O segundo sabor é opcional. Quando dois sabores diferentes forem escolhidos, o site calcula automaticamente a média dos preços dos dois sabores no mesmo tamanho (por exemplo: R$ 40,00 e R$ 50,00 = R$ 45,00). A combinação e o preço são enviados no resumo e na mensagem do WhatsApp.
