// src/contexts/ProdutosContext.jsx
import { createContext, useState } from "react";

export const ProdutosContext = createContext();

export const ProdutosProvider = ({ children }) => {
    const [produtos, setProdutos] = useState([]);
    const [cart, setCart] = useState([]);

    const addToCart = (produtoId) => {
        const produto = produtos.find(p => p.id === produtoId);
        if (produto) {
            setCart((prevCart) => [...prevCart, produto]);
        }
    };

    return (
        <ProdutosContext.Provider value={{ produtos, setProdutos, addToCart }}>
            {children}
        </ProdutosContext.Provider>
    );
};
