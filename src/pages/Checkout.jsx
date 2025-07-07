import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [desconto, setDesconto] = useState(0);
  const [mensagemCheckout, setMensagemCheckout] = useState('');
  const [tipoMensagemCheckout, setTipoMensagemCheckout] = useState('');

  const [mostrarFretes, setMostrarFretes] = useState(false);
  const [freteSelecionado, setFreteSelecionado] = useState(null);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);

    const total = storedCart.reduce(
      (acc, item) => acc + parseFloat(item.preco) * (item.quantidade || 1),
      0
    );
    setSubtotal(total);

    const descontoSalvo = parseFloat(localStorage.getItem('desconto')) || 0;
    setDesconto(descontoSalvo);
  }, []);

  const getTotalComDesconto = () => {
    return (subtotal * (1 - desconto)).toFixed(2);
  };

  const handleContinue = () => {
    if (!email.trim() || !cep.trim() || cartItems.length === 0) {
      setMensagemCheckout('⚠️ Preencha todos os campos obrigatórios antes de continuar.');
      setTipoMensagemCheckout('erro');
      setTimeout(() => {
        setMensagemCheckout('');
        setTipoMensagemCheckout('');
      }, 3000);
      return;
    }

    setMostrarFretes(true);
  };

  const handleIrParaPagamento = () => {
    if (!freteSelecionado) {
      setMensagemCheckout('⚠️ Selecione uma opção de frete.');
      setTipoMensagemCheckout('erro');
      setTimeout(() => {
        setMensagemCheckout('');
        setTipoMensagemCheckout('');
      }, 3000);
      return;
    }

    navigate('/pagamento');
  };

  // Caminho da imagem padrão (coloque a imagem no public ou ajuste o caminho)
  const imagemPlaceholder = '/placeholder.png';

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Coluna principal */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Dados de contato</h2>
          <input
            type="email"
            placeholder="E-mail"
            className="w-full border border-purple-300 p-3 rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex items-center gap-2 mb-6">
            <input type="checkbox" className="accent-purple-600" />
            <label className="text-sm text-purple-700">
              Receber ofertas e novidades por e-mail
            </label>
          </div>

          <h2 className="text-xl font-semibold mb-4">Entrega</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="CEP"
              className="w-full border border-purple-300 p-3 rounded"
              value={cep}
              onChange={(e) => {
                const apenasNumeros = e.target.value.replace(/\D/g, '');
                setCep(apenasNumeros);
              }}
            />
            <button
              className="text-sm text-purple-700"
              onClick={() =>
                window.open(
                  'https://buscacepinter.correios.com.br/app/endereco/index.php',
                  '_blank'
                )
              }
            >
              Não sei meu CEP
            </button>
          </div>

         {!mostrarFretes ? (
  <button
    onClick={handleContinue}
    className="mt-8 w-full bg-[#591E65] hover:bg-[#3f154b] text-white py-3 rounded"
  >
    CONTINUAR
  </button>
) : (
  <>
    {/* Opções de frete */}
    <div className="mt-8">
      <p className="uppercase text-xs text-gray-500 font-bold mb-4">Envio a domicílio</p>
      <div className="space-y-4">
        {[ 
          { id: 1, titulo: 'Nuvem Envio - Jadlog Rápido', data: 'Chega quinta-feira 10/07', preco: 0, original: 'R$30,89' },
          { id: 2, titulo: 'Nuvem Envio Correios SEDEX', data: 'Chega quinta-feira 10/07', preco: 0, original: 'R$53,55' },
          { id: 3, titulo: 'Nuvem Envio - Jadlog Econômico', data: 'Chega sexta-feira 11/07', preco: 0, original: 'R$40,32' },
          { id: 4, titulo: 'Nuvem Envio Correios PAC', data: 'Chega quinta-feira 17/07', preco: 0, original: 'R$61,24' },
          { id: 5, titulo: 'Frete Fixo para Pelotas', data: 'Chega entre segunda-feira 30/06 e quinta-feira 03/07', preco: 5 },
        ].map((frete) => (
          <label key={frete.id} className="flex items-center justify-between border rounded p-3 cursor-pointer hover:bg-purple-50">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="frete"
                value={frete.id}
                checked={freteSelecionado === frete.id}
                onChange={() => setFreteSelecionado(frete.id)}
                className="accent-purple-600"
              />
              <div>
                <p className="text-sm font-medium text-purple-800">{frete.titulo}</p>
                <p className="text-xs text-gray-600">{frete.data}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{frete.preco === 0 ? 'Grátis' : `R$${frete.preco.toFixed(2)}`}</p>
              {frete.original && frete.preco === 0 && (
                <p className="text-xs line-through text-gray-400">{frete.original}</p>
              )}
            </div>
          </label>
        ))}

        <p className="uppercase text-xs text-gray-500 font-bold mt-6 mb-2">Retirar em</p>
        <label className="flex items-center justify-between border rounded p-3 cursor-pointer hover:bg-purple-50">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="frete"
              value="retirar"
              checked={freteSelecionado === 'retirar'}
              onChange={() => setFreteSelecionado('retirar')}
              className="accent-purple-600"
            />
            <div>
              <p className="text-sm font-medium text-purple-800">Pedido a ser retirado em Siegas.</p>
              <p className="text-xs text-gray-600">
                Juscelino Kubitschek de Oliveira 3005 – Centro. Atendimento de Segunda à Sexta das 14:00 às 19:00 e Sábado das 9:15 às 13:00.
              </p>
            </div>
          </div>
          <div className="text-right text-sm font-semibold">Grátis</div>
        </label>
      </div>

      <button
        onClick={handleIrParaPagamento}
        className="mt-8 w-full bg-[#591E65] hover:bg-[#3f154b] text-white py-3 rounded"
      >
        CONTINUAR PARA PAGAMENTO
      </button>
    </div>
  </>
)}
        </div>

        {/* Resumo do pedido */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Resumo do pedido</h2>
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div key={index} className="flex gap-3 border-b pb-3">
                <img
                  src={Array.isArray(item.imagem) ? item.imagem[0] : item.imagem || imagemPlaceholder}
                  alt={item.produto}
                  className="w-16 h-16 object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.produto}</p>
                  <p className="text-xs text-gray-500">x {item.quantidade}</p>
                </div>
                <p className="text-sm font-semibold">
                  R${(parseFloat(item.preco) * item.quantidade).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>R${subtotal.toFixed(2)}</span>
            </div>

            {desconto > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Desconto aplicado</span>
                <span>-{(desconto * 100).toFixed(0)}%</span>
              </div>
            )}

            <div className="flex justify-between text-base font-semibold mt-2">
              <span>Total</span>
              <span>R${getTotalComDesconto()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
