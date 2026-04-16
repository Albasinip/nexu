'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types';

export type CartItem = Product & { quantity: number };

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  isHydrated: boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('nexu_cart');
    let initialItems = [];
    if (saved) {
      try { initialItems = JSON.parse(saved); } catch (e) {}
    }
    setItems(initialItems);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('nexu_cart', JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addItem = (product: Product) => {
    setItems(current => {
      // Bloquear carritos mixtos (Anti Multi-Tenant mixing)
      if (current.length > 0 && current[0].businessId !== product.businessId) {
        alert("Tienes un pedido pendiente en otro local. Por favor, finaliza o vacía tu carrito actual antes de pedir en este restaurante.");
        return current;
      }

      const existing = current.find(i => i.id === product.id);
      if (existing) {
        return current.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true); // Opcional: abre el carrito automáticamente al agregar
  };

  const removeItem = (productId: string) => {
    setItems(current => current.filter(i => i.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setItems(current => 
      current.map(i => {
        if (i.id === productId) {
          const newQ = Math.max(1, i.quantity + delta);
          return { ...i, quantity: newQ };
        }
        return i;
      })
    );
  };

  const clearCart = () => setItems([]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, cartTotal, itemCount, isHydrated, isCartOpen, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCart must be inside a CartProvider');
  return context;
};
