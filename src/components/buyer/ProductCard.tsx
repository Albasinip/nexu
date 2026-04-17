'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from './CartContext';
import { formatCurrency } from '@/utils/formatters';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  // Deterministic conversion labels based on product ID
  const isBestSeller  = product.id.charCodeAt(0) % 3 === 0;
  const isRecommended = product.id.charCodeAt(product.id.length - 1) % 3 === 1 && !isBestSeller;

  return (
    <div className="card sf-pcard">
      {/* Info */}
      <div className="sf-pcard-info">
        <div className="sf-pcard-labels">
          <h4 className="sf-pcard-name">{product.name}</h4>
          {isBestSeller && (
            <span className="sf-pcard-badge sf-pcard-badge-star">⭐ Más vendido</span>
          )}
          {isRecommended && (
            <span className="sf-pcard-badge sf-pcard-badge-fire">🔥 Recomendado</span>
          )}
        </div>

        {product.description && (
          <p className="sf-pcard-desc">{product.description}</p>
        )}

        <span className="sf-pcard-price">{formatCurrency(product.price)}</span>
      </div>

      {/* Image + Add button */}
      <div className="sf-pcard-img-wrap">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
          />
        ) : (
          <span className="sf-pcard-placeholder">🍽️</span>
        )}
        <button
          onClick={e => { e.preventDefault(); addItem(product); }}
          className="sf-pcard-add"
          aria-label="Añadir al pedido"
        >
          +
        </button>
      </div>

      <style>{`
        .sf-pcard {
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          padding: 1.1rem 1.25rem;
          gap: 1rem;
          margin-bottom: 0;
          position: relative;
        }
        .sf-pcard-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 0.45rem;
          min-width: 0;
        }
        .sf-pcard-labels {
          display: flex;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .sf-pcard-name {
          margin: 0;
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--ds-text-primary, #e8edf5);
          line-height: 1.3;
        }
        .sf-pcard-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.18rem 0.55rem;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 700;
          white-space: nowrap;
          border: 1px solid transparent;
        }
        .sf-pcard-badge-star {
          background: rgba(251,191,36,0.12);
          border-color: rgba(251,191,36,0.25);
          color: #fbbf24;
        }
        .sf-pcard-badge-fire {
          background: rgba(59,158,255,0.10);
          border-color: rgba(59,158,255,0.22);
          color: #3b9eff;
        }
        .sf-pcard-desc {
          margin: 0;
          font-size: 0.86rem;
          color: rgba(200,210,230,0.58);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .sf-pcard-price {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--ds-accent, #3b9eff);
          letter-spacing: -0.01em;
          font-family: monospace;
        }
        .sf-pcard-img-wrap {
          position: relative;
          width: 100px;
          height: 100px;
          flex-shrink: 0;
          border-radius: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
        }
        .sf-pcard-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 11px;
        }
        .sf-pcard-placeholder {
          font-size: 1.85rem;
          opacity: 0.4;
        }
        .sf-pcard-add {
          position: absolute;
          bottom: -10px;
          right: -10px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--ds-accent, #3b9eff);
          color: #fff;
          border: 2px solid var(--ds-bg-surface, #111621);
          font-size: 1.4rem;
          font-weight: 900;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(59,158,255,0.30);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .sf-pcard-add:hover {
          transform: scale(1.12);
          box-shadow: 0 6px 18px rgba(59,158,255,0.40);
        }
        .sf-pcard-add:active { transform: scale(0.95); }
      `}</style>
    </div>
  );
}