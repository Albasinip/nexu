'use client';

import React, { useState, useEffect } from 'react';

export function PromoPopup({ }: { slug: string }) {
  const [show, setShow] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Usamos una key global para evitar que aparezca en todos los locales si ya se lo dimos
    const key = `nexu_welcome_coupon_claimed`;
    const hasSeen = localStorage.getItem(key);
    
    if (!hasSeen) {
      // Retrasar 2 segundos para no agobiar inmediatamente a que carga
      const timer = setTimeout(() => {
        // Generar código dinámico único (ej: DTO-A3X9B)
        const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
        setCouponCode(`NEXU10-${randomCode}`);
        setShow(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClaim = () => {
    // Marcar como visto/reclamado globalmente para que no aparezca al cambiar de pestaña o re-loggear
    localStorage.setItem(`nexu_welcome_coupon_claimed`, new Date().toISOString());
    localStorage.setItem(`nexu_active_coupon`, couponCode); // Guardamos el código por si lo quiere usar en el carro
    setShow(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!show) return null;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", animation: "fadeIn 0.3s ease-out" }}>
      <div className="card" style={{ padding: "2.5rem", maxWidth: "90%", width: "420px", textAlign: "center", position: "relative", boxShadow: "0 20px 60px rgba(0,0,0,0.8)", animation: "scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}>
        <button onClick={handleClaim} style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "var(--color-surface)", border: "1px solid var(--color-border)", width: "36px", height: "36px", borderRadius: "50%", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-main)", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = 'var(--color-surface-hover)'} onMouseOut={e => e.currentTarget.style.background = 'var(--color-surface)'}>✕</button>
        
        <div style={{ fontSize: "3.5rem", marginBottom: "1rem", lineHeight: 1 }}>🎁</div>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 900, margin: "0 0 0.5rem 0", color: "var(--color-text-main)", letterSpacing: "-0.03em" }}>¡10% OFF DTO!</h2>
        <p className="text-muted" style={{ fontSize: "1rem", marginBottom: "1.5rem", lineHeight: 1.5 }}>
          No pagues comisiones a apps externas. Pide directo aquí y obtén tu descuento en tu primera compra pagando en tienda.
        </p>

        {/* Zona del Cupón */}
        <div style={{ background: "var(--color-background)", border: "1px dashed var(--color-border-strong)", borderRadius: "var(--radius-lg)", padding: "1.25rem", marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 800, color: "var(--color-text-faint)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Tu código único</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--color-primary)", letterSpacing: "2px" }}>{couponCode}</span>
          </div>
          <button onClick={copyToClipboard} className="btn btn-secondary" style={{ width: "100%", padding: "0.5rem", fontSize: "0.9rem", minHeight: "36px", marginTop: "0.25rem" }}>
            {copied ? "¡Copiado! ✓" : "Copiar código"}
          </button>
        </div>

        <button onClick={handleClaim} className="btn btn-primary" style={{ width: "100%", padding: "1rem", fontWeight: 800, fontSize: "1.1rem" }}>
          ¡Entendido, ver menú!
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}} />
    </div>
  );
}
