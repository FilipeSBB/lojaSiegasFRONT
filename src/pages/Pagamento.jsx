import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Pagamento = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [cupom, setCupom] = useState(null);
  const [totalComDesconto, setTotalComDesconto] = useState(0);

  // Campos do cartão
  const [numeroCartao, setNumeroCartao] = useState('');
  const [titular, setTitular] = useState('');
  const [validade, setValidade] = useState('');
  const [cvc, setCvc] = useState('');

  // Estado para mostrar mensagens
  const [loading, setLoading] = useState(false);
  const [erroMsg, setErroMsg] = useState('');
  const [sucessoMsg, setSucessoMsg] = useState('');

  useEffect(() => {
    // Carrega carrinho e cupom do localStorage
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);

    const total = storedCart.reduce(
      (acc, item) => acc + item.preco * item.quantidade,
      0
    );
    setSubtotal(total);

    const cupomRaw = localStorage.getItem('cupomDesconto');
    if (cupomRaw) {
      try {
        const cupom = JSON.parse(cupomRaw);
        let desconto = 0;

        if (cupom.tipo === 'porcentagem') {
          desconto = total * (cupom.valor / 100);
        } else if (cupom.tipo === 'valor') {
          desconto = cupom.valor;
        }

        setCupom(cupom);
        setTotalComDesconto(Math.max(total - desconto, 0));
      } catch {
        setCupom(null);
        setTotalComDesconto(total);
      }
    } else {
      setTotalComDesconto(total);
    }
  }, []);

  const isFormValid = numeroCartao && titular && validade && cvc;

  const handlePay = async () => {
    setErroMsg('');
    setSucessoMsg('');

    const clienteId = localStorage.getItem('clienteId'); // ajustar conforme seu storage

    if (!clienteId) {
      setErroMsg('Você precisa estar logado para finalizar o pedido.');
      setTimeout(() => setErroMsg(''), 4000);
      return;
    }

    if (cartItems.length === 0) {
      setErroMsg('Seu carrinho está vazio.');
      setTimeout(() => setErroMsg(''), 4000);
      return;
    }

    setLoading(true);

    const pedido = {
      clienteId,
      produtos: cartItems.map(item => ({
        produto: item.produto,
        quantidade: item.quantidade,
        preco: item.preco,
      })),
      total: totalComDesconto,
    };

    try {
      const response = await fetch('http://localhost:55000/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // se usar token Bearer
        },
        body: JSON.stringify(pedido),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErroMsg('Erro ao registrar pedido: ' + (errorData.msg || 'Tente novamente.'));
        setLoading(false);
        setTimeout(() => setErroMsg(''), 5000);
        return;
      }

      const dadosPedido = await response.json();
      setSucessoMsg('Pedido registrado com sucesso! Redirecionando...');

      // Limpa o carrinho
      localStorage.removeItem('cart');

      setTimeout(() => {
        setLoading(false);
        navigate(`/pedido-confirmado/${dadosPedido.id}`);
      }, 2000);
    } catch (error) {
      setErroMsg('Erro ao conectar com o servidor.');
      setLoading(false);
      setTimeout(() => setErroMsg(''), 5000);
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Coluna principal — Formulário de pagamento */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Pagamento</h2>

          <input
            type="text"
            placeholder="Número do cartão"
            value={numeroCartao}
            onChange={(e) => setNumeroCartao(e.target.value)}
            className="w-full border border-purple-300 p-3 rounded mb-4"
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Titular do cartão"
            value={titular}
            onChange={(e) => setTitular(e.target.value)}
            className="w-full border border-purple-300 p-3 rounded mb-4"
            disabled={loading}
          />
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Validade (MM/AA)"
              value={validade}
              onChange={(e) => setValidade(e.target.value)}
              className="w-1/2 border border-purple-300 p-3 rounded"
              disabled={loading}
            />
            <input
              type="text"
              placeholder="CVC"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              className="w-1/2 border border-purple-300 p-3 rounded"
              disabled={loading}
            />
          </div>

          <button
            onClick={handlePay}
            disabled={!isFormValid || loading}
            className={`mt-4 w-full bg-[#591E65] text-white py-3 rounded transition
              ${(!isFormValid || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#3f154b]'}`}
          >
            {loading ? 'Processando pagamento...' : 'PAGAR COM CARTÃO'}
          </button>

          <button
            onClick={() => navigate('/pagamento-pix')}
            disabled={loading}
            className="mt-2 w-full border border-purple-400 text-purple-700 hover:bg-purple-50 py-3 rounded"
          >
            PAGAR COM PIX
          </button>

          {erroMsg && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded text-center">
              {erroMsg}
            </div>
          )}

          {sucessoMsg && (
            <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-800 rounded text-center">
              {sucessoMsg}
            </div>
          )}
        </div>

        {/* Coluna lateral — Resumo do pedido */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Resumo do pedido</h2>
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div key={index} className="flex gap-3 border-b pb-3">
                <img
                  src={item.imagem}
                  alt={item.produto}
                  className="w-16 h-16 object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.produto}</p>
                  <p className="text-xs text-gray-500">x {item.quantidade}</p>
                </div>
                <p className="text-sm font-semibold">
                  R${(item.preco * item.quantidade).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className={cupom ? 'line-through text-gray-400' : ''}>
                R${subtotal.toFixed(2)}
              </span>
            </div>

            {cupom && (
              <div className="flex justify-between text-sm text-green-700">
                <span>Com desconto</span>
                <span>R${totalComDesconto.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-base font-semibold mt-2">
              <span>Total</span>
              <span>R${totalComDesconto.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagamento;
