"use client";

import { salesChartData } from '@/lib/dashboard-mock-data';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function SalesOverviewCard() {
  return (
    <div className="section-box flex flex-col" style={{ minHeight: '340px' }}>
      <div className="section-head">
        <div>
          <h2>Tendencia de Ventas</h2>
          <p>Volumen acumulado del período actual</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1.5 rounded-lg text-xs font-600 transition-colors"
            style={{
              background: 'var(--ds-accent-soft)',
              color: 'var(--ds-accent)',
              border: '1px solid rgba(59,158,255,0.20)',
              fontWeight: 600,
            }}
          >
            Venta
          </button>
          <button
            className="px-3 py-1.5 rounded-lg text-xs font-600 transition-colors"
            style={{
              background: 'transparent',
              color: 'var(--ds-text-muted)',
              border: '1px solid var(--ds-border-soft)',
              fontWeight: 600,
            }}
          >
            Ticket
          </button>
        </div>
      </div>

      <div className="flex-1" style={{ height: '260px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesChartData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3b9eff" stopOpacity={0.20} />
                <stop offset="95%" stopColor="#3b9eff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="rgba(255,255,255,0.15)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={8}
            />
            <YAxis
              stroke="rgba(255,255,255,0.15)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#161c28',
                borderColor: 'rgba(255,255,255,0.10)',
                borderRadius: '10px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.40)',
                fontSize: '12px',
              }}
              itemStyle={{ color: '#3b9eff', fontWeight: 700 }}
              labelStyle={{ color: 'rgba(200,210,230,0.60)', marginBottom: '4px' }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#3b9eff"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#salesGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
