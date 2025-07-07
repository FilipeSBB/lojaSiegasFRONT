import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import iconeCarrinho from '../assets/iconecarrinho.png';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName');

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + (item.quantidade || 1), 0);
    setCartCount(totalItems);
  };

  useEffect(() => {
    updateCartCount(); // Inicializa o contador

    // Atualiza quando o evento personalizado for disparado
    const handleCartUpdated = () => {
      updateCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdated);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdated);
    };
  }, []);

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  localStorage.removeItem('clienteId'); // 🔑 limpa o clienteId também
  localStorage.removeItem('cart');      // opcional: limpa o carrinho
  localStorage.removeItem('desconto');  // opcional: limpa desconto
  setProfileDropdownOpen(false);
  navigate('/login');
};
  return (
    <div className="flex items-center justify-between h-[110px] font-medium">
      {/* Logo */}
      <Link to="/">
        <img
          src={assets?.logo}
          className="mb-6 w-24 sm:w-28 md:w-32 object-contain"
          alt="Logo"
        />
      </Link>

      {/* Navegação Desktop */}
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        {['Home', 'Produtos', 'Sobre'].map((item, index) =>
          item === 'Home' ? (
            <Link key={index} to="/" className="flex flex-col items-center gap-1">
              <p>{item}</p>
              <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
            </Link>
          ) : (
            <NavLink
              key={index}
              to={`/${item.toLowerCase()}`}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 ${isActive ? 'active' : ''}`
              }
            >
              <p>{item}</p>
              <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
            </NavLink>
          )
        )}
      </ul>

      {/* Ícones */}
      <div className="flex items-center gap-6">
        {/* Perfil + Nome */}
        <div className="relative">
          <div
            onClick={toggleProfileDropdown}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            {userName && (
              <span className="text-gray-700 text-sm">Olá, {userName}</span>
            )}
            <img
              className="w-5 transition-transform transform hover:scale-110"
              src={assets?.profile_icon}
              alt="Profile"
            />
          </div>

          {/* Dropdown */}
          {profileDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 w-40 bg-white shadow-lg rounded-md border border-gray-200 z-10">
   {token ? (
  <>
    <Link
      to="/historico"
      onClick={() => setProfileDropdownOpen(false)}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
    >
      Pedidos
    </Link>
    <button
      onClick={handleLogout}
      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
    >
      Sair
    </button>
  </>
) : (
  <>
    <Link
      to="/login"
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
      onClick={() => setProfileDropdownOpen(false)}
    >
      Entrar
    </Link>
    <button
      onClick={() => {
        setProfileDropdownOpen(false);
        navigate('/register');
      }}
      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
    >
      Cadastrar
    </button>
  </>
)}
            </div>
          )}
        </div>

        {/* Carrinho */}
        <Link to="/cart" className="relative">
          <img
            src={iconeCarrinho}
            className="w-6 h-6 transition-transform transform hover:scale-110"
            alt="Carrinho"
          />
          {cartCount > 0 && (
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              {cartCount}
            </p>
          )}
        </Link>

        {/* Menu Mobile */}
        <img
          onClick={() => setVisible(true)}
          src={assets?.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt="Menu"
        />
      </div>

      {/* Sidebar Mobile */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? 'w-full' : 'w-0'
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img className="h-4 rotate-180" src={assets?.dropdown_icon} alt="Voltar" />
            <p>Voltar</p>
          </div>
          {['Home', 'Produtos', 'Sobre'].map((item, index) => (
            <NavLink
              key={index}
              onClick={() => setVisible(false)}
              className="py-2 pl-6 border"
              to={`/${item.toLowerCase()}`}
            >
              {item}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
