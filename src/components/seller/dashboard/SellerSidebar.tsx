"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Users, Settings, PackageOpen, LayoutList, LogOut } from 'lucide-react';
import { logout } from '@/app/actions/auth';

const navItems = [
  { name: 'Control',    icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Órdenes',   icon: ShoppingBag,     href: '/dashboard/orders' },
  { name: 'Inventario', icon: PackageOpen,     href: '/dashboard/products' },
  { name: 'Clientes',  icon: Users,            href: '/dashboard/customers' },
  { name: 'Reportes',  icon: LayoutList,       href: '/dashboard/reports' },
  { name: 'Sistema',   icon: Settings,         href: '/dashboard/settings' },
];

export function SellerSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="relative z-20 flex flex-col shrink-0"
      style={{
        width: '80px',
        background: 'var(--ds-bg-surface)',
        borderRight: '1px solid var(--ds-border-soft)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-16 shrink-0" style={{ borderBottom: '1px solid var(--ds-border-soft)' }}>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl font-black text-lg"
          style={{
            background: 'linear-gradient(135deg, var(--ds-accent) 0%, #1a78e0 100%)',
            color: '#fff',
            letterSpacing: '-0.04em',
            boxShadow: '0 4px 14px rgba(59,158,255,0.30)',
          }}
        >
          N
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col items-center gap-1.5 py-4 px-2.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={item.name}
              className="relative flex flex-col items-center justify-center w-full rounded-xl transition-all duration-200 py-2 gap-1"
              style={{
                color: isActive ? 'var(--ds-accent)' : 'var(--ds-text-muted)',
                background: isActive ? 'var(--ds-accent-soft)' : 'transparent',
                border: `1px solid ${isActive ? 'rgba(59,158,255,0.20)' : 'transparent'}`,
              }}
            >
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                  style={{ background: 'var(--ds-accent)' }}
                />
              )}
              <item.icon
                className="h-[18px] w-[18px] shrink-0"
                strokeWidth={isActive ? 2 : 1.6}
              />
              <span
                className="text-[9.5px] font-semibold leading-none"
                style={{ color: isActive ? 'var(--ds-accent)' : 'var(--ds-text-muted)', letterSpacing: '0.02em' }}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div
        className="flex flex-col items-center pb-4 px-2.5"
        style={{ borderTop: '1px solid var(--ds-border-soft)' }}
      >
        <form action={logout} className="w-full pt-4">
          <button
            type="submit"
            title="Cerrar sesión"
            className="flex flex-col items-center justify-center w-full rounded-xl py-2 gap-1 transition-all duration-200"
            style={{ color: 'var(--ds-text-muted)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--ds-danger)';
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--ds-danger-soft)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--ds-text-muted)';
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            <LogOut className="h-[18px] w-[18px]" strokeWidth={1.6} />
            <span className="text-[9.5px] font-semibold" style={{ letterSpacing: '0.02em' }}>Salir</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
