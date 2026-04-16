import React from 'react';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: 'var(--ds-bg-base)', color: 'var(--ds-text-primary)' }}>
      {/* Ambient depth layers — very subtle */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 right-[15%] w-[40%] h-[45%] rounded-full opacity-60" style={{ background: 'radial-gradient(circle, rgba(59,158,255,0.04) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-0 left-0 w-[30%] h-[40%] rounded-full opacity-50" style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.03) 0%, transparent 70%)', filter: 'blur(100px)' }} />
      </div>
      
      {children}
    </div>
  );
}
