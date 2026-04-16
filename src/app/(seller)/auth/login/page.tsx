import { login } from "@/app/actions/auth";
import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.12),transparent_30%),linear-gradient(to_bottom,#070707,#050505)]" />
      </div>

      {/* CARD */}
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl shadow-2xl">

        {/* TITLE */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold tracking-[-0.04em]">
            Acceso operativo
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Ingresa a tu panel de gestión
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* FORM */}
        <form action={login} className="flex flex-col gap-5">

          {/* EMAIL */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-xs uppercase tracking-[0.14em] text-white/40">
              Correo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="correo@ejemplo.com"
              className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/25 focus:bg-white/[0.06]"
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-xs uppercase tracking-[0.14em] text-white/40">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/25 focus:bg-white/[0.06]"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="mt-3 inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white text-sm font-medium text-black transition hover:bg-white/90"
          >
            Entrar al sistema
          </button>
        </form>

        {/* REGISTER */}
        <p className="mt-7 text-center text-sm text-white/45">
          ¿No tienes acceso?{" "}
          <Link
            href="/auth/register"
            className="text-white/80 underline decoration-white/20 underline-offset-4 transition hover:text-white"
          >
            Crear cuenta
          </Link>
        </p>

        {/* CLIENT ACCESS (SUTIL COMO PEDISTE) */}
        <div className="mt-10 text-center">
          <p className="text-[11px] font-light tracking-[0.08em] text-white/22">
            ¿Buscabas comprar?{" "}
            <Link
              href="/user/profile"
              className="underline decoration-white/10 underline-offset-4 transition hover:text-white/40"
            >
              Acceso clientes
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
} 