import { createProductAction } from '@/app/actions/products';

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { error } = await searchParams;

  return (
    <div style={{ maxWidth: "600px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>Nuevo Producto</h1>
        <p style={{ color: "var(--color-text-muted)" }}>Agrega un artículo nuevo a tu inventario aislado de ventas.</p>
      </div>

      {error && (
        <div style={{ backgroundColor: "var(--color-danger-soft)", color: "var(--color-danger)", padding: "1rem", borderRadius: "0.5rem", marginBottom: "1.5rem" }}>
          {error as string}
        </div>
      )}

      <form action={createProductAction} style={{ background: "var(--color-surface)", padding: "2rem", borderRadius: "1rem", border: "1px solid var(--color-border)", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label htmlFor="name" style={{ fontSize: "0.875rem", fontWeight: 600 }}>Nombre del producto</label>
          <input 
            id="name" 
            name="name" 
            type="text" 
            required 
            placeholder="Ej: Hamburguesa Clásica" 
            style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--color-border)" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label htmlFor="description" style={{ fontSize: "0.875rem", fontWeight: 600 }}>Descripción (opcional)</label>
          <textarea 
            id="description" 
            name="description" 
            placeholder="Ketchup, Medallón vegetal..." 
            style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--color-border)", minHeight: "80px" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label htmlFor="category" style={{ fontSize: "0.875rem", fontWeight: 600 }}>Categoría</label>
          <input 
            id="category" 
            name="category" 
            type="text" 
            placeholder="Ej: Hamburguesas, Bebidas" 
            style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--color-border)" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label htmlFor="price" style={{ fontSize: "0.875rem", fontWeight: 600 }}>Precio</label>
          <input 
            id="price" 
            name="price" 
            type="number" 
            step="0.01"
            min="0"
            required 
            placeholder="0.00" 
            style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--color-border)" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input 
            id="isActive" 
            name="isActive" 
            type="checkbox" 
            defaultChecked
            style={{ width: "16px", height: "16px" }}
          />
          <label htmlFor="isActive" style={{ fontSize: "0.875rem", fontWeight: 600 }}>Disponible para la venta</label>
        </div>

        <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <a href="/dashboard/products" style={{ padding: "0.75rem 1.5rem", color: "var(--color-text-main)", fontWeight: 600, textDecoration: "none" }}>Cancelar</a>
          <button type="submit" style={{ padding: "0.75rem 1.5rem", background: "var(--color-primary)", color: "white", border: "none", borderRadius: "0.5rem", fontWeight: 600, cursor: "pointer" }}>
            Guardar Producto
          </button>
        </div>

      </form>
    </div>
  );
}
