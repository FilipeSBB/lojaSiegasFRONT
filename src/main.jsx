import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ProdutosProvider } from "./context/ProdutosContext"; // <-- ProdutosProvider!!

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ProdutosProvider>
      <App />
    </ProdutosProvider>
  </BrowserRouter>
)
