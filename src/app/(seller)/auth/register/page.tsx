import { signup } from '@/app/actions/auth'
import Link from 'next/link'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { error } = await searchParams;

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "var(--color-background)", padding: "2rem 1rem" }}>
      <div className="card" style={{ padding: "3rem", width: "100%", maxWidth: "440px", position: "relative" }}>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div className="page-eyebrow" style={{ marginBottom: "1rem" }}>Registro</div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 900, letterSpacing: "-0.04em", color: "var(--color-text-main)", margin: 0 }}>
            Desplegar Sistema
          </h1>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: "1.5rem" }}>
            {error}
          </div>
        )}

        <form action={signup} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="field">
            <label htmlFor="name" className="label">Nombre completo</label>
            <input id="name" name="name" type="text" className="input" required placeholder="Jane Doe" />
          </div>

          <div className="field">
            <label htmlFor="email" className="label">Correo electrónico</label>
            <input id="email" name="email" type="email" className="input" required placeholder="tu@empresa.com" />
          </div>

          <div className="field">
            <label htmlFor="businessName" className="label">Nombre del Operativo (Local/Marca)</label>
            <input id="businessName" name="businessName" type="text" className="input" required placeholder="Ej: La Gran Pizza" />
          </div>

          <div className="field">
            <label htmlFor="city" className="label">Sede Base (Opcional)</label>
            <input id="city" name="city" type="text" className="input" placeholder="Ej: Zona Norte" />
          </div>

          <div className="field">
            <label htmlFor="password" className="label">Clave de Seguridad</label>
            <input id="password" name="password" type="password" className="input" required placeholder="••••••••" minLength={6} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: "1rem", width: "100%" }}>
            Inicializar Plataforma
          </button>
        </form>

        <p style={{ marginTop: "1.75rem", textAlign: "center", fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
          ¿Ya operas aquí?{" "}
          <Link href="/auth/login" style={{ color: "var(--color-primary)", fontWeight: 700 }}>
            Ingresar
          </Link>
        </p>
      </div>
    </div>
  );
}
