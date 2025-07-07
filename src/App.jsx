import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Produtos from './pages/Produtos';
import Sobre from './pages/Sobre';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DetalhesProduto from './pages/DetalhesProduto';
import Checkout from './pages/Checkout';
import Pagamento from './pages/Pagamento';
import PedidoConfirmado from './pages/PedidoConfirmado';
import PagamentoPix from './pages/PagamentoPix'; //
import HistoricoPedido from './pages/HistoricoPedido';

const App = () => {
  const location = useLocation();
  const isLoginRoute = location.pathname === '/login';

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer autoClose={1000} />

      {/* Navbar apenas se NÃO for a tela de login */}
      {!isLoginRoute && <Navbar />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/produtos' element={<Produtos />} />
        <Route path='/sobre' element={<Sobre />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Login />} />       
        <Route path='/produto/:id' element={<DetalhesProduto />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pagamento" element={<Pagamento />} />
        <Route path="/pedido-confirmado/:pedidoId" element={<PedidoConfirmado />} />
        <Route path="/pagamento-pix" element={<PagamentoPix />} />
        <Route path="/historico" element={<HistoricoPedido />} />
      </Routes>

     
      {!isLoginRoute && <Footer />}
    </div>
  );
};

export default App;
