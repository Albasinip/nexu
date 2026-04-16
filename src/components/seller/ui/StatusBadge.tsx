import React from 'react';

type BadgeStatus = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusBadgeProps {
  status: BadgeStatus;
  children: React.ReactNode;
}

const statusConfig: Record<BadgeStatus, string> = {
  success: 'bg-green-500/10 text-green-400 border border-green-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  error: 'bg-red-500/10 text-red-400 border border-red-500/20',
  info: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
  neutral: 'bg-white/5 text-white/60 border border-white/10',
};

export function StatusBadge({ status, children }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest whitespace-nowrap ${statusConfig[status]}`}>
      {children}
    </span>
  );
}
