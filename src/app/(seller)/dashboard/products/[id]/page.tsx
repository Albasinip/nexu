import { redirect } from 'next/navigation';
import { tenantService } from '@/core/tenant/tenant.service';
import { productsService } from '@/core/products/products.service';
import { updateProductAction } from '@/app/actions/products';

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id: productId } = await params;
  const { error } = await searchParams;

  const tenant = await tenantService.requireCurrentTenant();
  const productResult = await productsService.getProduct(tenant.business.id, productId);

  if (!productResult.success || !productResult.data) {
    return redirect('/dashboard/products?error=' + encodeURIComponent('Producto inexistente o bloqueado.'));
  }

  const product = productResult.data;
  const updateWithId = updateProductAction.bind(null, product.id);

  return (
    <div className="page-shell" style={{ maxWidth: '640px' }}>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <span className="page-kicker">Inventario</span>
          <h1 className="page-title">Editar Producto</h1>
          <p className="page-subtitle">Modifica la información y disponibilidad del ítem en tu tienda.</p>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="ds-alert ds-alert-danger">
          {error as string}
        </div>
      )}

      {/* Form card */}
      <div className="section-box">
        <form action={updateWithId} className="form-grid">

          <div className="form-field">
            <label htmlFor="name" className="ds-label">Nombre del producto</label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={product.name}
              required
              className="ds-input"
              placeholder="Ej: Hamburguesa clásica"
            />
          </div>

          <div className="form-field">
            <label htmlFor="description" className="ds-label">Descripción <span style={{ color: 'var(--ds-text-muted)', fontWeight: 400 }}>(opcional)</span></label>
            <textarea
              id="description"
              name="description"
              defaultValue={product.description || ''}
              className="ds-textarea"
              placeholder="Describe brevemente el producto..."
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="category" className="ds-label">Categoría</label>
              <input
                id="category"
                name="category"
                type="text"
                defaultValue={product.category || ''}
                placeholder="Ej: Hamburguesas, Bebidas"
                className="ds-input"
              />
            </div>

            <div className="form-field">
              <label htmlFor="price" className="ds-label">Precio</label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product.price}
                required
                className="ds-input"
              />
            </div>
          </div>

          <div className="ds-checkbox-row">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              defaultChecked={product.isActive}
              className="ds-checkbox"
            />
            <label htmlFor="isActive" className="ds-label" style={{ cursor: 'pointer' }}>
              Disponible para la venta
            </label>
          </div>

          <hr className="ds-divider" />

          <div className="ds-actions ds-actions-between">
            <a
              href="/dashboard/products"
              className="ds-btn ds-btn-secondary"
            >
              Cancelar
            </a>
            <button type="submit" className="ds-btn ds-btn-primary">
              Guardar Cambios
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
