import { dashboardMetrics } from '@/lib/dashboard-mock-data';
import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingCart, Clock, TrendingUp } from 'lucide-react';

const metrics = [
  {
    label: 'Ventas del período',
    icon: DollarSign,
    getValue: (m: typeof dashboardMetrics) =>
      `$${m.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    getTrend: (m: typeof dashboardMetrics) => ({ val: m.salesTrend, up: m.salesTrend.startsWith('+') }),
  },
  {
    label: 'Órdenes cursadas',
    icon: ShoppingCart,
    getValue: (m: typeof dashboardMetrics) => m.ordersToday.toString(),
    getTrend: (m: typeof dashboardMetrics) => ({ val: m.ordersTrend, up: m.ordersTrend.startsWith('+') }),
  },
  {
    label: 'Tiempo promedio',
    icon: Clock,
    getValue: (m: typeof dashboardMetrics) => m.prepTimeAvg,
    getTrend: () => ({ val: '−2 min', up: true }),
  },
  {
    label: 'Ticket promedio',
    icon: TrendingUp,
    getValue: (m: typeof dashboardMetrics) =>
      `$${m.averageTicket.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    getTrend: () => null,
  },
];

export function MetricsStrip() {
  return (
    <div className="ds-metrics-strip">
      {metrics.map((m) => {
        const value = m.getValue(dashboardMetrics);
        const trend = m.getTrend(dashboardMetrics);
        const Icon = m.icon;
        return (
          <div key={m.label} className="ds-metric-tile">
            <div className="flex items-center justify-between">
              <span className="ds-metric-label">{m.label}</span>
              <Icon className="h-4 w-4" style={{ color: 'var(--ds-text-muted)' }} strokeWidth={1.8} />
            </div>
            <div className="ds-metric-value">{value}</div>
            {trend && (
              <div className={`ds-metric-trend ${trend.up ? 'ds-trend-up' : 'ds-trend-down'}`}>
                {trend.up
                  ? <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                  : <ArrowDownRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                }
                {trend.val}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
