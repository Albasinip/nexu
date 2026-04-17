'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '../CartContext';
import { formatCurrency } from '@/utils/formatters';
import { Product } from '@/types';
import { getCrossSellSuggestions } from '@/app/actions/checkout';

interface CrossSellSectionProps {
  businessId: string;
}

export function CrossSellSection({ businessId }: CrossSellSectionProps) {
  const { items, addItem } = useCart();
  const [availableToSuggest, setAvailableToSuggest] = useState<Product[]>([]);

  React.useEffect(() => {
    async function load() {
      const currentCats = Array.from(new Set(items.map(i => i.category || ''))).filter(Boolean);
      const res = await getCrossSellSuggestions(businessId, currentCats);
      if (res.success && res.data) {
        // Filtramos para no sugerir algo que ya está en el carrito
        const filtered = res.data.filter(
          csp => !items.some(item => item.id === csp.id)
        );
        setAvailableToSuggest(filtered);
      }
    }
    if (businessId) {
      load();
    }
  }, [businessId, items]);

  if (availableToSuggest.length === 0) return null;

  return (
    <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
         <span style={{ fontSize: "1.2rem", background: "var(--color-primary-soft)", color: "var(--color-primary)", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>💡</span>
         <h3 style={{ fontSize: "1rem", fontWeight: 800, margin: 0, color: "var(--color-text-main)" }}>Completa tu pedido</h3>
      </div>
      
      <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
        {availableToSuggest.map((mockProduct) => (
          <div key={mockProduct.id} style={{ minWidth: "140px", width: "140px", background: "var(--color-surface)", borderRadius: "1rem", border: "1px solid var(--color-border)", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
            <div style={{ height: "80px", width: "100%", background: "var(--color-surface-dim)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
               {mockProduct.imageUrl ? (
                  <Image src={mockProduct.imageUrl} alt={mockProduct.name} fill style={{ objectFit: "cover" }} />
               ) : (
                  <span style={{ fontSize: "2rem" }}>🥫</span>
               )}
            </div>
            <div style={{ padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, lineHeight: 1.2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{mockProduct.name}</span>
              <span style={{ fontSize: "0.85rem", color: "var(--color-primary)", fontWeight: 700 }}>{formatCurrency(mockProduct.price)}</span>
            </div>
            <button 
              onClick={(e) => { e.preventDefault(); addItem(mockProduct); }}
              style={{ padding: "0.5rem", background: "var(--color-primary-soft)", color: "var(--color-primary-strong)", border: "none", borderTop: "1px solid var(--color-border)", cursor: "pointer", fontWeight: 700, fontSize: "0.8rem", width: "100%" }}
            >
              + Agregar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
