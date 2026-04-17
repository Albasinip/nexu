import React from "react";
import Link from "next/link";
import { CartProvider } from "@/components/buyer/CartContext";
import { CartIndicator } from "@/components/buyer/CartIndicator";
import { CartDrawer } from "@/components/buyer/CartDrawer";
import { AuthDrawerProvider } from "@/components/buyer/BuyerAuthContext";
import { BuyerAuthDrawer } from "@/components/buyer/BuyerAuthDrawer";
import { StoreLoginButton } from "@/components/buyer/StoreLoginButton";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { buyerLogoutAction } from "@/app/actions/buyerAuth";

export const dynamic = "force-dynamic";

type StorefrontLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

function getBuyerFirstName(
  dbUser: { name?: string | null } | null,
  user: {
    user_metadata?: {
      name?: string;
    };
  } | null
) {
  return (
    dbUser?.name?.trim().split(" ")[0] ||
    user?.user_metadata?.name?.trim().split(" ")[0] ||
    "Perfil"
  );
}

export default async function StorefrontLayout({
  children,
  params,
}: StorefrontLayoutProps) {
  const { slug } = await params;

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let dbUser: { id: string; name: string | null } | null = null;

  if (user) {
    const role = user.user_metadata?.role || "BUYER";

    if (role === "BUYER") {
      dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          name: true,
        },
      });
    }
  }

  const buyerName = getBuyerFirstName(dbUser, user);

  return (
    <AuthDrawerProvider>
      <CartProvider>
        <BuyerAuthDrawer />

        <CartDrawer
          slug={slug}
          user={
            user
              ? {
                name: dbUser?.name || user.user_metadata?.name || "Cliente",
              }
              : null
          }
        />

        <div className="storefront-shell">
          <div className="storefront-shell__glow storefront-shell__glow--left" />
          <div className="storefront-shell__glow storefront-shell__glow--right" />

          <div className="storefront-topbar">
            <div className="storefront-topbar__inner">
              <Link
                href="/store"
                className="storefront-topbar__back"
                title="Volver a los locales"
              >
                <span className="storefront-topbar__icon">←</span>
                <span>Volver</span>
              </Link>

              <div className="storefront-topbar__actions">
                {user ? (
                  <>
                    <Link
                      href="/user/profile"
                      className="storefront-topbar__profile"
                      title="Ver mi historial"
                    >
                      <span className="storefront-topbar__avatar">👤</span>
                      <span>{buyerName}</span>
                    </Link>

                    <form action={buyerLogoutAction}>
                      <input
                        type="hidden"
                        name="redirectTo"
                        value={`/store/${slug}`}
                      />
                      <button
                        type="submit"
                        className="storefront-topbar__logout"
                        title="Cerrar sesión segura"
                      >
                        Salir
                      </button>
                    </form>
                  </>
                ) : (
                  <StoreLoginButton />
                )}
              </div>
            </div>
          </div>

          <main className="storefront-main">{children}</main>

          <CartIndicator />
        </div>
      </CartProvider>
    </AuthDrawerProvider>
  );
}