import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import Titulo from '../components/Titulo';
import ProdutoItem from '../components/ProdutoItem';
import { toast } from 'react-toastify';

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProdutos, setFilterProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [sortType, setSortType] = useState('relavent');

  const fetchProdutos = async () => {
    try {
      const response = await fetch("http://localhost:55000/listarprodutos");
      if (response.ok) {
        const data = await response.json();
        data.forEach((produto, index) => {
          console.log(`🔍 Produto ${index + 1}:`, produto);
        });
        setProdutos(data);
      } else {
        console.error("Erro ao carregar os produtos.");
      }
    } catch (error) {
      console.error("Erro ao buscar os produtos:", error);
    }
  };

  const toggleCategoria = (e) => {
    const valor = e.target.value;
    setCategorias((prev) =>
      prev.includes(valor) ? prev.filter((item) => item !== valor) : [...prev, valor]
    );
  };

  const applyFiltro = () => {
    let produtosFiltrados = produtos;

    if (categorias.length > 0) {
      produtosFiltrados = produtosFiltrados.filter((item) => categorias.includes(item.categorias));
    }

    setFilterProdutos(produtosFiltrados);
  };

  const sortProduto = () => {
    let copia = [...filterProdutos];

    switch (sortType) {
      case 'low-high':
        copia.sort((a, b) => a.preco - b.preco);
        break;
      case 'high-low':
        copia.sort((a, b) => b.preco - a.preco);
        break;
      default:
        applyFiltro();
        return;
    }

    setFilterProdutos(copia);
  };

  // Função para adicionar produto ao carrinho e atualizar contador
const addToCart = (product) => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingIndex = cart.findIndex(item => item.id === product.id);

  if (existingIndex >= 0) {
    cart[existingIndex].quantidade = (cart[existingIndex].quantidade || 1) + 1;
  } else {
    cart.push({ ...product, quantidade: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));

  window.dispatchEvent(new Event('cartUpdated'));

  toast.success(
    <div>
      <p className="text-sm font-medium">🛍️ Produto adicionado!</p>
      <span className="text-xs text-gray-600">Veja no seu carrinho.</span>
    </div>,
    {
      position: 'bottom-left',
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: {
        borderRadius: '8px',
        background: '#fff',
        color: '#320143',
        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
      },
      icon: false
    }
  );
};

  useEffect(() => {
    fetchProdutos();
  }, []);

  useEffect(() => {
    setFilterProdutos(produtos);
  }, [produtos]);

  useEffect(() => {
    applyFiltro();
  }, [categorias]);

  useEffect(() => {
    sortProduto();
  }, [sortType]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t flex-grow">
        {/* Filtro */}
        <div className="min-w-60">
          <p
            className="my-2 text-xl flex items-center cursor-pointer gap-2"
            onClick={() => setShowFilter(!showFilter)}
          >
            Filtros
            <img
              className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
              src={assets.dropdown_icon}
              alt="Dropdown icon"
            />
          </p>
          <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
            <p className="mb-3 text-sm font-medium">Categorias</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              <label className="flex gap-2">
                <input className="w-3" type="checkbox" value="Cama" onChange={toggleCategoria} /> Cama
              </label>
              <label className="flex gap-2">
                <input className="w-3" type="checkbox" value="Mesa" onChange={toggleCategoria} /> Mesa
              </label>
              <label className="flex gap-2">
                <input className="w-3" type="checkbox" value="Banho" onChange={toggleCategoria} /> Banho
              </label>
            </div>
          </div>
        </div>

        {/* Produtos */}
        <div className="flex-1">
          <div className="flex justify-between text-base sm:text-2xl mb-4">
            <Titulo text1="Nossos" text2="Produtos" />
            <select
              onChange={(e) => setSortType(e.target.value)}
              className="border-2 border-gray-300 text-sm px-2"
              value={sortType}
            >
              <option value="relavent">Mais vendidos</option>
              <option value="low-high">Menor para Maior</option>
              <option value="high-low">Maior para Menor</option>
            </select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {filterProdutos.map((item, index) => (
              <ProdutoItem
                key={index}
                nome={item.produto}
                id={item.id}
                produto={item.descricao}
                preco={item.preco}
                imagem={item.imagem}
                onAddToCart={() => addToCart(item)} // Passa a função para o ProdutoItem
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Produtos;
