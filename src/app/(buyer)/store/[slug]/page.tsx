import { storefrontService } from "@/core/storefront/storefront.service";
import Link from "next/link";
import { ProductCard } from "@/components/buyer/ProductCard";
import { PromoPopup } from "@/components/buyer/Conversion/PromoPopup";
import { SmartWelcome } from "@/components/buyer/Conversion/SmartWelcome";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type StorefrontPageProps = {
  params: Promise<{ slug: string }>;
};

function getCategoryId(category: string) {
  return `cat-${category.replace(/\s+/g, "-").toLowerCase()}`;
}

export default async function StorefrontPage({ params }: StorefrontPageProps) {
  const { slug } = await params;
  const store = await storefrontService.getMenuBySlug(slug);

  // ❌ ERROR CONTROL (TS SAFE)
  if (!store.success) {
    return (
      <>
        <StorefrontStyles />
        <div className="sf-not-found">
          <div className="sf-not-found-card">
            <span className="sf-not-found-icon">🚫</span>
            <h2 className="sf-not-found-title">Esta tienda no está disponible</h2>
            <p className="sf-not-found-text">
              {store.error ?? "El negocio no está activo o fue removido del sistema."}
            </p>
            <Link href="/store" className="sf-btn sf-btn-primary">
              Explorar otras tiendas
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (!store.data) {
    return (
      <>
        <StorefrontStyles />
        <div className="sf-not-found">
          <div className="sf-not-found-card">
            <span className="sf-not-found-icon">🔎</span>
            <h2 className="sf-not-found-title">No encontramos esta tienda</h2>
            <p className="sf-not-found-text">
              Puede que el enlace esté incorrecto o el negocio ya no exista.
            </p>
            <Link href="/store" className="sf-btn sf-btn-primary">
              Ver marketplace
            </Link>
          </div>
        </div>
      </>
    );
  }

  const { business, products } = store.data;

  const categories = Array.from(
    new Set(products.map((p) => p.category || "General"))
  );

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hasOrders = false;
  if (user) {
    const count = await prisma.order.count({
      where: { buyerId: user.id, businessId: business.id },
    });
    hasOrders = count > 0;
  }

  const businessInitial = business.name.charAt(0).toUpperCase();

  return (
    <>
      <StorefrontStyles />
      <PromoPopup slug={business.slug} />

      <div className="sf-page">

        {/* HERO */}
        <div className="sf-hero">
          <div className="sf-hero-glow sf-hero-glow-l" />
          <div className="sf-hero-glow sf-hero-glow-r" />

          <div className="sf-container">
            <div className="sf-hero-card">

              <div className="sf-business-avatar">{businessInitial}</div>

              <div className="sf-business-info">
                <div className="sf-business-meta">
                  <span className="sf-kicker">MENÚ DIGITAL</span>
                  <span className="sf-status-pill">
                    <span className="sf-status-dot" />
                    Disponible ahora
                  </span>
                </div>

                <h1 className="sf-business-name">{business.name}</h1>

                {business.description && (
                  <p className="sf-business-desc">{business.description}</p>
                )}

                {(business.city || business.country) && (
                  <span className="sf-location-pill">
                    📍 {[business.city, business.country].filter(Boolean).join(", ")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="sf-container sf-main">

          <SmartWelcome
            userName={user?.user_metadata?.name || user?.email}
            hasOrders={hasOrders}
          />

          {/* NAV */}
          {products.length > 0 && (
            <nav className="sf-cat-nav">
              <div className="sf-cat-nav-scroll">
                {categories.map(cat => (
                  <a key={cat} href={`#${getCategoryId(cat)}`} className="sf-cat-link">
                    {cat}
                  </a>
                ))}
              </div>
            </nav>
          )}

          {/* EMPTY */}
          {products.length === 0 ? (
            <div className="sf-empty-state">
              <div className="sf-empty-icon">🍽️</div>
              <h2 className="sf-empty-title">Menú en construcción</h2>
              <p className="sf-empty-text">
                Este local aún no ha publicado sus productos.<br />
                Probablemente estén afinando los últimos detalles.
              </p>
              <div className="sf-empty-hint">
                <span className="sf-empty-hint-dot" />
                Pronto disponible
              </div>
            </div>
          ) : (
            <div className="sf-menu">
              {categories.map((cat) => {
                const catProducts = products.filter(
                  p => (p.category || "General") === cat
                );

                return (
                  <div key={cat} id={getCategoryId(cat)} className="sf-menu-section">

                    <div className="sf-section-head">
                      <span className="sf-section-kicker">Categoría</span>
                      <h2 className="sf-section-title">{cat}</h2>
                    </div>

                    <div className="sf-product-grid">
                      {catProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

function StorefrontStyles() {
  return (
    <style>{`
      .sf-not-found {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #0b0f14;
      }

      .sf-not-found-card {
        text-align: center;
        padding: 3rem;
        border-radius: 20px;
        background: #111621;
        border: 1px solid rgba(255,255,255,0.07);
        max-width: 420px;
      }

      .sf-not-found-title {
        font-size: 1.5rem;
        font-weight: 800;
        color: #fff;
        margin-bottom: 0.5rem;
      }

      .sf-not-found-text {
        color: rgba(200,210,230,0.6);
        font-size: 0.95rem;
        margin-bottom: 1.5rem;
      }

      .sf-btn-primary {
        background: #3b9eff;
        color: white;
        padding: 0.7rem 1.4rem;
        border-radius: 999px;
        font-weight: 700;
        text-decoration: none;
      }

      .sf-btn-primary:hover {
        opacity: 0.9;
      }
    `}</style>
  );
} 