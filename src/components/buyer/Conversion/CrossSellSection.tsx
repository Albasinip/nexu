'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '../CartContext';
import { formatCurrency } from '@/utils/formatters';
import { getCrossSellSuggestions } from '@/app/actions/checkout';

export function CrossSellSection({ businessId }: { businessId?: string }) {
  const { items, addItem } = useCart();
  const [crossSellProducts, setCrossSellProducts] = useState<any[]>([]);

  // Usaremos el ID del primer producto del carrito para asegurar pertenencia
  const inferredBusinessId = items[0]?.businessId || businessId || 'demo';

  // Extraer string estable de categorías para inyectar al Server Action sin causar render loops
  const cartCategoriesStr = Array.from(new Set(items.map(i => i.category || ''))).filter(Boolean).join(',');

  useEffect(() => {
    if (inferredBusinessId !== 'demo' && crossSellProducts.length === 0) {
      getCrossSellSuggestions(inferredBusinessId, cartCategoriesStr.split(',')).then(res => {
        if (res.success && res.data) {
          setCrossSellProducts(res.data);
        }
      });
    }
  }, [inferredBusinessId, cartCategoriesStr, crossSellProducts.length]);

  if (items.length === 0 || crossSellProducts.length === 0) return null;

  // Filtramos para no sugerir algo que ya está en el carrito
  const availableToSuggest = crossSellProducts.filter(
    csp => !items.some(item => item.id === csp.id)
  );

  if (availableToSuggest.length === 0) return null;

  return (
    <div style={{ background: "var(--color-background)", padding: "1.25rem", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)", marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
         <span style={{ fontSize: "1.2rem", background: "var(--color-primary-soft)", color: "var(--color-primary)", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>💡</span>
         <h3 style={{ fontSize: "1rem", fontWeight: 800, margin: 0, color: "var(--color-text-main)" }}>Completa tu pedido</h3>
      </div>
      
      <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
        {availableToSuggest.map((mockProduct) => (
          <div key={mockProduct.id} style={{ minWidth: "140px", width: "140px", background: "var(--color-surface)", borderRadius: "1rem", border: "1px solid var(--color-border)", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
            <div style={{ height: "80px", width: "100%", background: "var(--color-surface-dim)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
               {mockProduct.imageUrl ? (
                  <img src={mockProduct.imageUrl} alt={mockProduct.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
               ) : (
                  <span style={{ fontSize: "2rem" }}>🥫</span>
               )}
            </div>
            <div style={{ padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, lineHeight: 1.2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{mockProduct.name}</span>
              <span style={{ fontSize: "0.85rem", color: "var(--color-primary)", fontWeight: 700 }}>{formatCurrency(mockProduct.price)}</span>
            </div>
            <button 
              onClick={(e) => { e.preventDefault(); addItem(mockProduct as any); }}
              className="hover-lift"
              style={{ margin: "0.5rem", padding: "0.4rem", border: "none", background: "var(--color-primary-soft)", color: "var(--color-primary)", fontWeight: 800, borderRadius: "0.5rem", cursor: "pointer", fontSize: "0.85rem", transition: "all 0.2s" }}
            >
              + Agregar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
