import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const DetalhesProduto = () => {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [relacionados, setRelacionados] = useState([]);

  // Estado para as imagens e a imagem atualmente selecionada
  const [imagens, setImagens] = useState([]);
  const [imagemSelecionada, setImagemSelecionada] = useState('');

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await fetch(`http://localhost:55000/listarprodutos/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduto(data);

          // Ajusta imagens e imagem selecionada para o array que vem do backend
          if (Array.isArray(data.imagem) && data.imagem.length > 0) {
            setImagens(data.imagem);
            setImagemSelecionada(data.imagem[0]);
          } else if (typeof data.imagem === 'string' && data.imagem !== '') {
            // Caso backend retorne uma string única (ex: produto antigo)
            setImagens([data.imagem]);
            setImagemSelecionada(data.imagem);
          } else {
            setImagens([]);
            setImagemSelecionada('');
          }
        } else {
          console.error("Produto não encontrado");
        }
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
      }
    };

    fetchProduto();
  }, [id]);

  useEffect(() => {
    const fetchRelacionados = async () => {
      if (produto?.categorias) {
        try {
          const res = await fetch('http://localhost:55000/listarprodutos');
          const data = await res.json();
          const filtrados = data.filter(p =>
            p.categorias === produto.categorias && p.id !== produto.id
          );
          setRelacionados(filtrados);
        } catch (error) {
          console.error("Erro ao buscar relacionados:", error);
        }
      }
    };

    fetchRelacionados();
  }, [produto]);

  const adicionarAoCarrinho = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existente = cart.find(item => item.id === produto.id);

    if (existente) {
      existente.quantidade += quantidade;
    } else {
      cart.push({
        id: produto.id,
        produto: produto.produto,
        preco: produto.preco,
        imagem: imagemSelecionada, // usa a imagem selecionada, não só a primeira
        quantidade,
      });
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

  if (!produto) return <p className="p-4">Carregando produto...</p>;

  return (
    <div className="p-4 sm:p-10">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Imagens com miniaturas */}
        <div className="w-full md:w-1/2 flex gap-4">
          {/* Miniaturas na esquerda */}
          <div className="flex flex-col gap-3">
            {imagens.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Miniatura ${idx + 1}`}
                className={`w-16 h-16 object-cover rounded cursor-pointer border ${
                  img === imagemSelecionada ? 'border-[#591E65]' : 'border-gray-300'
                }`}
                onClick={() => setImagemSelecionada(img)}
              />
            ))}
          </div>

          {/* Imagem principal */}
          <div className="flex-1">
            <img
              src={imagemSelecionada}
              alt={produto.produto}
              className="rounded-lg w-full max-h-[500px] object-contain"
            />
          </div>
        </div>

        {/* Detalhes do produto */}
        <div className="w-full md:w-1/2">
          <h1 className="text-2xl sm:text-3xl text-[#320143] mb-3">{produto.produto}</h1>
          <p className="text-lg line-through text-gray-400">
            R$ {(Number(produto.preco) * 1.15 * quantidade).toFixed(2)}
          </p>
          <p className="text-2xl text-[#320143] mb-4">
            R$ {(Number(produto.preco) * quantidade).toFixed(2)}
          </p>

          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setQuantidade(q => Math.max(1, q - 1))}
              className="px-3 py-1 border border-gray-300 rounded"
            >-</button>
            <span>{quantidade}</span>
            <button
              onClick={() => setQuantidade(q => q + 1)}
              className="px-3 py-1 border border-gray-300 rounded"
            >+</button>
          </div>

          <button
            onClick={adicionarAoCarrinho}
            className="bg-[#591E65] hover:bg-[#3f154b] text-white py-2 px-6 rounded w-full sm:w-auto"
          >
            Comprar
          </button>

          <div className="mt-8 text-sm text-gray-700">
            <h2 className="text-lg font-semibold mb-2">Descrição</h2>
            <p>{produto.descricao || 'Este produto é excelente para o seu dia a dia. Aproveite já!'}</p>
          </div>
        </div>
      </div>

      {/* Produtos relacionados */}
{relacionados.length > 0 && (
  <div className="mt-16">
    <h3 className="text-xl font-semibold text-[#320143] mb-6">Produtos relacionados</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {relacionados.map((rel) => (
        <div
          key={rel.id}
          className="bg-white shadow-md hover:shadow-lg transition-shadow p-4 rounded-lg"
        >
          <Link to={`/produto/${rel.id}`}>
            <img
              src={Array.isArray(rel.imagem) ? rel.imagem[0] : rel.imagem}
              alt={rel.produto}
              className="w-full h-40 object-cover rounded transition-transform duration-300 hover:scale-105 cursor-pointer"
            />
            <h4 className="text-base font-medium text-gray-900 mt-2">{rel.produto}</h4>
          </Link>
          <p className="text-[#320143] text-lg font-bold">R$ {Number(rel.preco).toFixed(2)}</p>
          <button
            onClick={() => window.location.href = `/produto/${rel.id}`}
            className="mt-3 text-sm flex items-center justify-center gap-2 bg-[#591E65] text-white px-4 py-2 rounded hover:bg-[#3f154b] transition"
          >
            Ver produto
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  </div>
)}
    </div>
  );
};

export default DetalhesProduto;
