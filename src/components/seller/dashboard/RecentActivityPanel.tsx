import { recentActivity } from '@/lib/dashboard-mock-data';

const typeStyles: Record<string, { dot: string; label: string }> = {
  order:   { dot: 'var(--ds-accent)',   label: 'Orden' },
  alert:   { dot: 'var(--ds-warning)',  label: 'Alerta' },
  default: { dot: 'var(--ds-success)',  label: 'Sistema' },
};

export function RecentActivityPanel() {
  return (
    <div className="section-box flex flex-col">
      <div className="section-head">
        <div>
          <h2>Actividad Reciente</h2>
          <p>Últimos eventos del sistema</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {recentActivity.map((item) => {
          const style = typeStyles[item.type] ?? typeStyles.default;
          return (
            <div key={item.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center shrink-0 mt-1">
                <div
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ background: style.dot, boxShadow: `0 0 5px ${style.dot}80` }}
                />
              </div>
              <div className="flex flex-1 flex-col min-w-0">
                <p className="text-sm leading-snug" style={{ color: 'var(--ds-text-secondary)' }}>
                  {item.action}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--ds-text-muted)' }}>
                  {item.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
