"use client";

import { Search, Bell } from 'lucide-react';

export function SellerTopbar() {
  return (
    <header
      className="relative z-10 flex h-16 items-center justify-between px-6 shrink-0"
      style={{
        background: 'var(--ds-bg-surface)',
        borderBottom: '1px solid var(--ds-border-soft)',
      }}
    >
      {/* Left: Page context */}
      <div className="flex flex-col">
        <h2
          className="text-sm font-700 leading-tight"
          style={{ color: 'var(--ds-text-primary)', fontWeight: 700 }}
        >
          Panel de Control
        </h2>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="h-1.5 w-1.5 rounded-full animate-pulse"
            style={{ background: 'var(--ds-success)', boxShadow: '0 0 6px rgba(52,211,153,0.7)' }}
          />
          <span
            className="text-[11px] font-medium"
            style={{ color: 'var(--ds-text-muted)' }}
          >
            Sistema operativo
          </span>
        </div>
      </div>

      {/* Right: Search + User */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative flex items-center">
          <Search
            className="absolute left-3 h-4 w-4 pointer-events-none"
            style={{ color: 'var(--ds-text-muted)' }}
            strokeWidth={1.8}
          />
          <input
            type="text"
            placeholder="Buscar orden, cliente..."
            className="h-9 w-56 pl-9 pr-3 text-sm rounded-xl outline-none transition-all"
            style={{
              background: 'var(--ds-bg-elevated)',
              border: '1px solid var(--ds-border-main)',
              color: 'var(--ds-text-primary)',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = 'rgba(59,158,255,0.45)';
              e.currentTarget.style.boxShadow   = '0 0 0 3px rgba(59,158,255,0.10)';
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = 'var(--ds-border-main)';
              e.currentTarget.style.boxShadow   = 'none';
            }}
          />
        </div>

        {/* Notification icon */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
          style={{ background: 'var(--ds-bg-elevated)', border: '1px solid var(--ds-border-main)', color: 'var(--ds-text-muted)' }}
        >
          <Bell className="h-4 w-4" strokeWidth={1.8} />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2.5" style={{ borderLeft: '1px solid var(--ds-border-soft)', paddingLeft: '1rem' }}>
          <div className="flex flex-col items-end">
            <span className="text-[12px] font-700 leading-tight" style={{ color: 'var(--ds-text-primary)', fontWeight: 700 }}>Mi negocio</span>
            <span className="text-[11px]" style={{ color: 'var(--ds-text-muted)' }}>Administrador</span>
          </div>
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg font-bold text-sm"
            style={{
              background: 'linear-gradient(135deg, var(--ds-accent) 0%, #1a78e0 100%)',
              color: '#fff',
            }}
          >
            N
          </div>
        </div>
      </div>
    </header>
  );
}
