// context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("medicineCart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("medicineCart", JSON.stringify(cart));
  }, [cart]);

  // ✅ FIXED Add to cart logic (respects selected quantity)
  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find(
        (m) =>
          m.name === item.name && m.pharmacyName === item.pharmacyName
      );

      if (exists) {
        // ✅ If exists, add selected quantity
        return prev.map((m) =>
          m.name === item.name && m.pharmacyName === item.pharmacyName
            ? {
                ...m,
                quantity: m.quantity + (item.quantity || 1),
                totalPrice:
                  (m.quantity + (item.quantity || 1)) * m.price,
              }
            : m
        );
      }

      // ✅ If new item, use passed quantity correctly
      return [
        ...prev,
        {
          ...item,
          quantity: item.quantity || 1,
          totalPrice: (item.price || 0) * (item.quantity || 1),
        },
      ];
    });
  };

  // Remove medicine
  const removeFromCart = (name) =>
    setCart((prev) => prev.filter((m) => m.name !== name));

  // Clear entire cart
  const clearCart = () => setCart([]);

  // Optional helper: total cost
  const getCartTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};
