'use client';

import React from 'react';

type SmartWelcomeProps = {
  userName?: string | null;
  hasOrders: boolean;
};

export function SmartWelcome({ userName, hasOrders }: SmartWelcomeProps) {
  if (hasOrders) {
    return (
      <div style={{ background: "linear-gradient(90deg, var(--color-primary-soft), var(--color-surface))", border: "1px solid var(--color-primary)", borderRadius: "1rem", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", boxShadow: "0 4px 15px rgba(255,106,43,0.08)" }}>
        <span style={{ fontSize: "2.5rem" }}>👀</span>
        <div>
          <h4 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "var(--color-primary)" }}>¡Bienvenido de nuevo, {userName?.split(' ')[0] || 'amigo'}!</h4>
          <p style={{ margin: "0.25rem 0 0 0", color: "var(--color-text-muted)", fontSize: "0.95rem" }}>Nos alegra volver a verte por aquí. ¿Repetimos tu favorito?</p>
        </div>
      </div>
    );
  }

  // Si no tiene órdenes o no está logueado:
  return (
    <div style={{ background: "var(--color-surface-dim)", borderRadius: "1rem", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", border: "1px dashed var(--color-border)" }}>
      <span style={{ fontSize: "2.5rem" }}>🔥</span>
      <div>
        <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "var(--color-text-main)" }}>Próxima compra con descuento</h4>
        <p style={{ margin: "0.25rem 0 0 0", color: "var(--color-text-muted)", fontSize: "0.95rem" }}>Crea tu cuenta al hacer tu pedido para desbloquear recompensas en el futuro.</p>
      </div>
    </div>
  );
}
