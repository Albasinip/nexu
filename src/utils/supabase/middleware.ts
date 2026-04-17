import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresca la sesión activa y devuelve el usuario asíncronamente
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  
  // Categorías de Rutas - Lógica de Negocio Original
  const isDashboard = path.startsWith('/dashboard');
  const isSellerAuth = path === '/auth/login' || path === '/auth/register';
  
  const isBuyerAuth = path === '/user/login' || path === '/user/register';

  if (user) {
    const role = user.user_metadata?.role || 'BUYER'; // Backward comp

    // Protección Cruzada: Buyer intentando entrar a zona Seller
    if (role === 'BUYER' && isDashboard) {
      const url = request.nextUrl.clone();
      url.pathname = '/user/profile';
      return NextResponse.redirect(url);
    }

    // Si ya estás logueado y tratas de ir a login, te mandamos a tu panel correspondiente
    if (isSellerAuth || isBuyerAuth) {
      const url = request.nextUrl.clone();
      url.pathname = role === 'SELLER' ? '/dashboard' : '/user/profile';
      return NextResponse.redirect(url);
    }
  }

  // Comportamiento Visitantes Anónimos
  if (!user) {
    if (isDashboard) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
    }
    // NOTA: /user/profile es ahora publico (El Hub). No redirigimos invitados a login.
  }

  return supabaseResponse;
}
