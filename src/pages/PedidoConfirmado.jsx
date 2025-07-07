import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const stars = [1, 2, 3, 4, 5];

const PedidoConfirmado = () => {
  const { pedidoId } = useParams();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Quando usuário clica para voltar, abre o modal
  const handleVoltarClick = () => {
    setModalOpen(true);
  };

  // Após enviar avaliação, fecha modal e navega para a loja
  const handleCloseModal = () => {
    setModalOpen(false);
    navigate("/");
  };

  const handleSubmit = () => {
    // Enviar avaliação para backend ou localStorage
    console.log("Avaliação:", rating);
    console.log("Comentário:", comment);

    setSubmitted(true);

    // Fecha modal após 2 segundos e volta para a loja
    setTimeout(() => {
      handleCloseModal();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white px-4 pt-10 flex flex-col items-center text-center relative">
      <h2 className="text-2xl font-semibold mb-4 text-green-600">
        ✅ Pedido recebido com sucesso!
      </h2>
      <p className="text-sm mb-2">Número do pedido:</p>
      <p className="font-mono text-lg mb-8">{pedidoId}</p>

      <p className="text-sm text-gray-500 mb-8">
        Você receberá um e-mail com o status da sua compra.
      </p>

      <button
        onClick={handleVoltarClick}
        className="bg-[#591E65] hover:bg-[#3f154b] text-white px-6 py-3 rounded"
      >
        Voltar para a loja
      </button>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            {!submitted ? (
              <>
                <h3 className="text-xl font-semibold mb-4">
                  Como foi a sua experiência no nosso site?
                </h3>

                <div className="flex justify-center mb-4">
                  {stars.map((star) => (
                    <svg
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      xmlns="http://www.w3.org/2000/svg"
                      fill={
                        (hoverRating || rating) >= star ? "#fbbf24" : "none"
                      }
                      viewBox="0 0 24 24"
                      stroke="#fbbf24"
                      strokeWidth={2}
                      className="w-10 h-10 cursor-pointer transition-colors"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.286 7.034a1 1 0 00.95.69h7.392c.969 0 1.371 1.24.588 1.81l-5.98 4.34a1 1 0 00-.364 1.118l2.286 7.033c.3.922-.755 1.688-1.54 1.118l-5.981-4.34a1 1 0 00-1.175 0l-5.981 4.34c-.784.57-1.838-.196-1.539-1.118l2.285-7.033a1 1 0 00-.363-1.118l-5.981-4.34c-.783-.57-.38-1.81.588-1.81h7.392a1 1 0 00.951-.69l2.285-7.034z"
                      />
                    </svg>
                  ))}
                </div>

                <textarea
                  placeholder="Deixe um comentário (opcional)"
                  className="w-full border border-gray-300 rounded p-2 mb-4 resize-none"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                <button
                  onClick={handleSubmit}
                  disabled={rating === 0}
                  className={`w-full py-3 rounded text-white ${
                    rating === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#591E65] hover:bg-[#3f154b]"
                  }`}
                >
                  Enviar avaliação
                </button>
              </>
            ) : (
              <div className="text-[#591E65] font-semibold text-lg">
                Obrigado pela sua avaliação!
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PedidoConfirmado;
