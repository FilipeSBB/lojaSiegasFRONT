import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import { useNavigate } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { Hero } from '../components/Hero';
import ProdutosDestaque from '../components/ProdutosDestaque';
import Footer from '../components/Footer';
import { FaInstagram } from 'react-icons/fa';

import img1 from '../assets/pao1.png';
import img2 from '../assets/pao2.png';
import img3 from '../assets/pao3.png';
import lojaFisica from '../assets/lojafisica.png';
import { Tag, CreditCard, MessageCircle } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();

  // estrelas
  const Stars = ({ count }) => {
    const starsArray = Array(5).fill(false).map((_, i) => i < count);
    return (
      <div className="flex text-yellow-400">
        {starsArray.map((filled, i) => (
          <svg
            key={i}
            className="w-5 h-5 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            {filled ? (
              <path d="M10 15l-5.878 3.09L5.82 11.18 1 7.09l6.06-.52L10 1l2.94 5.57 6.06.52-4.82 4.09 1.698 6.91z" />
            ) : (
              <path d="M10 12.25l3.09 1.62-1-3.2 2.56-2.22-3.35-.28L10 6.5l-1.3 2.63-3.35.28 2.56 2.22-1 3.2L10 12.25z" fill="none" stroke="currentColor" strokeWidth="1"/>
            )}
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Carrossel em tela cheia */}
      <div className="-mx-[calc((100vw-100%)/2)] w-screen">
        <Carousel
          showThumbs={false}
          autoPlay
          infiniteLoop
          showStatus={false}
          className="mb-8 cursor-pointer"
        >
          <div onClick={() => navigate('/produtos')} className="overflow-hidden">
            <img src={img1} alt="Imagem 1" className="h-[300px] w-full object-cover md:h-[450px]" />
          </div>
          <div onClick={() => navigate('/produtos')} className="overflow-hidden">
            <img src={img2} alt="Imagem 2" className="h-[300px] w-full object-cover md:h-[450px]" />
          </div>
          <div onClick={() => navigate('/produtos')} className="overflow-hidden">
            <img src={img3} alt="Imagem 3" className="h-[300px] w-full object-cover md:h-[450px]" />
          </div>
        </Carousel>
      </div>

      <Hero />

      <ProdutosDestaque />

      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center text-purple-900">
          <div>
            <Tag className="mx-auto h-12 w-12 mb-4" strokeWidth={1.5} />
            <h3 className="font-semibold text-lg">Ganhe 10% OFF na sua primeira compra</h3>
            <p className="text-sm mt-2">Cupom: <strong>SIEGAS10</strong></p>
          </div>

          <div>
            <CreditCard className="mx-auto h-12 w-12 mb-4" strokeWidth={1.5} />
            <h3 className="font-semibold text-lg">Parcele em até 6x sem juros!</h3>
          </div>

          <div>
            <FaWhatsapp className="mx-auto h-12 w-12 mb-4 text-danger-500" strokeWidth={1.5} />
            <h3 className="font-semibold text-lg">Fale conosco pelo Whatsapp</h3>
            <p className="text-sm mt-2 text-gray-600">(Fora do Ar)</p>
          </div>
        </div>
      </section>

      <div className="-mx-[calc((100vw-100%)/2)] w-screen">
        <section className="flex w-screen max-w-none h-[700px]">
          <div className="w-[30%] h-full">
            <img 
              src={lojaFisica} 
              alt="Interior de Siegas" 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-[70%] bg-[#F0DEF6] text-black flex flex-col justify-center px-16">
            <h2 className="text-5xl font-serif mb-4 leading-tight">
              Loja <br /> Siegas
            </h2>
            <p className="text-lg mb-8 max-w-xl">
              Conforto, qualidade e estilo para todos os momentos da sua casa.
            </p>
            <a 
              href="/sobre" 
              className="underline font-bold hover:text-gray-600 transition-colors"
            >
              Conheça nossa história
            </a>
          </div>
        </section>
      </div>

      <section className="-mx-[calc((100vw-100%)/2)] w-screen bg-[#f7f4fa] py-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-6">
            <a 
              target="_blank" 
              rel="noopener noreferrer" 
              href="https://instagram.com/siegasloja" 
              aria-label="Instagram de Siegas"
              className="inline-block"
            >
              <div className="instafeed-title flex items-center justify-center gap-3">
                <FaInstagram className="text[#581C87] w-6 h-6" />
                <h2 className="text-2xl md:text-3xl font-semibold text-[#591E65] m-0">
                  Acompanhe a Siegas no Instagram
                </h2>
              </div>
              <p className="text-sm text-gray-600 mt-2">@siegasloja</p>
            </a>
          </div>

          {/* Espaço reservado para o Swiper (carrossel), você pode adicionar depois */}
          <div 
            className="js-swiper-instafeed swiper-container transition-opacity duration-500 ease-in-out opacity-0"
            data-transition="fade-in-up"
          >
            {/* Aqui você pode futuramente adicionar imagens ou um componente Swiper/Carousel */}
          </div>   
        </div>
      </section>

      {/* Seção de Avaliações */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold text-center mb-10 text-[#591E65]">
          O que nossos clientes dizem
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Avaliação 1 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <Stars count={5} />
            <p className="mt-4 text-gray-700">
              "Preços justos e promoções especiais que facilitam renovar seu enxoval com produtos premium."
            </p>
            <p className="mt-6 font-semibold text-[#591E65]">Ana Clara</p>
          </div>

          {/* Avaliação 2 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <Stars count={4} />
            <p className="mt-4 text-gray-700">
              "Ótimo atendimento e variedade de produtos. Voltei várias vezes!"
            </p>
            <p className="mt-6 font-semibold text-[#591E65]">João Pedro</p>
          </div>

          {/* Avaliação 3 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <Stars count={5} />
            <p className="mt-4 text-gray-700">
              "Adorei a loja física, o ambiente é muito acolhedor e os produtos de qualidade."
            </p>
            <p className="mt-6 font-semibold text-[#591E65]">Mariana Souza</p>
          </div>
        </div>
      </section>

      <hr className="w-screen border-t border-gray-300 my-10" />

      {/* Mapa do Google */}
      <div className="-mx-[calc((100vw-100%)/2)] w-screen mt-10 rounded overflow-hidden shadow-lg">
        <iframe
          title="Localização da Loja Siegas"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4059.5409454762116!2d-52.334126824378984!3d-31.75625387410689!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9511b5000fb268cf%3A0x628b861e1d538906!2sSiegas!5e1!3m2!1spt-BR!2sbr!4v1749900679632!5m2!1spt-BR!2sbr"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
};

export default Home;
