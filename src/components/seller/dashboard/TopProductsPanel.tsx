import { topProducts } from '@/lib/dashboard-mock-data';

export function TopProductsPanel() {
  const maxRevenue = Math.max(...topProducts.map(p => Number(p.revenue)));

  return (
    <div className="section-box flex flex-col">
      <div className="section-head">
        <div>
          <h2>Productos Destacados</h2>
          <p>Por volumen de ingresos</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {topProducts.map((product, idx) => {
          const pct = Math.round((Number(product.revenue) / maxRevenue) * 100);
          return (
            <div key={product.id} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold"
                    style={{
                      background: idx === 0 ? 'var(--ds-accent-soft)' : 'rgba(255,255,255,0.05)',
                      color: idx === 0 ? 'var(--ds-accent)' : 'var(--ds-text-muted)',
                      border: `1px solid ${idx === 0 ? 'rgba(59,158,255,0.20)' : 'var(--ds-border-soft)'}`,
                    }}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--ds-text-primary)' }}>
                      {product.name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--ds-text-muted)' }}>
                      {product.sales} vendidos
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold" style={{ color: 'var(--ds-text-primary)', fontFamily: 'monospace' }}>
                  ${product.revenue}
                </span>
              </div>
              {/* Progress bar */}
              <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    background: idx === 0 ? 'var(--ds-accent)' : 'rgba(255,255,255,0.15)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
