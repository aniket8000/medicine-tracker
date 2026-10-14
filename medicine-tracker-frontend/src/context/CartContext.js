// context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Load from localStorage in the initializer (not an effect) — otherwise the
  // save effect below writes an empty cart before the saved one is restored,
  // and React StrictMode's double effect run reads that empty cart back.
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("medicineCart")) || [];
    } catch {
      return [];
    }
  });

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
        // ✅ If exists, add selected quantity (capped at available stock)
        const stock = item.stock ?? exists.stock;
        return prev.map((m) => {
          if (m.name !== item.name || m.pharmacyName !== item.pharmacyName) return m;

          let quantity = m.quantity + (item.quantity || 1);
          if (stock !== undefined) quantity = Math.min(quantity, stock);

          return { ...m, stock, quantity, totalPrice: quantity * m.price };
        });
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

  // Remove medicine — matched by pharmacy too, so the same medicine from a
  // different pharmacy stays in the cart
  const removeFromCart = (name, pharmacyName) =>
    setCart((prev) =>
      prev.filter((m) => !(m.name === name && m.pharmacyName === pharmacyName))
    );

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
