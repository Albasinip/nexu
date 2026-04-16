import { MetricsStrip } from '@/components/seller/dashboard/MetricsStrip';
import { SalesOverviewCard } from '@/components/seller/dashboard/SalesOverviewCard';
import { ActiveOrdersPanel } from '@/components/seller/dashboard/ActiveOrdersPanel';
import { TopProductsPanel } from '@/components/seller/dashboard/TopProductsPanel';
import { OperationsSummaryPanel } from '@/components/seller/dashboard/OperationsSummaryPanel';
import { RecentActivityPanel } from '@/components/seller/dashboard/RecentActivityPanel';

export default function DashboardPage() {
  return (
    <div className="page-shell">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <span className="page-kicker">Panel de Control</span>
          <h1 className="page-title">Análisis Operacional</h1>
          <p className="page-subtitle">Métricas en tiempo real y estado de operaciones del negocio.</p>
        </div>
        <div className="page-header-badge">
          <span className="page-header-badge-dot" />
          Sistema activo
        </div>
      </div>

      {/* KPI strip */}
      <MetricsStrip />

      {/* Main grid: chart + orders */}
      <div className="ds-grid-main">
        <SalesOverviewCard />
        <ActiveOrdersPanel />
      </div>

      {/* Secondary grid */}
      <div className="ds-grid-secondary">
        <TopProductsPanel />
        <OperationsSummaryPanel />
        <RecentActivityPanel />
      </div>
    </div>
  );
}
