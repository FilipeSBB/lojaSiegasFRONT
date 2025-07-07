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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel
            vehicula eros. Nullam semper nec lacus eget condimentum. Curabitur
            accumsan, nisi id pellentesque elementum, eros risus accumsan nisl,
            at convallis nisi nunc et odio. Nam interdum justo non est posuere
            vehicula. Fusce fringilla felis quis mi feugiat scelerisque.
            <br /><br />
            Aenean malesuada eu tortor ac consequat. Donec et purus vitae libero
            mollis eleifend. Phasellus suscipit bibendum odio, a fermentum risus
            tincidunt at. Praesent eget elit id purus sodales euismod ut at orci.
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
            posuere cubilia curae; Suspendisse potenti.
            <br /><br />
            Aliquam erat volutpat. Donec fringilla felis vitae quam interdum
            tincidunt. Integer ultricies lacus vitae mi pretium, ut fringilla
            odio vehicula. Nam dapibus, arcu nec pulvinar volutpat, nisi libero
            gravida lacus, ut accumsan mi ipsum vel tortor. Donec dignissim
            ultrices felis, ac interdum libero ornare et.
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

