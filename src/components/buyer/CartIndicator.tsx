'use client';

import React from 'react';
import { useCart } from './CartContext';
import { formatCurrency } from '@/utils/formatters';

export function CartIndicator({ slug }: { slug: string }) {
  const { itemCount, cartTotal, isHydrated, openCart } = useCart();
  
  if (!isHydrated || itemCount === 0) return null;

  return (
    <div style={{ position: "fixed", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)", width: "calc(100% - 2rem)", maxWidth: "500px", zIndex: 900, animation: "slideUp 0.3s ease-out" }}>
      <button 
        onClick={openCart} 
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "1rem 1.5rem", borderRadius: "99px", background: "var(--color-primary)", color: "white", border: "none", fontWeight: 700, fontSize: "1.1rem", cursor: "pointer", boxShadow: "0 6px 20px rgba(255, 106, 43, 0.4)" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ background: "rgba(255,255,255,0.25)", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.95rem" }}>
            {itemCount}
          </span>
          <span>Ver mi pedido</span>
        </div>
        <span>{formatCurrency(cartTotal)}</span>
      </button>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}} />
    </div>
  );
}
