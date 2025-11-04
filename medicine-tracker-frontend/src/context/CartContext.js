// context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load saved cart from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("medicineCart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem("medicineCart", JSON.stringify(cart));
  }, [cart]);

  // Add medicine to cart
  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find(
        (m) =>
          m.name === item.name &&
          m.pharmacyName === item.pharmacyName
      );
      if (exists) {
        return prev.map((m) =>
          m.name === item.name && m.pharmacyName === item.pharmacyName
            ? { ...m, quantity: m.quantity + 1 }
            : m
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Remove medicine
  const removeFromCart = (name) =>
    setCart((prev) => prev.filter((m) => m.name !== name));

  // Clear cart
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
