"use client";

import React, { useState, useMemo } from "react";
import { formatCurrency } from "@/utils/formatters";
import { buyerLogoutAction } from "@/app/actions/buyerAuth";
import { useCart } from "./CartContext";
import { useAuthDrawer } from "./BuyerAuthContext";
import { CartDrawer } from "./CartDrawer";

type UserData = {
  id: string;
  name: string;
  email: string;
};

type OrderData = {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: Date;
  business: { name: string };
  items: Array<{ id: string; quantity: number; product: { name: string } }>;
};

type StoreData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  city: string | null;
  country: string | null;
};

interface HubDashboardProps {
  user: UserData | null;
  orders: OrderData[];
  stores: StoreData[];
}

// ─── Status config ──────────────────────────────────────────
const STATUS_META: Record<string, { label: string; cls: string; dot: string; msg: string }> = {
  PENDING:    { label: "Recibido",  cls: "hub-badge-warning",  dot: "#fbbf24", msg: "Tu orden llegó al local. Esperando confirmación de la cocina." },
  PROCESSING: { label: "En cocina", cls: "hub-badge-info",     dot: "#3b9eff", msg: "El chef está preparando tu pedido. Tiempo estimado: ~15-25 min." },
  COMPLETED:  { label: "Entregado", cls: "hub-badge-success",  dot: "#34d399", msg: "¡Finalizado! Tu pedido fue completado exitosamente." },
  CANCELLED:  { label: "Cancelado", cls: "hub-badge-danger",   dot: "#f87171", msg: "Este pedido fue cancelado." },
};

function getStatus(status: string) {
  return STATUS_META[status] ?? { label: status, cls: "", dot: "#888", msg: "" };
}

// ─── Main Component ─────────────────────────────────────────
export default function HubDashboard({ user, orders, stores }: HubDashboardProps) {
  const [searchTerm, setSearchTerm]     = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const { items: cartItems, itemCount, cartTotal, isHydrated, openCart } = useCart();
  const { openAuthDrawer } = useAuthDrawer();

  const activeCartSlug = useMemo(() => {
    if (cartItems.length === 0) return null;
    return stores.find(s => s.id === cartItems[0].businessId)?.slug ?? null;
  }, [cartItems, stores]);

  const dbCities = useMemo(() =>
    Array.from(new Set(stores.map(s => s.city).filter(Boolean) as string[])),
    [stores]
  );

  const filteredStores = useMemo(() =>
    stores.filter(store => {
      const matchCity   = selectedCity ? store.city === selectedCity : true;
      const matchSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (store.description?.toLowerCase() ?? "").includes(searchTerm.toLowerCase());
      return matchCity && matchSearch;
    }),
    [stores, searchTerm, selectedCity]
  );

  const totalSpent  = orders.reduce((s, o) => s + o.totalAmount, 0);
  const totalOrders = orders.length;
  const userInitial = user?.name?.charAt(0).toUpperCase() ?? "?";
  const firstName   = user?.name?.split(" ")[0] ?? "";

  return (
    <>
      {activeCartSlug && <CartDrawer slug={activeCartSlug} user={user} />}

      <div className="hub-root">

        {/* ── TOPBAR ─────────────────────────────────────────── */}
        <header className="hub-topbar">
          <a href="/" className="hub-brand">
            <img src="/logo.png" alt="NEXU" className="hub-brand-logo" />
            <span className="hub-brand-name">Customer Hub</span>
          </a>

          <div className="hub-topbar-right">
            {isHydrated && itemCount > 0 && activeCartSlug && (
              <button onClick={openCart} className="hub-cart-btn">
                <span>🛒 {itemCount}</span>
                <span className="hub-cart-total">{formatCurrency(cartTotal)}</span>
              </button>
            )}

            {user ? (
              <div className="hub-user-row">
                {orders.length > 0 && (
                  <div className="hub-active-order">
                    <span className="hub-active-order-label">Pedido activo</span>
                    <StatusPill status={orders[0].status} />
                  </div>
                )}
                <form action={buyerLogoutAction}>
                  <input type="hidden" name="redirectTo" value="/user/profile" />
                  <button type="submit" className="hub-btn hub-btn-ghost">
                    Cerrar sesión
                  </button>
                </form>
                <div className="hub-avatar">{userInitial}</div>
              </div>
            ) : (
              <button onClick={openAuthDrawer} className="hub-btn hub-btn-primary">
                Ingresar a mi cuenta
              </button>
            )}
          </div>
        </header>

        {/* ── MAIN ───────────────────────────────────────────── */}
        <main className="hub-main">

          {/* ── PROFILE HERO (solo logueado) ── */}
          {user ? (
            <div className="hub-profile-hero">
              <div className="hub-profile-identity">
                <div className="hub-profile-avatar">{userInitial}</div>
                <div className="hub-profile-info">
                  <span className="hub-profile-kicker">Mi cuenta</span>
                  <h1 className="hub-profile-name">Hola, {firstName} 👋</h1>
                  <p className="hub-profile-email">{user.email}</p>
                </div>
                <div className="hub-profile-badge">
                  <span className="hub-profile-badge-dot" />
                  Cliente activo
                </div>
              </div>

              <div className="hub-stats-row">
                <div className="hub-stat-tile">
                  <span className="hub-stat-label">Pedidos realizados</span>
                  <span className="hub-stat-value">{totalOrders}</span>
                </div>
                <div className="hub-stat-tile">
                  <span className="hub-stat-label">Total invertido</span>
                  <span className="hub-stat-value">{formatCurrency(totalSpent)}</span>
                </div>
                <div className="hub-stat-tile">
                  <span className="hub-stat-label">Restaurantes visitados</span>
                  <span className="hub-stat-value">
                    {new Set(orders.map(o => o.business.name)).size}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* ── GUEST HERO ── */
            <div className="hub-guest-hero">
              <h1 className="hub-guest-title">Encuentra tu próximo sabor</h1>
              <p className="hub-guest-sub">
                Navega por todos nuestros restaurantes.{" "}
                <button onClick={openAuthDrawer} className="hub-link">Crea una cuenta</button>{" "}
                o entra para pedir con 1-Click y guardar tu historial.
              </p>
            </div>
          )}

          {/* ── CONTENT GRID ── */}
          <div className={`hub-content-grid ${user && orders.length > 0 ? "hub-content-grid-2col" : ""}`}>

            {/* ── COLUMNA PRINCIPAL ── */}
            <div className="hub-main-col">

              {/* Search & Filters */}
              <div className="hub-section-box">
                <div className="hub-section-head">
                  <h2>Restaurantes</h2>
                  <span className="hub-badge hub-badge-neutral">{filteredStores.length} disponibles</span>
                </div>

                <div className="hub-search-wrap">
                  <span className="hub-search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Busca locales, tipo de cocina..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") e.preventDefault(); }}
                    className="hub-search-input"
                  />
                </div>

                {dbCities.length > 0 && (
                  <div className="hub-filter-pills">
                    <button
                      type="button"
                      onClick={() => setSelectedCity(null)}
                      className={`hub-pill ${selectedCity === null ? "hub-pill-active" : ""}`}
                    >
                      Todas las ciudades
                    </button>
                    {dbCities.map(city => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => setSelectedCity(city)}
                        className={`hub-pill ${selectedCity === city ? "hub-pill-active" : ""}`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Store grid */}
              {filteredStores.length === 0 ? (
                <div className="hub-empty">
                  <span className="hub-empty-icon">🕵️‍♂️</span>
                  <h3>Sin coincidencias</h3>
                  <p>Intenta otros términos o elimina el filtro de ciudad.</p>
                </div>
              ) : (
                <div className="hub-store-grid">
                  {filteredStores.map(store => (
                    <a key={store.id} href={`/store/${store.slug}`} className="hub-store-card">
                      <div className="hub-store-img">🍽️</div>
                      <div className="hub-store-body">
                        <h3 className="hub-store-name">{store.name}</h3>
                        <p className="hub-store-desc">
                          {store.description ?? "La mejor experiencia garantizada para ti."}
                        </p>
                        {store.city && (
                          <span className="hub-store-loc">📍 {store.city}</span>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* ── COLUMNA LATERAL: HISTORIAL (solo logueado con pedidos) ── */}
            {user && orders.length > 0 && (
              <aside className="hub-aside">
                <div className="hub-section-box">
                  <div className="hub-section-head">
                    <h2>Mis Pedidos</h2>
                    <span className="hub-badge hub-badge-neutral">{orders.length}</span>
                  </div>

                  <div className="hub-order-list">
                    {orders.slice(0, 6).map(order => (
                      <OrderRow key={order.id} order={order} />
                    ))}
                  </div>
                </div>
              </aside>
            )}
          </div>
        </main>
      </div>

      <HubStyles />
    </>
  );
}

// ─── Order Row ───────────────────────────────────────────────
function OrderRow({ order }: { order: OrderData }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const meta = getStatus(order.status);

  return (
    <div className="hub-order-row">
      <div className="hub-order-top">
        <span className="hub-order-biz">{order.business.name}</span>
        <span className="hub-order-amt">{formatCurrency(order.totalAmount)}</span>
      </div>
      <div className="hub-order-mid">
        <span className="hub-order-date">
          {new Date(order.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
        </span>
        <div
          className="hub-status-wrap"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <StatusPill status={order.status} />
          {showTooltip && meta.msg && (
            <div className="hub-tooltip">{meta.msg}</div>
          )}
        </div>
      </div>
      <div className="hub-order-items">
        {order.items.slice(0, 2).map((item, i) => (
          <span key={i} className="hub-item-chip">
            {item.quantity}× {item.product.name}
          </span>
        ))}
        {order.items.length > 2 && (
          <span className="hub-item-chip hub-item-chip-more">+{order.items.length - 2} más</span>
        )}
      </div>
    </div>
  );
}

// ─── Status Pill ─────────────────────────────────────────────
function StatusPill({ status }: { status: string }) {
  const meta = getStatus(status);
  return (
    <span className={`hub-status-pill ${meta.cls}`}>
      <span className="hub-status-dot" style={{ background: meta.dot }} />
      {meta.label}
    </span>
  );
}

// ─── Scoped Styles ───────────────────────────────────────────
function HubStyles() {
  return (
    <style>{`
      /* ── ROOT ── */
      .hub-root {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background: var(--ds-bg-base, #0b0f14);
        color: var(--ds-text-primary, #e8edf5);
        font-family: inherit;
      }

      /* ── TOPBAR ── */
      .hub-topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 64px;
        padding: 0 2rem;
        background: var(--ds-bg-surface, #111621);
        border-bottom: 1px solid rgba(255,255,255,0.07);
        position: sticky;
        top: 0;
        z-index: 50;
      }
      .hub-brand { display: flex; align-items: center; gap: 0.25rem; text-decoration: none; }
      .hub-brand-logo { height: 110px; width: auto; margin: -40px -16px -40px -24px; }
      .hub-brand-name { font-size: 1.05rem; font-weight: 800; color: var(--ds-text-primary, #e8edf5); letter-spacing: -0.01em; }

      .hub-topbar-right { display: flex; align-items: center; gap: 0.75rem; }

      .hub-user-row { display: flex; align-items: center; gap: 0.75rem; }
      .hub-active-order {
        display: flex; align-items: center; gap: 0.5rem;
        padding-right: 0.75rem;
        border-right: 1px solid rgba(255,255,255,0.07);
      }
      .hub-active-order-label { font-size: 0.78rem; color: rgba(160,175,200,0.6); font-weight: 600; }
      .hub-avatar {
        width: 36px; height: 36px; border-radius: 50%;
        background: linear-gradient(135deg, #3b9eff 0%, #1a78e0 100%);
        color: #fff; display: flex; align-items: center; justify-content: center;
        font-weight: 800; font-size: 1rem;
      }

      /* ── BUTTONS ── */
      .hub-btn {
        display: inline-flex; align-items: center; gap: 0.5rem;
        padding: 0.55rem 1.1rem; border-radius: 999px;
        font-size: 0.86rem; font-weight: 700;
        cursor: pointer; border: none; outline: none;
        transition: transform 0.15s, opacity 0.15s;
      }
      .hub-btn:hover { transform: translateY(-1px); opacity: 0.92; }
      .hub-btn-primary { background: var(--ds-accent, #3b9eff); color: #fff; }
      .hub-btn-ghost {
        background: rgba(255,255,255,0.05);
        color: var(--ds-text-secondary, rgba(200,210,230,0.72));
        border: 1px solid rgba(255,255,255,0.09);
      }
      .hub-link { background: none; border: none; cursor: pointer; color: var(--ds-accent, #3b9eff); font-weight: 700; font-size: inherit; padding: 0; text-decoration: underline; }

      .hub-cart-btn {
        display: flex; align-items: center; gap: 0.5rem;
        height: 38px; border-radius: 999px; padding: 0 1.1rem;
        background: #ef4444; color: #fff; font-weight: 800;
        border: none; cursor: pointer; font-size: 0.88rem;
        transition: transform 0.15s;
      }
      .hub-cart-btn:hover { transform: translateY(-1px); }
      .hub-cart-total {
        font-size: 0.78rem; font-weight: 700;
        background: rgba(0,0,0,0.18); padding: 0.1rem 0.45rem; border-radius: 4px;
      }

      /* ── MAIN WRAPPER ── */
      .hub-main {
        flex: 1;
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
        padding: 2rem 1.5rem 3rem;
        display: flex;
        flex-direction: column;
        gap: 1.75rem;
      }

      /* ── PROFILE HERO ── */
      .hub-profile-hero {
        background: var(--ds-bg-surface, #111621);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 20px;
        padding: 1.75rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        position: relative;
        overflow: hidden;
      }
      .hub-profile-hero::before {
        content: '';
        position: absolute; inset: 0 0 auto 0; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.09), transparent);
      }
      .hub-profile-identity {
        display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap;
      }
      .hub-profile-avatar {
        width: 64px; height: 64px; border-radius: 50%;
        background: linear-gradient(135deg, #3b9eff 0%, #1a78e0 100%);
        color: #fff; display: flex; align-items: center; justify-content: center;
        font-size: 1.75rem; font-weight: 900; flex-shrink: 0;
        box-shadow: 0 4px 18px rgba(59,158,255,0.30);
      }
      .hub-profile-info { display: flex; flex-direction: column; gap: 0.2rem; flex: 1; }
      .hub-profile-kicker {
        font-size: 0.72rem; font-weight: 700; letter-spacing: 0.12em;
        text-transform: uppercase; color: var(--ds-accent, #3b9eff); opacity: 0.9;
      }
      .hub-profile-name { margin: 0; font-size: 1.65rem; font-weight: 800; letter-spacing: -0.03em; color: var(--ds-text-primary, #e8edf5); }
      .hub-profile-email { margin: 0; font-size: 0.88rem; color: rgba(160,175,200,0.6); }
      .hub-profile-badge {
        display: inline-flex; align-items: center; gap: 0.45rem;
        padding: 0.5rem 0.9rem; border-radius: 999px;
        background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
        font-size: 0.8rem; font-weight: 600; color: rgba(200,210,230,0.72);
        margin-left: auto;
      }
      .hub-profile-badge-dot {
        width: 7px; height: 7px; border-radius: 50%;
        background: #34d399; box-shadow: 0 0 7px rgba(52,211,153,0.65);
        flex-shrink: 0;
      }

      /* ── STATS ── */
      .hub-stats-row {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.75rem;
      }
      .hub-stat-tile {
        display: flex; flex-direction: column; gap: 0.3rem;
        padding: 1rem 1.25rem;
        background: var(--ds-bg-elevated, #161c28);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 14px;
      }
      .hub-stat-label {
        font-size: 0.73rem; font-weight: 600; letter-spacing: 0.06em;
        text-transform: uppercase; color: rgba(160,175,200,0.55);
      }
      .hub-stat-value { font-size: 1.55rem; font-weight: 800; letter-spacing: -0.03em; color: var(--ds-text-primary, #e8edf5); }

      /* ── GUEST HERO ── */
      .hub-guest-hero {
        background: var(--ds-bg-surface, #111621);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 20px;
        padding: 3rem 2rem;
        text-align: center;
      }
      .hub-guest-title { font-size: 2.25rem; font-weight: 900; letter-spacing: -0.04em; margin: 0 0 0.75rem; }
      .hub-guest-sub { font-size: 1.05rem; color: rgba(200,210,230,0.65); max-width: 580px; margin: 0 auto; line-height: 1.65; }

      /* ── CONTENT GRID ── */
      .hub-content-grid { display: flex; flex-direction: column; gap: 1.5rem; }
      .hub-content-grid-2col { display: grid; grid-template-columns: 1fr 340px; gap: 1.5rem; align-items: start; }
      .hub-main-col { display: flex; flex-direction: column; gap: 1.25rem; }
      .hub-aside { position: sticky; top: 80px; }

      /* ── SECTION BOX ── */
      .hub-section-box {
        background: var(--ds-bg-surface, #111621);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 18px;
        padding: 1.4rem 1.5rem;
        position: relative; overflow: hidden;
      }
      .hub-section-box::before {
        content: '';
        position: absolute; inset: 0 0 auto 0; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
      }
      .hub-section-head {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: 1.1rem;
      }
      .hub-section-head h2 {
        margin: 0; font-size: 0.98rem; font-weight: 700;
        letter-spacing: -0.01em; color: var(--ds-text-primary, #e8edf5);
      }

      /* ── BADGES ── */
      .hub-badge {
        display: inline-flex; align-items: center; gap: 0.35rem;
        padding: 0.22rem 0.65rem; border-radius: 999px;
        font-size: 0.75rem; font-weight: 700; border: 1px solid;
      }
      .hub-badge-neutral {
        background: rgba(255,255,255,0.04);
        border-color: rgba(255,255,255,0.09);
        color: rgba(200,210,230,0.65);
      }

      /* ── SEARCH ── */
      .hub-search-wrap {
        position: relative; display: flex; align-items: center;
        margin-bottom: 0.85rem;
      }
      .hub-search-icon {
        position: absolute; left: 1rem; font-size: 1rem;
        opacity: 0.45; pointer-events: none;
      }
      .hub-search-input {
        width: 100%; padding: 0.82rem 1rem 0.82rem 2.75rem;
        background: var(--ds-bg-elevated, #161c28);
        border: 1px solid rgba(255,255,255,0.09);
        border-radius: 12px; color: var(--ds-text-primary, #e8edf5);
        font-size: 0.95rem; outline: none;
        transition: border-color 0.18s, box-shadow 0.18s;
      }
      .hub-search-input:focus {
        border-color: rgba(59,158,255,0.45);
        box-shadow: 0 0 0 3px rgba(59,158,255,0.10);
      }
      .hub-search-input::placeholder { color: rgba(160,175,200,0.4); }

      /* ── FILTER PILLS ── */
      .hub-filter-pills { display: flex; gap: 0.5rem; flex-wrap: wrap; }
      .hub-pill {
        padding: 0.38rem 1rem; border-radius: 999px;
        font-size: 0.82rem; font-weight: 700;
        cursor: pointer; border: 1px solid rgba(255,255,255,0.09);
        background: rgba(255,255,255,0.04); color: rgba(200,210,230,0.65);
        transition: all 0.15s;
      }
      .hub-pill-active {
        background: var(--ds-accent, #3b9eff); border-color: transparent; color: #fff;
      }
      .hub-pill:hover:not(.hub-pill-active) { background: rgba(255,255,255,0.07); }

      /* ── STORE GRID ── */
      .hub-store-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1rem;
      }
      .hub-store-card {
        background: var(--ds-bg-surface, #111621);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 18px; overflow: hidden;
        text-decoration: none; color: inherit;
        transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
        display: flex; flex-direction: column;
      }
      .hub-store-card:hover {
        transform: translateY(-2px);
        border-color: rgba(59,158,255,0.25);
        box-shadow: 0 8px 28px rgba(0,0,0,0.30);
      }
      .hub-store-img {
        height: 130px; background: var(--ds-bg-elevated, #161c28);
        display: flex; align-items: center; justify-content: center;
        font-size: 2.75rem;
        border-bottom: 1px solid rgba(255,255,255,0.07);
      }
      .hub-store-body { padding: 1.2rem 1.3rem; flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
      .hub-store-name { margin: 0; font-size: 1.1rem; font-weight: 800; letter-spacing: -0.01em; color: var(--ds-text-primary, #e8edf5); }
      .hub-store-desc { margin: 0; font-size: 0.85rem; color: rgba(200,210,230,0.6); line-height: 1.55; flex: 1; }
      .hub-store-loc {
        display: inline-flex; align-items: center; gap: 0.3rem;
        font-size: 0.78rem; font-weight: 700;
        background: rgba(59,158,255,0.09);
        color: var(--ds-accent, #3b9eff);
        padding: 0.25rem 0.65rem; border-radius: 999px;
        border: 1px solid rgba(59,158,255,0.18);
        width: max-content;
      }

      /* ── EMPTY ── */
      .hub-empty {
        display: flex; flex-direction: column; align-items: center;
        gap: 0.75rem; padding: 3.5rem 2rem; text-align: center;
        background: var(--ds-bg-surface, #111621);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 18px;
      }
      .hub-empty-icon { font-size: 2.5rem; }
      .hub-empty h3 { margin: 0; font-size: 1.15rem; font-weight: 800; color: var(--ds-text-primary, #e8edf5); }
      .hub-empty p  { margin: 0; font-size: 0.9rem; color: rgba(160,175,200,0.55); }

      /* ── ORDER ROW ── */
      .hub-order-list { display: flex; flex-direction: column; gap: 0.25rem; }
      .hub-order-row {
        display: flex; flex-direction: column; gap: 0.5rem;
        padding: 0.85rem 0.9rem; border-radius: 12px;
        border: 1px solid transparent;
        transition: background 0.15s, border-color 0.15s;
      }
      .hub-order-row:hover {
        background: rgba(255,255,255,0.03);
        border-color: rgba(255,255,255,0.07);
      }
      .hub-order-top { display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; }
      .hub-order-biz { font-size: 0.92rem; font-weight: 700; color: var(--ds-text-primary, #e8edf5); }
      .hub-order-amt { font-size: 0.92rem; font-weight: 800; color: var(--ds-text-primary, #e8edf5); font-family: monospace; }
      .hub-order-mid { display: flex; justify-content: space-between; align-items: center; }
      .hub-order-date { font-size: 0.78rem; color: rgba(160,175,200,0.5); }
      .hub-order-items { display: flex; gap: 0.35rem; flex-wrap: wrap; }
      .hub-item-chip {
        font-size: 0.73rem; padding: 0.18rem 0.5rem; border-radius: 6px;
        background: rgba(255,255,255,0.05); color: rgba(200,210,230,0.6);
        font-weight: 600; border: 1px solid rgba(255,255,255,0.07);
      }
      .hub-item-chip-more { color: rgba(160,175,200,0.4); }

      /* ── STATUS ── */
      .hub-status-wrap { position: relative; }
      .hub-status-pill {
        display: inline-flex; align-items: center; gap: 0.35rem;
        padding: 0.22rem 0.65rem; border-radius: 999px;
        font-size: 0.75rem; font-weight: 700;
        border: 1px solid transparent; cursor: help;
      }
      .hub-status-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
      .hub-badge-warning  { background: rgba(251,191,36,0.10);  border-color: rgba(251,191,36,0.25);  color: #fbbf24; }
      .hub-badge-info     { background: rgba(59,158,255,0.10);  border-color: rgba(59,158,255,0.25);  color: #3b9eff; }
      .hub-badge-success  { background: rgba(52,211,153,0.10);  border-color: rgba(52,211,153,0.25);  color: #34d399; }
      .hub-badge-danger   { background: rgba(248,113,113,0.10); border-color: rgba(248,113,113,0.25); color: #f87171; }
      .hub-tooltip {
        position: absolute;
        top: calc(100% + 8px); right: 0;
        width: 230px; padding: 0.85rem;
        background: var(--ds-bg-surface, #111621);
        border: 1px solid rgba(255,255,255,0.09);
        border-radius: 12px; font-size: 0.83rem; line-height: 1.5;
        color: var(--ds-text-primary, #e8edf5);
        box-shadow: 0 8px 24px rgba(0,0,0,0.45);
        z-index: 100; pointer-events: none;
        animation: fadeInUp 0.18s ease;
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(4px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      /* ── RESPONSIVE ── */
      @media (max-width: 960px) {
        .hub-content-grid-2col { grid-template-columns: 1fr; }
        .hub-aside { position: static; }
      }
      @media (max-width: 640px) {
        .hub-topbar { padding: 0 1rem; }
        .hub-main { padding: 1.25rem 1rem 2.5rem; }
        .hub-stats-row { grid-template-columns: repeat(2, 1fr); }
        .hub-profile-avatar { width: 48px; height: 48px; font-size: 1.3rem; }
        .hub-profile-name { font-size: 1.35rem; }
        .hub-profile-badge { display: none; }
        .hub-store-grid { grid-template-columns: 1fr; }
      }
    `}</style>
  );
}
