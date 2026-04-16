import { activeOrders } from '@/lib/dashboard-mock-data';

function statusClass(status: string) {
  if (status === 'Nuevo') return 'ds-status ds-status-new';
  if (status === 'En preparación') return 'ds-status ds-status-progress';
  return 'ds-status ds-status-done';
}

export function ActiveOrdersPanel() {
  return (
    <div className="section-box flex flex-col">
      <div className="section-head">
        <div>
          <h2>Órdenes Activas</h2>
          <p>En tiempo real</p>
        </div>
        <span className="section-badge section-badge-accent">
          {activeOrders.length} en curso
        </span>
      </div>

      <div className="flex flex-col gap-1 flex-1 overflow-y-auto" style={{ maxHeight: '280px' }}>
        {activeOrders.map((order, i) => (
          <div key={i} className="ds-data-row">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold" style={{ color: 'var(--ds-text-primary)' }}>
                {order.customer}
              </span>
              <span className="text-xs" style={{ color: 'var(--ds-text-muted)', fontFamily: 'monospace' }}>
                {order.id} · T+{order.timeElapsed}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="text-sm font-bold" style={{ color: 'var(--ds-text-primary)' }}>
                ${order.total.toFixed(2)}
              </span>
              <span className={statusClass(order.status)}>{order.status}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 mt-2" style={{ borderTop: '1px solid var(--ds-border-soft)' }}>
        <button
          className="ds-btn ds-btn-secondary w-full"
          style={{ fontSize: '0.82rem' }}
        >
          Ver todas las órdenes
        </button>
      </div>
    </div>
  );
}
