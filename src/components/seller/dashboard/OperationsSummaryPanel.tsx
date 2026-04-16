import { operationsSummary } from '@/lib/dashboard-mock-data';
import { CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';

export function OperationsSummaryPanel() {
  const total = operationsSummary.completed + operationsSummary.pending + operationsSummary.canceled;
  const completedPct = Math.round((operationsSummary.completed / total) * 100);
  const pendingPct   = Math.round((operationsSummary.pending   / total) * 100);
  const canceledPct  = Math.round((operationsSummary.canceled  / total) * 100);

  return (
    <div className="section-box flex flex-col">
      <div className="section-head">
        <div>
          <h2>Resumen Operativo</h2>
          <p>Distribución de órdenes del período</p>
        </div>
        {operationsSummary.stockAlerts > 0 && (
          <span className="section-badge section-badge-warning">
            <AlertTriangle className="h-3 w-3 inline mr-1" strokeWidth={2.5} />
            Stock bajo
          </span>
        )}
      </div>

      {/* Big stat */}
      <div className="mb-4">
        <div className="ds-metric-value">{completedPct}%</div>
        <p className="text-xs mt-1" style={{ color: 'var(--ds-text-muted)' }}>Eficiencia de despacho</p>
      </div>

      {/* Progress bars */}
      <div className="flex flex-col gap-3">
        {[
          { label: 'Completadas', pct: completedPct, icon: CheckCircle, color: 'var(--ds-success)' },
          { label: 'En proceso',  pct: pendingPct,   icon: Clock,        color: 'var(--ds-warning)' },
          { label: 'Canceladas',  pct: canceledPct,  icon: XCircle,      color: 'var(--ds-danger)' },
        ].map(({ label, pct, icon: Icon, color }) => (
          <div key={label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" style={{ color }} strokeWidth={2} />
                <span className="text-xs font-medium" style={{ color: 'var(--ds-text-secondary)' }}>{label}</span>
              </div>
              <span className="text-xs font-bold" style={{ color }}>{pct}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, background: color, opacity: 0.8 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
