import React from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function ProdutoItem({ id, nome, preco, imagem, onAddToCart }) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition flex flex-col items-center text-center">
      {/* Link para detalhes do produto */}
      <Link to={`/produto/${id}`} className="w-full">
        <img
          src={imagem[0]}
          alt={nome}
          className="w-full h-40 object-cover rounded mb-2"
        />
        <h3
          className="text-base mb-1 font-normal"
          style={{ color: '#320143' }}
        >
          {nome}
        </h3>
        <p
          className="text-sm mb-2 font-normal"
          style={{ color: '#320143' }}
        >
          R$ {Number(preco).toFixed(2)}
        </p>
      </Link>

      {/* Botão Comprar */}
      <button
        onClick={onAddToCart} // chama a função passada como prop
        className="mt-auto bg-[#591E65] hover:bg-[#532664] text-white px-4 py-2 rounded w-full transition-colors"
      >
        Comprar
      </button>
    </div>
  );
}

export default ProdutoItem;
