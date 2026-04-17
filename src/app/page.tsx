import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";


function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 backdrop-blur-md">
      {children}
    </div>
  );
}

export default async function Home() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-[#0B0B0F] selection:bg-primary/30">
      {/* Background Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="premium-glow accent-gradient -left-[10%] -top-[10%] h-[40%] w-[40%] opacity-[0.07]" />
        <div className="premium-glow accent-gradient -bottom-[10%] -right-[10%] h-[40%] w-[40%] opacity-[0.05]" />
      </div>

      <header className="fixed top-0 z-[100] w-full border-b border-white/5 bg-[#0B0B0F]/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center transition hover:opacity-80">
            <Image
              src="/logo.png"
              alt="NEXU"
              width={120}
              height={38}
              priority
              className="h-9 w-auto brightness-110"
            />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            <Link href="#features" className="text-xs font-semibold uppercase tracking-widest text-white/40 transition hover:text-white">Funciones</Link>
            <Link href="#how-it-works" className="text-xs font-semibold uppercase tracking-widest text-white/40 transition hover:text-white">Cómo funciona</Link>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <Link
                href="/dashboard"
                className="group relative flex h-11 items-center justify-center overflow-hidden rounded-full px-6 text-sm font-bold transition-all"
              >
                <div className="absolute inset-0 accent-gradient opacity-90 transition group-hover:opacity-100" />
                <span className="relative z-10 text-white">Ir al panel</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 text-sm font-bold text-white/60 transition hover:text-white"
                >
                  Ingresar
                </Link>
                <Link
                  href="/auth/register"
                  className="group relative flex h-11 items-center justify-center overflow-hidden rounded-full px-6 text-sm font-bold transition-all"
                >
                  <div className="absolute inset-0 bg-white transition group-hover:bg-white/90" />
                  <span className="relative z-10 text-black">Empezar gratis</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-32">
        {/* HERO SECTION */}
        <section className="mx-auto max-w-[1240px] px-6 pb-32">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
              <div className="animate-fade-in">
                <SectionBadge>Plataforma Gastronómica Next-Gen</SectionBadge>
                <h1 className="text-gradient mb-8 text-6xl font-black leading-[0.95] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
                  Menos desorden.<br />Más control.
                </h1>
                <p className="mb-10 max-w-xl text-lg leading-relaxed text-white/50 sm:text-xl">
                  Centraliza catálogo, pedidos y clientes en un entorno premium diseñado para el sector gastronómico. Sin fricción, sin complicaciones.
                </p>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Link
                    href={user ? "/dashboard" : "/auth/register"}
                    className="group relative flex h-14 min-w-[200px] items-center justify-center overflow-hidden rounded-full px-8 text-base font-bold transition-all hover:scale-105 active:scale-95"
                  >
                    <div className="absolute inset-0 accent-gradient" />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white/10 blur-xl opacity-0 transition group-hover:opacity-100" />
                    <span className="relative z-10 text-white">{user ? "Entrar al panel" : "Crear mi espacio"}</span>
                  </Link>
                  <Link
                    href="/demo-bites"
                    className="group flex h-14 min-w-[200px] items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 text-base font-bold text-white transition hover:bg-white/10 hover:border-white/20 active:scale-95"
                  >
                    Ver demo de tienda
                  </Link>
                </div>
              </div>

              <div className="relative mt-20 lg:mt-0">
                <div className="premium-glow accent-gradient left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 opacity-[0.15] blur-[120px]" />
                <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0B0B0F] p-2 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]">
                  <Image
                    src="/dashboard-premium.png"
                    alt="NEXU Dashboard"
                    width={800}
                    height={500}
                    className="rounded-[2rem] transition duration-700 hover:scale-[1.02]"
                    priority
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-white/10" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* resto igual... */}
      </main>
    </div>
  );
}