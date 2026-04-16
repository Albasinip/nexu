import { redirect } from 'next/navigation';
import { tenantService } from '@/core/tenant/tenant.service';
import { ordersService } from '@/core/orders/orders.service';
import { OrderManager } from '@/components/seller/OrderManager';

export const dynamic = 'force-dynamic';

export default async function OrdersDashboardPage() {
  const tenant = await tenantService.getCurrentTenant();
  
  if (!tenant) {
    redirect('/auth/login?error=Sesión expirada o pérdida de negocio');
  }

  const res = await ordersService.getBusinessOrders(tenant.business.id);

  if (!res.success) {
    return (
      <div className="page-shell">
        <div className="section-box ds-alert ds-alert-danger">
          <strong>Error cargando pedidos:</strong> {res.error}
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div className="page-header-left">
          <span className="page-kicker">Gestión</span>
          <h1 className="page-title">Órdenes</h1>
          <p className="page-subtitle">Administra y actualiza el estado de los pedidos en tiempo real.</p>
        </div>
      </div>
      <OrderManager initialOrders={res.data || []} />
    </div>
  );
}

