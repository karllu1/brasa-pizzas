const PRODUCTS = [
  // CLÁSSICAS
  {
    id: 1,
    name: "Mussarela",
    category: "classicas",
    description: "Mussarela, molho de tomate e orégano.",
    image: "assets/catalogo-mussarela.png",
    prices: { P: 24.9, M: 30.9, G: 35.9 },
    available: true,
    featured: false
  },
  {
    id: 2,
    name: "Calabresa",
    category: "classicas",
    description: "Mussarela, calabresa, cebola, molho de tomate e orégano.",
    image: "assets/catalogo-calabresa.png",
    prices: { P: 24.9, M: 30.9, G: 35.9 },
    available: true,
    featured: true
  },
  {
    id: 3,
    name: "Marguerita",
    category: "classicas",
    description: "Mussarela, tomate, manjericão, molho de tomate e orégano.",
    image: "assets/catalogo-marguerita.png",
    prices: { P: 24.9, M: 30.9, G: 35.9 },
    available: true,
    featured: false
  },
  {
    id: 4,
    name: "Frango",
    category: "classicas",
    description: "Mussarela, frango, molho de tomate e orégano.",
    image: "assets/catalogo-frango.png",
    prices: { P: 24.9, M: 30.9, G: 35.9 },
    available: true,
    featured: false
  },
  {
    id: 5,
    name: "Lombinho",
    category: "classicas",
    description: "Mussarela, lombo canadense, molho de tomate e orégano.",
    image: "assets/catalogo-lombinho.png",
    prices: { P: 24.9, M: 30.9, G: 35.9 },
    available: true,
    featured: false
  },

  // CLÁSSICAS ESPECIAIS
  {
    id: 6,
    name: "Pepperoni",
    category: "classicas-especiais",
    description: "Mussarela, pepperoni, molho de tomate e orégano.",
    image: "assets/catalogo-pepperoni.png",
    prices: { P: 27.9, M: 33.9, G: 39.9 },
    available: true,
    featured: false
  },
  {
    id: 7,
    name: "Palmito",
    category: "classicas-especiais",
    description: "Mussarela, palmito, tomate, molho de tomate e orégano.",
    image: "assets/catalogo-palmito.png",
    prices: { P: 27.9, M: 33.9, G: 39.9 },
    available: true,
    featured: false
  },
  {
    id: 8,
    name: "Frampiry",
    category: "classicas-especiais",
    description: "Mussarela, frango, Catupiry®, molho de tomate e orégano.",
    image: "assets/catalogo-frampiry.png",
    prices: { P: 27.9, M: 33.9, G: 39.9 },
    available: true,
    featured: false
  },
  {
    id: 9,
    name: "Lombo com Abacaxi",
    category: "classicas-especiais",
    description: "Mussarela, lombo canadense, abacaxi, molho de tomate e orégano.",
    image: "assets/catalogo-lombo-abacaxi.png",
    prices: { P: 27.9, M: 33.9, G: 39.9 },
    available: true,
    featured: false
  },
  {
    id: 10,
    name: "4 Queijos",
    category: "classicas-especiais",
    description: "Mussarela, provolone, gorgonzola, Catupiry®, molho de tomate e orégano.",
    image: "assets/catalogo-quatro-queijos.png",
    prices: { P: 29.9, M: 36.9, G: 42.9 },
    available: true,
    featured: true
  },
  {
    id: 11,
    name: "Portuguesa",
    category: "classicas-especiais",
    description: "Mussarela, calabresa, presunto, ovo, cebola, pimentão, molho de tomate e orégano.",
    image: "assets/catalogo-portuguesa.png",
    prices: { P: 29.9, M: 36.9, G: 42.9 },
    available: true,
    featured: false
  },
  {
    id: 12,
    name: "Completa",
    category: "classicas-especiais",
    description: "Mussarela, calabresa, frango, presunto, tomate, cebola, pimentão, molho de tomate e orégano.",
    image: "assets/catalogo-completa.png",
    prices: { P: 29.9, M: 36.9, G: 42.9 },
    available: true,
    featured: false
  },

  // ESPECIAIS DA BRASA
  {
    id: 13,
    name: "Peito de Peru com Cream Cheese",
    category: "especiais-brasa",
    description: "Mussarela, peito de peru, cream cheese, molho de tomate e orégano.",
    image: "assets/catalogo-peito-de-peru.png",
    prices: { P: 32.9, M: 39.9, G: 46.9 },
    available: true,
    featured: false
  },
  {
    id: 14,
    name: "Calabresa Especial",
    category: "especiais-brasa",
    description: "Mussarela, calabresa, bacon, cream cheese, molho de tomate e orégano.",
    image: "assets/catalogo-calabresa-especial.png",
    prices: { P: 32.9, M: 39.9, G: 46.9 },
    available: true,
    featured: false
  },
  {
    id: 15,
    name: "Nordestina",
    category: "especiais-brasa",
    description: "Mussarela, carne de sol, Catupiry®, molho de tomate e orégano.",
    image: "assets/catalogo-nordestina.png",
    prices: { P: 32.9, M: 39.9, G: 46.9 },
    available: true,
    featured: true
  },
  {
    id: 16,
    name: "Sertão",
    category: "especiais-brasa",
    description: "Mussarela, carne de sol, queijo coalho, cebola roxa, molho de tomate e orégano.",
    image: "assets/catalogo-sertao.png",
    prices: { P: 32.9, M: 39.9, G: 46.9 },
    available: true,
    featured: false
  },
  {
    id: 17,
    name: "Sol na Brasa",
    category: "especiais-brasa",
    description: "Mussarela, carne de sol, queijo coalho, molho de tomate e orégano.",
    image: "assets/catalogo-sol-na-brasa.png",
    prices: { P: 34.9, M: 42.9, G: 49.9 },
    available: true,
    featured: true
  },
  {
    id: 18,
    name: "Paraibana",
    category: "especiais-brasa",
    description: "Mussarela, carne de sol, bacon, queijo coalho, cebola roxa, molho de tomate e orégano.",
    image: "assets/catalogo-paraibana.png",
    prices: { P: 34.9, M: 42.9, G: 49.9 },
    available: true,
    featured: false
  },
  {
    id: 19,
    name: "Pepperoni Especial",
    category: "especiais-brasa",
    description: "Mussarela, pepperoni, bacon, cream cheese, molho de tomate e orégano.",
    image: "assets/catalogo-pepperoni-especial.png",
    prices: { P: 34.9, M: 42.9, G: 49.9 },
    available: true,
    featured: false
  },

  // CAMARÃO
  {
    id: 20,
    name: "Camarão Brasa",
    category: "camarao",
    description: "Camarão, mussarela, bacon, cream cheese, molho de tomate e orégano.",
    image: "assets/catalogo-camarao-brasa.png",
    prices: { P: 38.9, M: 46.9, G: 54.9 },
    available: true,
    featured: false
  },
  {
    id: 21,
    name: "Camarão Oriental",
    category: "camarao",
    description: "Camarão, mussarela, cream cheese, molho tarê, molho de tomate, cebola e orégano.",
    image: "assets/catalogo-camarao-oriental.png",
    prices: { P: 38.9, M: 46.9, G: 54.9 },
    available: true,
    featured: false
  },
  {
    id: 22,
    name: "Camarão Cremoso",
    category: "camarao",
    description: "Camarão, mussarela, Catupiry®, gorgonzola, molho de tomate e orégano.",
    image: "assets/catalogo-camarao-cremoso.png",
    prices: { P: 42.9, M: 51.9, G: 59.9 },
    available: true,
    featured: false
  },

  // DOCES
  {
    id: 23,
    name: "Chocolate",
    category: "doces",
    description: "Mussarela e chocolate ao leite.",
    image: "assets/catalogo-chocolate.png",
    prices: { P: 27.9, M: 33.9, G: 39.9 },
    available: true,
    featured: false
  },
  {
    id: 24,
    name: "Chocolate Branco",
    category: "doces",
    description: "Mussarela e chocolate branco.",
    image: "assets/catalogo-chocolate-branco.png",
    prices: { P: 29.9, M: 36.9, G: 42.9 },
    available: true,
    featured: false
  },
  {
    id: 25,
    name: "Banana com Canela",
    category: "doces",
    description: "Mussarela, banana, canela e leite condensado.",
    image: "assets/catalogo-banana-canela.png",
    prices: { P: 29.9, M: 36.9, G: 42.9 },
    available: true,
    featured: false
  },
  {
    id: 26,
    name: "Cartola",
    category: "doces",
    description: "Mussarela, banana e chocolate ao leite.",
    image: "assets/catalogo-cartola.png",
    prices: { P: 29.9, M: 36.9, G: 42.9 },
    available: true,
    featured: false
  },
  {
    id: 27,
    name: "Banana Nevada",
    category: "doces",
    description: "Mussarela, banana, Catupiry® e chocolate branco.",
    image: "assets/catalogo-banana-nevada.png",
    prices: { P: 29.9, M: 36.9, G: 42.9 },
    available: true,
    featured: false
  },

  // BEBIDAS
  {
    id: 28,
    name: "Coca-Cola 350ml",
    category: "bebidas",
    description: "Bebida gelada para acompanhar seu pedido.",
    image: "assets/bebida-coca-350.jpg",
    price: 6.9,
    available: true,
    featured: false
  },
  {
    id: 29,
    name: "Coca-Cola 600ml",
    category: "bebidas",
    description: "Bebida gelada para acompanhar seu pedido.",
    image: "assets/bebida-coca-600.jpg",
    price: 8.9,
    available: true,
    featured: true
  },
  {
    id: 30,
    name: "Coca-Cola 1 litro",
    category: "bebidas",
    description: "Bebida gelada para acompanhar seu pedido.",
    image: "assets/bebida-coca-1l.jpg",
    price: 10.9,
    available: true,
    featured: false
  },
  {
    id: 31,
    name: "Guaraná 350ml",
    category: "bebidas",
    description: "Bebida gelada para acompanhar seu pedido.",
    image: "assets/bebida-guarana-350.jpg",
    price: 6.9,
    available: true,
    featured: false
  },
  {
    id: 32,
    name: "Guaraná 600ml",
    category: "bebidas",
    description: "Bebida gelada para acompanhar seu pedido.",
    image: "assets/bebida-guarana-600.jpg",
    price: 8.9,
    available: true,
    featured: false
  },
  {
    id: 33,
    name: "Guaraná 1 litro",
    category: "bebidas",
    description: "Bebida gelada para acompanhar seu pedido.",
    image: "assets/bebida-guarana-1l.png",
    price: 10.9,
    available: true,
    featured: false
  },
  {
    id: 34,
    name: "Água mineral",
    category: "bebidas",
    description: "Bebida gelada para acompanhar seu pedido.",
    image: "assets/bebida-agua-crystal.png",
    price: 4.9,
    available: true,
    featured: true
  }
];

const CATEGORY_LABELS = {
  todas: "Todas",
  classicas: "Clássicas",
  "classicas-especiais": "Clássicas Especiais",
  "especiais-brasa": "Especiais da Brasa",
  camarao: "Camarão",
  doces: "Doces",
  bebidas: "Bebidas"
};


