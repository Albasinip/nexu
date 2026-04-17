'use client';

import React, { useState } from 'react';
import { updateOrderStatusAction } from '@/app/actions/orders';
import { formatCurrency } from '@/utils/formatters';
import { OrderStatus, OrderWithDetails } from '@/types';

export function OrderManager({ initialOrders }: { initialOrders: OrderWithDetails[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleUpdate = async (orderId: string, status: OrderStatus) => {
    setLoadingId(orderId);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    
    const res = await updateOrderStatusAction(orderId, status);
    
    if (!res.success) {
      alert("Error actualizando pedido: " + res.error);
    }
    setLoadingId(null);
  };

  const pending = orders.filter(o => o.status === 'PENDING' || o.status === 'PROCESSING');
  const finished = orders.filter(o => o.status === 'COMPLETED' || o.status === 'CANCELLED');

  const getStatusBadge = (status: OrderStatus) => {
    switch(status) {
      case 'PENDING': return <span className="badge badge-warning">🟡 Recibido</span>;
      case 'PROCESSING': return <span className="badge badge-info">🔵 En Cocina</span>;
      case 'COMPLETED': return <span className="badge badge-success">🟢 Entregado</span>;
      case 'CANCELLED': return <span className="badge badge-danger">🔴 Rechazado</span>;
    }
  };

  const OrderCard = ({ order }: { order: OrderWithDetails }) => (
    <div className="card" style={{ marginBottom: "1rem", opacity: loadingId === order.id ? 0.6 : 1 }}>
       <div className="card-body">
         <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--color-border)", paddingBottom: "1rem", marginBottom: "1rem" }}>
           <div>
              <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.2rem", fontWeight: 800 }}>#{order.id.split('-')[0].toUpperCase()}</h3>
              <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "0.9rem" }}>{new Date(order.createdAt).toLocaleString()}</p>
           </div>
           <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem" }}>
              <span style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--color-primary)" }}>{formatCurrency(order.totalAmount)}</span>
              {getStatusBadge(order.status)}
           </div>
         </div>

         {/* Detalles cliente */}
         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", background: "var(--color-surface-dim)", border: "1px solid var(--color-border-strong)", padding: "1rem", borderRadius: "var(--radius-md)", marginBottom: "1.25rem" }}>
            <div>
              <p style={{ margin: "0 0 0.35rem 0", fontSize: "0.75rem", fontWeight: 800, color: "var(--color-text-faint)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Cliente</p>
              <p style={{ margin: 0, fontWeight: 700, color: "var(--color-text-main)" }}>{order.customerName || order.buyer?.name || 'Cliente Visitante'}</p>
              {order.customerPhone && <p style={{ margin: "0.35rem 0 0 0", fontSize: "0.85rem", color: "var(--color-text-muted)" }}>📞 {order.customerPhone}</p>}
            </div>
            <div>
              <p style={{ margin: "0 0 0.35rem 0", fontSize: "0.75rem", fontWeight: 800, color: "var(--color-text-faint)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Ubicación / Notas</p>
              <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9rem", color: "var(--color-text-main)" }}>{order.address || 'Retiro en Local'}</p>
              {order.notes && <p style={{ margin: "0.35rem 0 0 0", fontSize: "0.85rem", fontStyle: "italic", color: "var(--color-text-muted)" }}>&ldquo;{order.notes}&rdquo;</p>}
            </div>
         </div>

         {/* Platos */}
         <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.75rem", fontWeight: 800, color: "var(--color-text-faint)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Pedido</p>
            <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "var(--color-text-soft)", fontSize: "0.95rem" }}>
              {order.items.map((it) => (
                 <li key={it.id} style={{ marginBottom: "0.25rem" }}>
                   <span style={{ fontWeight: 800, color: "var(--color-text-main)" }}>{it.quantity}x</span> {it.product.name}
                 </li>
              ))}
            </ul>
         </div>

         {/* Botonera Dinámica */}
         <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", paddingTop: "0.5rem", borderTop: "1px solid var(--color-border)" }}>
            {order.status === 'PENDING' && (
               <>
                 <button onClick={() => handleUpdate(order.id, 'PROCESSING')} className="btn btn-primary" style={{ flex: 1, minHeight: "44px" }}>👨‍🍳 Empezar a Preparar</button>
                 <button onClick={() => handleUpdate(order.id, 'CANCELLED')} className="btn btn-secondary" style={{ padding: "0 1.25rem" }}>Rechazar</button>
               </>
            )}
            {order.status === 'PROCESSING' && (
               <button onClick={() => handleUpdate(order.id, 'COMPLETED')} className="btn" style={{ flex: 1, background: "var(--color-success)", color: "white", padding: "0 1rem", border: "1px solid var(--color-success)" }}>✅ Marcar como Listo / Entregado</button>
            )}
            {(order.status === 'COMPLETED' || order.status === 'CANCELLED') && (
               <p className="text-muted" style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", fontStyle: "italic" }}>Orden archivada. No requiere más acciones.</p>
            )}
         </div>
       </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 900, margin: 0, color: "var(--color-text-main)", letterSpacing: "-0.03em" }}>Control de Pedidos</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2.5rem", alignItems: "start" }}>
         {/* Sala de Mando */}
         <div>
            <div style={{ background: "var(--color-warning-soft)", border: "1px solid rgba(245, 158, 11, 0.2)", padding: "1.25rem", borderRadius: "var(--radius-lg)", marginBottom: "1.5rem" }}>
               <h3 style={{ margin: 0, fontWeight: 800, color: "var(--color-warning)", display: "flex", justifyContent: "space-between", fontSize: "1.1rem" }}>
                 <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>🔥 Sala de Mando</span>
                 <span style={{ background: "rgba(245, 158, 11, 0.2)", padding: "0.2rem 0.6rem", borderRadius: "var(--radius-full)", fontSize: "0.8rem" }}>{pending.length}</span>
               </h3>
            </div>
            {pending.length === 0 ? (
               <div className="empty-state">
                 <p className="empty-state-text">No hay pedidos activos.</p>
               </div>
            ) : (
               pending.map(o => <OrderCard key={o.id} order={o} />)
            )}
         </div>

         {/* Historial Archivo */}
         <div style={{ opacity: 0.85 }}>
            <div style={{ background: "var(--color-surface-dim)", border: "1px solid var(--color-border)", padding: "1.25rem", borderRadius: "var(--radius-lg)", marginBottom: "1.5rem" }}>
               <h3 style={{ margin: 0, fontWeight: 800, color: "var(--color-text-soft)", display: "flex", justifyContent: "space-between", fontSize: "1.1rem" }}>
                 <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>📦 Historial Archivo</span>
                 <span style={{ background: "var(--color-border)", padding: "0.2rem 0.6rem", borderRadius: "var(--radius-full)", fontSize: "0.8rem", color: "var(--color-text-main)" }}>{finished.length}</span>
               </h3>
            </div>
            {finished.map(o => <OrderCard key={o.id} order={o} />)}
            {finished.length === 0 && (
              <div className="empty-state">
                <p className="empty-state-text">No hay pedidos archivados todavía.</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
