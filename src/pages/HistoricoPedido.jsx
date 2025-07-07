import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HistoricoPedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      const clienteId = localStorage.getItem("clienteId");

      // 🔒 Se não estiver logado, limpa os pedidos e sai
      if (!clienteId) {
        setPedidos([]);
        return;
      }

      try {
        const response = await axios.get("http://localhost:55000/pedidos");

        const pedidosFiltrados = response.data
          .filter(p => p.clienteId === clienteId)
          .map(p => ({
            ...p,
            produtos: typeof p.produtos === "string" ? JSON.parse(p.produtos) : p.produtos
          }));

        setPedidos(pedidosFiltrados);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      }
    };

    fetchPedidos();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Pedidos</h2>

      {pedidos.length > 0 ? (
        pedidos.map(pedido => (
          <div key={pedido.id} className="mb-6 border-b pb-4">
            <div className="text-sm text-gray-500 flex justify-between mb-2">
              <span><strong>DATA:</strong> {new Date(pedido.createdAt).toLocaleDateString()}</span>
              <span><strong>PEDIDO #</strong> {pedido.id}</span>
            </div>

            {pedido.produtos.map((item, index) => (
              <div key={index} className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold">{item.produto}</p>
                  <p className="text-gray-500 text-sm">Qtd: {item.quantidade}</p>
                </div>
                <p className="font-medium">R$ {parseFloat(item.preco).toFixed(2)}</p>
              </div>
            ))}

            <div className="flex justify-between mt-2">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-purple-700">R$ {parseFloat(pedido.total).toFixed(2)}</span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">Nenhum pedido encontrado.</p>
      )}
    </div>
  );
};

export default HistoricoPedidos;
