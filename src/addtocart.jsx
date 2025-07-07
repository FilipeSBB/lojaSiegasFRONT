// src/cartHelpers.js
export function addToCart(produtoNovo) {
  const carrinhoAtual = JSON.parse(localStorage.getItem('cart')) || [];

  const existe = carrinhoAtual.find(item => item.id === produtoNovo.id);

  if (existe) {
    const novoCarrinho = carrinhoAtual.map(item =>
      item.id === produtoNovo.id
        ? { ...item, quantidade: (item.quantidade || 1) + 1 }
        : item
    );
    localStorage.setItem('cart', JSON.stringify(novoCarrinho));
  } else {
    carrinhoAtual.push({ ...produtoNovo, quantidade: 1 });
    localStorage.setItem('cart', JSON.stringify(carrinhoAtual));
  }
}
