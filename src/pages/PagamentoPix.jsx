import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';

const PagamentoPix = () => {
  const navigate = useNavigate();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [pixCode, setPixCode] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [cupom, setCupom] = useState(null);
  const [erroMsg, setErroMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const code = `pix-${Math.random().toString(36).substring(2, 12)}`;
    setPixCode(code);

    QRCode.toDataURL(code)
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error(err));

    // Carrega carrinho e cupom do localStorage
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);

    const totalCalc = storedCart.reduce(
      (acc, item) => acc + item.preco * item.quantidade,
      0
    );

    const cupomRaw = localStorage.getItem('cupomDesconto');
    if (cupomRaw) {
      try {
        const parsed = JSON.parse(cupomRaw);
        setCupom(parsed);

        const desconto =
          parsed.tipo === 'porcentagem'
            ? totalCalc * (parsed.valor / 100)
            : parsed.valor;

        setTotal(Math.max(totalCalc - desconto, 0));
      } catch {
        setTotal(totalCalc);
      }
    } else {
      setTotal(totalCalc);
    }
  }, []);

  const handleConfirm = async () => {
    const clienteId = localStorage.getItem('clienteId');
    if (!clienteId) {
      setErroMsg('Você precisa estar logado para finalizar o pedido.');
      return;
    }

    if (cartItems.length === 0) {
      setErroMsg('Seu carrinho está vazio.');
      return;
    }

    setLoading(true);

    const pedido = {
      clienteId,
      metodo: 'PIX',
      produtos: cartItems.map(item => ({
        produto: item.produto,
        quantidade: item.quantidade,
        preco: item.preco,
      })),
      total,
    };

    try {
      const response = await fetch('https://lojasiegasbackend.onrender.com/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(pedido),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErroMsg('Erro ao registrar pedido: ' + (errorData.msg || 'Tente novamente.'));
        setLoading(false);
        return;
      }

      const dadosPedido = await response.json();

      // Limpa o carrinho
      localStorage.removeItem('cart');
      localStorage.removeItem('cupomDesconto');

      setLoading(false);
      navigate(`/pedido-confirmado/${dadosPedido.id}`);
    } catch (error) {
      setErroMsg('Erro ao conectar com o servidor.');
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white p-6 mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">Pagamento com PIX</h2>

      <p className="mb-4 text-center text-gray-600">
        Escaneie o QR Code abaixo com seu app de banco:
      </p>

      {qrCodeUrl && (
        <div className="bg-white p-6 border rounded-lg shadow mb-6">
          <img src={qrCodeUrl} alt="QR Code do PIX" className="w-52 h-52 mx-auto" />
          <p className="mt-4 text-sm text-center break-all text-gray-500">
            {pixCode}
          </p>
        </div>
      )}

      <button
        onClick={handleConfirm}
        disabled={loading}
        className="bg-[#591E65] hover:bg-[#3f154b] text-white py-3 px-6 rounded"
      >
        {loading ? 'Confirmando pagamento...' : 'Já paguei'}
      </button>

      {erroMsg && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded text-center">
          {erroMsg}
        </div>
      )}
    </div>
  );
};

export default PagamentoPix;
