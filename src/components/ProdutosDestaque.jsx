import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ProdutosContext } from "../context/ProdutosContext";
import { Link } from "react-router-dom"; // <- aqui

const ProdutosDestaque = () => {
  const { produtos, setProdutos } = useContext(ProdutosContext);
  const [loading, setLoading] = useState(true);

  const fetchProdutos = async () => {
    try {
      const response = await axios.get(
        "http://localhost:55000/siega/destaques"
      );
      setProdutos(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  return (
    <div className="px-4 py-8">
      <h2 className="text-center text-3xl font-bold mb-8">
        Produtos em Destaque
      </h2>

      {loading ? (
        <p className="text-center">Carregando...</p>
      ) : produtos.length === 0 ? (
        <p className="text-center">Não há produtos em destaque no momento.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produtos.map((produto) => {
            const preco = Number(produto.preco);
            const precoAntigo = preco * 1.2;
            const parcelamento = `6x de R$${(preco / 6).toFixed(2)} sem juros`;

            return (
              <Link to={`/produto/${produto.id}`} key={produto.id}> {/* aqui */}
                <div className="relative bg-white rounded-md shadow-md overflow-hidden transition duration-300 hover:shadow-lg cursor-pointer">
                  <div className="w-full h-60 overflow-hidden">
                    <img
                      src={produto.imagem}
                      alt={produto.nome}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <div className="absolute top-2 left-2 space-y-1 z-10">
                    {preco > 200 && (
                      <span className="bg-purple-800 text-white text-xs font-semibold px-2 py-1 rounded block">
                        FRETE GRÁTIS
                      </span>
                    )}
                  </div>

                  <div className="p-3">
                    <h3 className="text-sm font-medium mb-1 truncate">{produto.nome}</h3>
                    <div className="text-gray-500 text-xs line-through">
                      R${precoAntigo.toFixed(2)}
                    </div>
                    <div className="text-lg font-bold text-[#591E65]">
                      R${preco.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{parcelamento}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProdutosDestaque;
