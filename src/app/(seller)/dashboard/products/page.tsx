import { tenantService } from '@/core/tenant/tenant.service';
import { productsService } from '@/core/products/products.service';
import { formatCurrency } from '@/utils/formatters';
import { deleteProductAction, toggleProductStatusAction } from '@/app/actions/products';
import { ConfirmSubmitButton } from '@/components/ConfirmSubmitButton';
import Link from 'next/link';

export default async function ProductsPage() {
  const tenant = await tenantService.requireCurrentTenant();
  const result = await productsService.listProducts(tenant.business.id);

  if (!result.success) {
    return <div style={{ color: "var(--color-danger)" }}>Error cargando catálogo: {result.error}</div>;
  }

  const products = result.data;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Módulo de Productos</h1>
          <p style={{ color: "var(--color-text-muted)" }}>Catálogo perteneciente a {tenant.business.name}</p>
        </div>
        
        <Link 
          href="/dashboard/products/new" 
          style={{ background: "var(--color-primary)", color: "white", padding: "0.5rem 1rem", borderRadius: "0.5rem", fontWeight: 600, textDecoration: "none" }}
        >
          + Crear Producto
        </Link>
      </div>

      <div style={{ background: "var(--color-surface)", borderRadius: "1rem", border: "1px solid var(--color-border)", overflow: "hidden" }}>
        {products?.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>
            Aún no tienes productos. ¡Agrega tu primer artículo para empezar a operar!
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--color-surface-muted)", borderBottom: "1px solid var(--color-border)", textAlign: "left" }}>
                <th style={{ padding: "1rem" }}>Nombre</th>
                <th style={{ padding: "1rem" }}>Precio</th>
                <th style={{ padding: "1rem" }}>Estado</th>
                <th style={{ padding: "1rem" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products?.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "1rem", fontWeight: 500 }}>{p.name}</td>
                  <td style={{ padding: "1rem", color: "var(--color-text-muted)" }}>{formatCurrency(p.price)}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ padding: "0.25rem 0.5rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600, background: p.isActive ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", color: p.isActive ? "#10b981" : "#ef4444" }}>
                      {p.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", display: "flex", gap: "0.5rem" }}>
                    
                    {/* Botón Estado Rápido */}
                    <form action={toggleProductStatusAction}>
                      <input type="hidden" name="productId" value={p.id} />
                      <input type="hidden" name="currentStatus" value={p.isActive.toString()} />
                      <button type="submit" style={{ padding: "0.4rem 0.6rem", background: "transparent", border: "1px solid var(--color-border)", borderRadius: "0.25rem", cursor: "pointer", color: "var(--color-text-main)", fontSize: "0.8rem", fontWeight: 600 }}>
                        {p.isActive ? 'Ocultar' : 'Activar'}
                      </button>
                    </form>

                    {/* Botón Editar */}
                    <Link href={`/dashboard/products/${p.id}`} style={{ padding: "0.4rem 0.6rem", background: "var(--color-primary-soft)", color: "var(--color-primary-strong)", borderRadius: "0.25rem", textDecoration: "none", fontSize: "0.8rem", fontWeight: 600 }}>
                      Editar
                    </Link>
                    
                    {/* Botón Borrar (Client-side warning en un tag nativo no siempre detiene Next action, pero lo emulamos limipuo aquí) */}
                    <form action={deleteProductAction}>
                      <input type="hidden" name="productId" value={p.id} />
                      <ConfirmSubmitButton 
                        type="submit" 
                        confirmMessage="¿Seguro quieres borrar este producto permanentemente?"
                        style={{ padding: "0.4rem 0.6rem", background: "var(--color-danger-soft)", color: "var(--color-danger)", border: "none", borderRadius: "0.25rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>
                        Eliminar
                      </ConfirmSubmitButton>
                    </form>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
