import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const Footer = ({ className }) => {
    return (
        <footer className="bg-white text-gray-800 px-8 py-10 border-t">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
    
    {/* Logo e descrição */}
    <div className="flex flex-col items-start gap-3">
      <img src={assets?.logo} alt="Logo Siegas" className="w-20" />
      <p className="text-sm">
      Conforto, qualidade e estilo para todos os momentos da sua casa.
      </p>
    </div>

    {/* Navegação */}
    <div>
      <h4 className="font-semibold mb-3 text-center">Links Rápidos</h4>
      <ul className="space-y-2 text-center">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/produtos">Produtos</Link></li>
        <li><Link to="/sobre">Sobre</Link></li>
      </ul>
    </div>

    {/* Contato */}
    <div>
      <h4 className="font-semibold mb-3">Contato</h4>
      <ul className="space-y-2 text-sm">
        <li>📞 (53) 98155-3176</li>
        <li>📞 3025-6044</li>
        <li>📧 lojasiegas@gmail.com</li>
        <li>📍 Av. Juscelino Kubitschek de Oliveira, 3005- Pelotas, RS</li>
      </ul>
    </div>
  </div>

  <div className="text-center text-xs text-gray-500 mt-10">
    © {new Date().getFullYear()} Loja Siegas. Todos os direitos reservados.
  </div>
</footer>

    );
}

export default Footer;
