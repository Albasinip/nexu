import { tenantService } from '@/core/tenant/tenant.service';
import { customersService } from '@/core/customers/customers.service';
import { formatCurrency } from '@/utils/formatters';

export default async function CustomersPage() {
  const tenant = await tenantService.requireCurrentTenant();
  const result = await customersService.listCustomers(tenant.business.id);

  if (!result.success) {
    return <div style={{ color: "var(--color-danger)" }}>Error cargando directorio: {result.error}</div>;
  }

  const customers = result.data;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Directorio de Clientes</h1>
          <p style={{ color: "var(--color-text-muted)" }}>Gestiona a los compradores de {tenant.business.name}</p>
        </div>
        
        <a 
          href="/dashboard/customers/new" 
          style={{ background: "var(--color-primary)", color: "white", padding: "0.5rem 1rem", borderRadius: "0.5rem", fontWeight: 600, textDecoration: "none" }}
        >
          + Añadir Cliente
        </a>
      </div>

      <div style={{ background: "var(--color-surface)", borderRadius: "1rem", border: "1px solid var(--color-border)", overflow: "hidden" }}>
        {customers?.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>
            Aún no tienes clientes registrados.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--color-surface-muted)", borderBottom: "1px solid var(--color-border)", textAlign: "left" }}>
                <th style={{ padding: "1rem" }}>Nombre</th>
                <th style={{ padding: "1rem" }}>Contacto</th>
                <th style={{ padding: "1rem" }}>Pedidos Base</th>
                <th style={{ padding: "1rem" }}>Total Invertido</th>
              </tr>
            </thead>
            <tbody>
              {customers?.map(c => (
                <tr key={c.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "1rem", fontWeight: 600 }}>{c.name}</td>
                  <td style={{ padding: "1rem", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                    {c.email} <br/> {c.phone || '-'}
                  </td>
                  <td style={{ padding: "1rem" }}>{c.totalOrders} ped.</td>
                  <td style={{ padding: "1rem", color: "var(--color-success)", fontWeight: 500 }}>{formatCurrency(c.totalSpent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
