import { createCustomerAction } from '@/app/actions/customers';

export default async function NewCustomerPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { error } = await searchParams;

  return (
    <div style={{ maxWidth: "600px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>Añadir Cliente</h1>
        <p style={{ color: "var(--color-text-muted)" }}>Registra un cliente VIP o de contacto directo.</p>
      </div>

      {error && (
        <div style={{ backgroundColor: "var(--color-danger-soft)", color: "var(--color-danger)", padding: "1rem", borderRadius: "0.5rem", marginBottom: "1.5rem" }}>
          {error as string}
        </div>
      )}

      <form action={createCustomerAction} style={{ background: "var(--color-surface)", padding: "2rem", borderRadius: "1rem", border: "1px solid var(--color-border)", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label htmlFor="name" style={{ fontSize: "0.875rem", fontWeight: 600 }}>Nombre completo</label>
          <input 
            id="name" 
            name="name" 
            type="text" 
            required 
            placeholder="Ej: Ana Silva" 
            style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--color-border)" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label htmlFor="email" style={{ fontSize: "0.875rem", fontWeight: 600 }}>Correo electrónico</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            required 
            placeholder="cliente@ejemplo.com" 
            style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--color-border)" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label htmlFor="phone" style={{ fontSize: "0.875rem", fontWeight: 600 }}>Teléfono (opcional)</label>
          <input 
            id="phone" 
            name="phone" 
            type="text" 
            placeholder="+54 9 11 ..." 
            style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--color-border)" }}
          />
        </div>

        <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <a href="/dashboard/customers" style={{ padding: "0.75rem 1.5rem", color: "var(--color-text-main)", fontWeight: 600, textDecoration: "none" }}>Cancelar</a>
          <button type="submit" style={{ padding: "0.75rem 1.5rem", background: "var(--color-primary)", color: "white", border: "none", borderRadius: "0.5rem", fontWeight: 600, cursor: "pointer" }}>
            Guardar
          </button>
        </div>

      </form>
    </div>
  );
}
