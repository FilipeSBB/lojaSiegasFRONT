import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [cupom, setCupom] = useState('');
  const [mensagemCupom, setMensagemCupom] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');
  const [desconto, setDesconto] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Usamos ref para armazenar o carrinho antigo e comparar
  const prevCartRef = useRef([]);
useEffect(() => {
  const updateCartFromStorage = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];

    // Corrige imagens que vieram como array
    const cartCorrigido = savedCart.map(item => ({
      ...item,
      imagem: Array.isArray(item.imagem) ? item.imagem[0] : item.imagem
    }));

    // Se é a primeira vez (prevCartRef.current vazio)
    if (prevCartRef.current.length === 0) {
      prevCartRef.current = cartCorrigido;

      const descontoSalvo = parseFloat(localStorage.getItem('desconto')) || 0;
      const cupomSalvo = localStorage.getItem('cupom') || '';

      setCartItems(cartCorrigido);
      setDesconto(descontoSalvo);
      setCupom(cupomSalvo);

      if (descontoSalvo > 0 && cupomSalvo) {
        setMensagemCupom('✅ Cupom aplicado com sucesso!');
        setTipoMensagem('sucesso');
      } else {
        setMensagemCupom('');
        setTipoMensagem('');
      }

      return;
    }

    const prevIds = prevCartRef.current.map(item => item.id);
    const newIds = cartCorrigido.map(item => item.id);
    const hasNewProduct = newIds.some(id => !prevIds.includes(id));

    if (hasNewProduct) {
      setCupom('');
      setDesconto(0);
      setMensagemCupom('');
      setTipoMensagem('');
      localStorage.removeItem('desconto');
      localStorage.removeItem('cupom');
    } else {
      const descontoSalvo = parseFloat(localStorage.getItem('desconto')) || 0;
      const cupomSalvo = localStorage.getItem('cupom') || '';

      setDesconto(descontoSalvo);
      setCupom(cupomSalvo);

      if (descontoSalvo > 0 && cupomSalvo) {
        setMensagemCupom('✅ Cupom aplicado com sucesso!');
        setTipoMensagem('sucesso');
      } else {
        setMensagemCupom('');
        setTipoMensagem('');
      }
    }

    setCartItems(cartCorrigido);
    prevCartRef.current = cartCorrigido;
  };

  updateCartFromStorage();
  window.addEventListener('cartUpdated', updateCartFromStorage);
  return () => window.removeEventListener('cartUpdated', updateCartFromStorage);
}, []);


  const updateQuantity = (id, quantity) => {
    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantidade: quantity } : item
    );
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.info('Item removido do carrinho.');
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const aplicarCupom = () => {
    if (cupom.trim().toUpperCase() === 'SIEGAS10') {
      setMensagemCupom('✅ Cupom aplicado com sucesso!');
      setTipoMensagem('sucesso');
      setDesconto(0.1);
      localStorage.setItem('desconto', '0.1'); // Salva no localStorage
      localStorage.setItem('cupom', 'SIEGAS10');
    } else {
      setMensagemCupom('❌ Cupom inválido. Tente novamente.');
      setTipoMensagem('erro');
      setDesconto(0);
      localStorage.removeItem('desconto');
      localStorage.removeItem('cupom');
    }

    setTimeout(() => {
      setMensagemCupom('');
      setTipoMensagem('');
    }, 3000);
  };

  const getSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + parseFloat(item.preco) * (item.quantidade || 1),
      0
    );
  };

  const getTotalComDesconto = () => {
    const subtotal = getSubtotal();
    return (subtotal * (1 - desconto)).toFixed(2);
  };

  const handleCheckout = () => {
    if (!token) {
      toast.error('Faça login para continuar');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center">Carrinho</h1>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500">🛒 Seu carrinho está vazio.</div>
      ) : (
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded p-6">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-2">Produto</th>
                <th className="pb-2">Preço</th>
                <th className="pb-2">Quantidade</th>
                <th className="pb-2">Subtotal</th>
                <th className="pb-2">Remover</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.id} className="border-b">
                  <td className="flex items-center gap-4 py-4">
                    <img
                      src={item.imagem || ''}
                      alt={item.produto}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <span>{item.produto}</span>
                  </td>
                  <td>R$ {parseFloat(item.preco).toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantidade || 1}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value))
                      }
                      className="w-16 border rounded p-1 text-center"
                    />
                  </td>
                  <td>
                    R$ {(item.quantidade * parseFloat(item.preco)).toFixed(2)}
                  </td>
                  <td>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors duration-200"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-col md:flex-row justify-between mt-8 gap-4">
            {/* Área do cupom */}
            <div className="w-full md:w-1/2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Cupom"
                  className="border p-2 rounded flex-grow text-sm"
                  value={cupom}
                  onChange={(e) => setCupom(e.target.value)}
                />
                <button
                  className="bg-[#591E65] text-white px-4 py-2 rounded text-sm hover:bg-[#3f154b]"
                  onClick={aplicarCupom}
                >
                  Aplicar
                </button>
              </div>

              {mensagemCupom && (
                <div
                  className={`mt-3 px-4 py-2 rounded text-sm transition ${
                    tipoMensagem === 'sucesso'
                      ? 'bg-green-100 border border-green-300 text-green-800'
                      : 'bg-red-100 border border-red-300 text-red-800'
                  }`}
                >
                  {mensagemCupom}
                </div>
              )}
            </div>

            {/* Área do total */}
            <div className="text-right w-full md:w-1/2">
              <p className="text-lg font-semibold">
                Subtotal: R$ {getSubtotal().toFixed(2)}
              </p>
              {desconto > 0 && (
                <p className="text-sm text-green-700">
                  Desconto aplicado: -{(desconto * 100).toFixed(0)}%
                </p>
              )}
              <p className="text-xl font-bold mt-1">
                Total: R$ {getTotalComDesconto()}
              </p>
              <button
                onClick={handleCheckout}
                className="mt-4 bg-[#591E65] text-white px-6 py-2 rounded hover:bg-[#3f154b] transition"
              >
                Fazer Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
