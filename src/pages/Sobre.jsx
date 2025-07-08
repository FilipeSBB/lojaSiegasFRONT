import React from 'react';
import lojaFisica from '../assets/lojafisica.png'; // ajuste o caminho conforme a estrutura do seu projeto

const Sobre = () => {
  return (
    <div className="flex flex-col min-h-screen px-6 py-12 md:px-24 bg-white">
      <div className="flex flex-col md:flex-row gap-12 items-center">

        {/* Texto */}
        <div className="md:w-1/2">
          <h2 className="text-4xl font-serif mb-6">Nossa História</h2>
          <p className="text-lg leading-relaxed text-gray-800">
            A Loja Siegas nasceu da paixão e da experiência de uma família dedicada ao segmento de cama, mesa e banho há mais de 27 anos. Foi o sonho do nosso fundador, meu pai, que durante décadas trabalhou com dedicação e compromisso para oferecer produtos de qualidade que transformam a casa em um verdadeiro lar.


            <br /><br />
            Em busca de realizar esse sonho, ele decidiu abrir a loja no coração de Pelotas, no centro da cidade, um local estratégico que facilitasse o acesso e aproximasse nossos clientes do que há de melhor em conforto e estilo para o dia a dia.
            Aqui na Siegas, continuamos a tradição familiar com muito carinho, prezando pela excelência no atendimento e a seleção cuidadosa dos produtos, para levar até você o melhor em qualidade e design. Nossa história é feita de trabalho, confiança e da certeza de que cada cliente merece o melhor.

            <br /><br />
            Venha nos visitar e faça parte da família Siegas!
          </p>
        </div>

        {/* Imagem */}
        <div className="md:w-1/2">
          <img
            src={lojaFisica}
            alt="Imagem da loja"
            className=" h-auto rounded-xl shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default Sobre;

