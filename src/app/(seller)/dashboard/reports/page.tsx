'use client';

import { useState } from 'react';

/* ─── Types ─────────────────────────────────────────────── */
interface ReportRow { [key: string]: string | number }

interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  icon: string;
  period: string;
  lastUpdated: string;
  rows: number;
  size: string;
  metrics: { label: string; value: string; trend?: 'up' | 'down' | 'flat' }[];
  previewHeaders: string[];
  previewRows: ReportRow[];
  filename: string;
}

/* ─── Mock data ──────────────────────────────────────────── */
const REPORTS: Report[] = [
  {
    id: 'ventas-mensuales',
    title: 'Ventas Mensuales',
    description: 'Resumen de ingresos, pedidos y ticket promedio por mes.',
    category: 'Finanzas',
    categoryColor: '#3b9eff',
    icon: '📈',
    period: 'Ene – Abr 2026',
    lastUpdated: '13 Apr 2026',
    rows: 120,
    size: '48 KB',
    metrics: [
      { label: 'Ingresos totales', value: '$48,320', trend: 'up' },
      { label: 'Pedidos', value: '1,204', trend: 'up' },
      { label: 'Ticket promedio', value: '$40.13', trend: 'flat' },
      { label: 'Cancelaciones', value: '2.4 %', trend: 'down' },
    ],
    previewHeaders: ['Mes', 'Pedidos', 'Ingresos', 'Ticket Prom.', 'Cancelac.'],
    previewRows: [
      { Mes: 'Enero',  Pedidos: 280, Ingresos: '$10,920', 'Ticket Prom.': '$39.00', 'Cancelac.': '3.1 %' },
      { Mes: 'Febrero',Pedidos: 305, Ingresos: '$12,440', 'Ticket Prom.': '$40.79', 'Cancelac.': '2.6 %' },
      { Mes: 'Marzo',  Pedidos: 310, Ingresos: '$12,540', 'Ticket Prom.': '$40.45', 'Cancelac.': '2.1 %' },
      { Mes: 'Abril',  Pedidos: 309, Ingresos: '$12,420', 'Ticket Prom.': '$40.19', 'Cancelac.': '1.8 %' },
    ],
    filename: 'ventas_mensuales_2026.csv',
  },
  {
    id: 'productos-top',
    title: 'Productos más vendidos',
    description: 'Ranking de productos por unidades y porcentaje de participación.',
    category: 'Inventario',
    categoryColor: '#34d399',
    icon: '🏆',
    period: 'Q1 2026',
    lastUpdated: '10 Apr 2026',
    rows: 45,
    size: '22 KB',
    metrics: [
      { label: 'SKUs activos', value: '45', trend: 'up' },
      { label: 'Unidades totales', value: '3,812', trend: 'up' },
      { label: '% top 5 ventas', value: '68 %', trend: 'flat' },
      { label: 'Sin stock', value: '3', trend: 'down' },
    ],
    previewHeaders: ['Producto', 'Unidades', 'Ingresos', 'Part. %'],
    previewRows: [
      { Producto: 'Hamburguesa Clásica', Unidades: 940,  Ingresos: '$13,160', 'Part. %': '24.7 %' },
      { Producto: 'Pizza Margherita',    Unidades: 715,  Ingresos: '$11,440', 'Part. %': '18.8 %' },
      { Producto: 'Alitas BBQ x10',      Unidades: 520,  Ingresos: '$8,320',  'Part. %': '13.6 %' },
      { Producto: 'Limonada Natural',    Unidades: 1200, Ingresos: '$4,800',  'Part. %': '31.5 %' },
    ],
    filename: 'productos_top_q1_2026.csv',
  },
  {
    id: 'clientes-frecuentes',
    title: 'Clientes Frecuentes',
    description: 'Análisis de retención, frecuencia de compra y LTV estimado.',
    category: 'CRM',
    categoryColor: '#a855f7',
    icon: '👥',
    period: 'Últimos 90 días',
    lastUpdated: '12 Apr 2026',
    rows: 88,
    size: '31 KB',
    metrics: [
      { label: 'Clientes únicos', value: '88', trend: 'up' },
      { label: 'Pedidos/cliente', value: '3.2×', trend: 'up' },
      { label: 'LTV promedio', value: '$128', trend: 'up' },
      { label: 'Tasa retención', value: '71 %', trend: 'flat' },
    ],
    previewHeaders: ['Cliente', 'Pedidos', 'LTV', 'Último pedido'],
    previewRows: [
      { Cliente: 'María G.',    Pedidos: 12, LTV: '$482', 'Último pedido': '11 Apr' },
      { Cliente: 'Carlos R.',   Pedidos: 9,  LTV: '$360', 'Último pedido': '09 Apr' },
      { Cliente: 'Ana T.',      Pedidos: 8,  LTV: '$314', 'Último pedido': '12 Apr' },
      { Cliente: 'Pedro M.',    Pedidos: 7,  LTV: '$280', 'Último pedido': '08 Apr' },
    ],
    filename: 'clientes_frecuentes_90d.csv',
  },
  {
    id: 'operaciones-diarias',
    title: 'Operaciones Diarias',
    description: 'Log diario de pedidos, tiempos de preparación y estados de entrega.',
    category: 'Operaciones',
    categoryColor: '#fbbf24',
    icon: '⚙️',
    period: 'Semana actual',
    lastUpdated: '13 Apr 2026',
    rows: 214,
    size: '76 KB',
    metrics: [
      { label: 'Pedidos hoy', value: '47', trend: 'up' },
      { label: 'Tiempo prep. prom.', value: '14 min', trend: 'down' },
      { label: 'Entregas a tiempo', value: '92 %', trend: 'up' },
      { label: 'Incidencias', value: '2', trend: 'down' },
    ],
    previewHeaders: ['Fecha', 'Pedidos', 'Prep. prom.', 'En tiempo %', 'Incid.'],
    previewRows: [
      { Fecha: 'Lun 07',  Pedidos: 41, 'Prep. prom.': '15 min', 'En tiempo %': '90 %', 'Incid.': 1 },
      { Fecha: 'Mar 08',  Pedidos: 38, 'Prep. prom.': '13 min', 'En tiempo %': '95 %', 'Incid.': 0 },
      { Fecha: 'Mié 09',  Pedidos: 44, 'Prep. prom.': '14 min', 'En tiempo %': '91 %', 'Incid.': 1 },
      { Fecha: 'Jue 10',  Pedidos: 47, 'Prep. prom.': '14 min', 'En tiempo %': '92 %', 'Incid.': 0 },
    ],
    filename: 'operaciones_semana_abr2026.csv',
  },
  {
    id: 'pagos-metodos',
    title: 'Métodos de Pago',
    description: 'Distribución de transacciones por método de pago y tasa de rechazo.',
    category: 'Finanzas',
    categoryColor: '#3b9eff',
    icon: '💳',
    period: 'Mar 2026',
    lastUpdated: '01 Apr 2026',
    rows: 6,
    size: '8 KB',
    metrics: [
      { label: 'Total procesado', value: '$12,540', trend: 'up' },
      { label: 'Tasa rechazo', value: '0.8 %', trend: 'down' },
      { label: 'Tx exitosas', value: '310', trend: 'up' },
      { label: 'Método líder', value: 'Tarjeta', trend: 'flat' },
    ],
    previewHeaders: ['Método', 'Tx', 'Monto', 'Part. %', 'Rechazos'],
    previewRows: [
      { Método: 'Tarjeta crédito', Tx: 140, Monto: '$7,420',  'Part. %': '59.2 %', Rechazos: 2 },
      { Método: 'Tarjeta débito',  Tx:  88, Monto: '$3,520',  'Part. %': '28.1 %', Rechazos: 0 },
      { Método: 'Efectivo',        Tx:  55, Monto: '$1,100',  'Part. %': '8.8 %',  Rechazos: 0 },
      { Método: 'Transferencia',   Tx:  27, Monto: '$500',    'Part. %': '4.0 %',  Rechazos: 1 },
    ],
    filename: 'metodos_pago_mar2026.csv',
  },
  {
    id: 'inventario-movimientos',
    title: 'Movimientos de Inventario',
    description: 'Entradas, salidas y ajustes de stock por producto y período.',
    category: 'Inventario',
    categoryColor: '#34d399',
    icon: '📦',
    period: 'Q1 2026',
    lastUpdated: '31 Mar 2026',
    rows: 312,
    size: '95 KB',
    metrics: [
      { label: 'Total movimientos', value: '312', trend: 'up' },
      { label: 'Entradas', value: '185', trend: 'flat' },
      { label: 'Salidas', value: '124', trend: 'up' },
      { label: 'Ajustes', value: '3', trend: 'down' },
    ],
    previewHeaders: ['Fecha', 'Producto', 'Tipo', 'Cantidad', 'Stock final'],
    previewRows: [
      { Fecha: '15 Mar', Producto: 'Pan de brioche', Tipo: 'Entrada',  Cantidad: 200, 'Stock final': 480 },
      { Fecha: '16 Mar', Producto: 'Pan de brioche', Tipo: 'Salida',   Cantidad:  47, 'Stock final': 433 },
      { Fecha: '18 Mar', Producto: 'Cheddar lonchas',Tipo: 'Entrada',  Cantidad: 150, 'Stock final': 210 },
      { Fecha: '20 Mar', Producto: 'Cheddar lonchas',Tipo: 'Ajuste',   Cantidad:  -5, 'Stock final': 205 },
    ],
    filename: 'inventario_movimientos_q1_2026.csv',
  },
];

/* ─── CSV generator (Excel-compatible) ──────────────────── */
function escapeCell(value: string | number): string {
  const str = String(value ?? '');
  // Escape internal double-quotes by doubling them, then wrap in quotes
  return `"${str.replace(/"/g, '""')}"`;
}

function downloadCSV(report: Report) {
  const SEP = ';'; // Excel on Spanish/Windows locales uses semicolons

  const header = report.previewHeaders.map(escapeCell).join(SEP);
  const body   = report.previewRows
    .map(row => report.previewHeaders.map(h => escapeCell(row[h])).join(SEP))
    .join('\r\n');

  // \uFEFF = UTF-8 BOM — tells Excel to use UTF-8 (fixes accented chars)
  const csv  = '\uFEFF' + header + '\r\n' + body;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = report.filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─── Trend icon ─────────────────────────────────────────── */
function TrendIcon({ trend }: { trend?: 'up' | 'down' | 'flat' }) {
  if (trend === 'up')   return <span className="ds-trend-up"   style={{ fontSize: '0.8rem' }}>▲</span>;
  if (trend === 'down') return <span className="ds-trend-down" style={{ fontSize: '0.8rem' }}>▼</span>;
  return <span className="ds-trend-flat" style={{ fontSize: '0.8rem' }}>—</span>;
}

/* ─── Report Card ────────────────────────────────────────── */
function ReportCard({ report, onView }: { report: Report; onView: (r: Report) => void }) {
  return (
    <div className="rpt-card">
      {/* top */}
      <div className="rpt-card-top">
        <div className="rpt-icon">{report.icon}</div>
        <span className="rpt-category" style={{ '--cat-color': report.categoryColor } as React.CSSProperties}>
          {report.category}
        </span>
      </div>

      {/* meta */}
      <div className="rpt-card-body">
        <h2 className="rpt-title">{report.title}</h2>
        <p className="rpt-desc">{report.description}</p>

        <div className="rpt-meta-row">
          <span className="rpt-meta-item">🗓 {report.period}</span>
          <span className="rpt-meta-item">📄 {report.rows} filas · {report.size}</span>
        </div>
      </div>

      {/* metrics strip */}
      <div className="rpt-metrics">
        {report.metrics.map(m => (
          <div key={m.label} className="rpt-metric">
            <span className="rpt-metric-label">{m.label}</span>
            <span className="rpt-metric-value">{m.value} <TrendIcon trend={m.trend} /></span>
          </div>
        ))}
      </div>

      {/* actions */}
      <div className="rpt-card-actions">
        <button
          className="ds-btn ds-btn-secondary rpt-btn-details"
          onClick={() => onView(report)}
          id={`report-view-${report.id}`}
        >
          Ver detalles
        </button>
        <button
          className="ds-btn ds-btn-primary rpt-btn-dl"
          onClick={() => downloadCSV(report)}
          id={`report-download-${report.id}`}
        >
          ↓ Descargar CSV
        </button>
      </div>
    </div>
  );
}

/* ─── Detail Modal ───────────────────────────────────────── */
function DetailModal({ report, onClose }: { report: Report; onClose: () => void }) {
  return (
    <div className="rpt-modal-overlay" onClick={onClose} id="report-modal-overlay">
      <div
        className="rpt-modal"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rpt-modal-title"
      >
        {/* header */}
        <div className="rpt-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{report.icon}</span>
            <div>
              <span
                className="rpt-category"
                style={{ '--cat-color': report.categoryColor } as React.CSSProperties}
              >
                {report.category}
              </span>
              <h2 id="rpt-modal-title" className="rpt-modal-title">{report.title}</h2>
            </div>
          </div>
          <button
            className="rpt-modal-close"
            onClick={onClose}
            id="report-modal-close"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* description */}
        <p className="rpt-modal-desc">{report.description}</p>

        {/* KPI row */}
        <div className="rpt-modal-metrics">
          {report.metrics.map(m => (
            <div key={m.label} className="ds-metric-tile">
              <span className="ds-metric-label">{m.label}</span>
              <span className="ds-metric-value" style={{ fontSize: '1.3rem' }}>{m.value}</span>
              <TrendIcon trend={m.trend} />
            </div>
          ))}
        </div>

        {/* preview table */}
        <div className="rpt-modal-section">
          <div className="rpt-modal-section-head">
            <span>Vista previa de datos</span>
            <span className="section-badge section-badge-accent">4 de {report.rows} filas</span>
          </div>
          <div className="rpt-table-wrap">
            <table className="rpt-table">
              <thead>
                <tr>
                  {report.previewHeaders.map(h => <th key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {report.previewRows.map((row, i) => (
                  <tr key={i}>
                    {report.previewHeaders.map(h => <td key={h}>{row[h]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* footer */}
        <div className="rpt-modal-footer">
          <span className="rpt-meta-item" style={{ fontSize: '0.82rem' }}>
            Actualizado: {report.lastUpdated} · {report.rows} filas · {report.size}
          </span>
          <button
            className="ds-btn ds-btn-primary"
            onClick={() => downloadCSV(report)}
            id={`report-modal-download-${report.id}`}
          >
            ↓ Descargar CSV completo
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function ReportsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [selected, setSelected] = useState<Report | null>(null);

  const categories = ['Todos', ...Array.from(new Set(REPORTS.map(r => r.category)))];

  const filtered = activeCategory === 'Todos'
    ? REPORTS
    : REPORTS.filter(r => r.category === activeCategory);

  return (
    <>
      <div className="page-shell">
        {/* ── Header ── */}
        <div className="page-header">
          <div className="page-header-left">
            <span className="page-kicker">Centro de Datos</span>
            <h1 className="page-title">Reportes</h1>
            <p className="page-subtitle">
              Análisis exportables de ventas, inventario, clientes y operaciones.
            </p>
          </div>
          <div className="page-header-badge">
            <span className="page-header-badge-dot" />
            {REPORTS.length} reportes disponibles
          </div>
        </div>

        {/* ── Category filter ── */}
        <div className="rpt-filter-bar">
          {categories.map(cat => (
            <button
              key={cat}
              id={`filter-${cat.toLowerCase()}`}
              className={`rpt-filter-btn ${activeCategory === cat ? 'rpt-filter-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Grid ── */}
        <div className="rpt-grid">
          {filtered.map(r => (
            <ReportCard key={r.id} report={r} onView={setSelected} />
          ))}
        </div>
      </div>

      {/* ── Modal ── */}
      {selected && (
        <DetailModal report={selected} onClose={() => setSelected(null)} />
      )}

      {/* ── Scoped styles ── */}
      <style>{`
        /* ── Filter Bar ── */
        .rpt-filter-bar {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .rpt-filter-btn {
          padding: 0.45rem 1rem;
          border-radius: 999px;
          border: 1px solid var(--ds-border-main);
          background: transparent;
          color: var(--ds-text-secondary);
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.16s, border-color 0.16s, color 0.16s;
        }
        .rpt-filter-btn:hover {
          background: rgba(255,255,255,0.05);
          color: var(--ds-text-primary);
        }
        .rpt-filter-btn--active {
          background: var(--ds-accent-soft);
          border-color: rgba(59,158,255,0.35);
          color: var(--ds-accent);
        }

        /* ── Report Grid ── */
        .rpt-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 1100px) { .rpt-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 680px)  { .rpt-grid { grid-template-columns: 1fr; } }

        /* ── Report Card ── */
        .rpt-card {
          display: flex;
          flex-direction: column;
          background: var(--ds-bg-surface);
          border: 1px solid var(--ds-border-soft);
          border-radius: var(--ds-radius-card);
          overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
          box-shadow: var(--ds-shadow-card);
        }
        .rpt-card:hover {
          border-color: var(--ds-border-main);
          box-shadow: 0 8px 32px rgba(0,0,0,0.42), 0 0 0 1px rgba(59,158,255,0.06);
          transform: translateY(-3px);
        }

        .rpt-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem 0;
        }

        .rpt-icon {
          font-size: 1.8rem;
          line-height: 1;
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));
        }

        .rpt-category {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.22rem 0.7rem;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: color-mix(in srgb, var(--cat-color) 12%, transparent);
          border: 1px solid color-mix(in srgb, var(--cat-color) 30%, transparent);
          color: var(--cat-color);
        }

        .rpt-card-body {
          padding: 1rem 1.5rem 0.75rem;
          flex: 1;
        }

        .rpt-title {
          margin: 0 0 0.4rem;
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--ds-text-primary);
        }

        .rpt-desc {
          margin: 0 0 0.75rem;
          font-size: 0.86rem;
          line-height: 1.55;
          color: var(--ds-text-secondary);
        }

        .rpt-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem 1rem;
        }

        .rpt-meta-item {
          font-size: 0.78rem;
          color: var(--ds-text-muted);
        }

        /* ── Metrics strip inside card ── */
        .rpt-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          border-top: 1px solid var(--ds-border-soft);
          border-bottom: 1px solid var(--ds-border-soft);
          background: var(--ds-border-soft);
          margin-top: 1rem;
        }

        .rpt-metric {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          padding: 0.7rem 1rem;
          background: var(--ds-bg-elevated);
        }

        .rpt-metric-label {
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--ds-text-muted);
        }

        .rpt-metric-value {
          font-size: 0.96rem;
          font-weight: 800;
          color: var(--ds-text-primary);
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        /* ── Card Actions ── */
        .rpt-card-actions {
          display: flex;
          gap: 0.6rem;
          padding: 1rem 1.5rem;
        }

        .rpt-btn-details { flex: 1; }
        .rpt-btn-dl      { flex: 1.4; }

        /* ── Modal overlay ── */
        .rpt-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(0, 0, 0, 0.72);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          animation: modal-fade 0.2s ease;
        }

        @keyframes modal-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .rpt-modal {
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          background: var(--ds-bg-surface);
          border: 1px solid var(--ds-border-main);
          border-radius: var(--ds-radius-card);
          box-shadow: 0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06);
          animation: modal-slide 0.25s cubic-bezier(0.32, 0.72, 0, 1);
        }

        @keyframes modal-slide {
          from { transform: translateY(20px) scale(0.98); opacity: 0; }
          to   { transform: translateY(0)    scale(1);    opacity: 1; }
        }

        .rpt-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          padding: 1.5rem 1.75rem 1rem;
          border-bottom: 1px solid var(--ds-border-soft);
          position: sticky;
          top: 0;
          background: var(--ds-bg-surface);
          z-index: 1;
        }

        .rpt-modal-title {
          margin: 0.2rem 0 0;
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--ds-text-primary);
        }

        .rpt-modal-close {
          background: rgba(255,255,255,0.06);
          border: 1px solid var(--ds-border-soft);
          border-radius: 999px;
          color: var(--ds-text-secondary);
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.8rem;
          flex-shrink: 0;
          transition: background 0.15s, color 0.15s;
        }
        .rpt-modal-close:hover {
          background: rgba(255,255,255,0.1);
          color: var(--ds-text-primary);
        }

        .rpt-modal-desc {
          padding: 1rem 1.75rem 0;
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--ds-text-secondary);
        }

        .rpt-modal-metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          padding: 1.25rem 1.75rem;
        }
        @media (max-width: 680px) { .rpt-modal-metrics { grid-template-columns: 1fr 1fr; } }

        .rpt-modal-section {
          margin: 0 1.75rem 1.5rem;
          border: 1px solid var(--ds-border-soft);
          border-radius: var(--ds-radius-box);
          overflow: hidden;
        }

        .rpt-modal-section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          background: var(--ds-bg-elevated);
          border-bottom: 1px solid var(--ds-border-soft);
          font-size: 0.84rem;
          font-weight: 700;
          color: var(--ds-text-secondary);
        }

        /* ── Table ── */
        .rpt-table-wrap {
          overflow-x: auto;
        }

        .rpt-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.86rem;
        }

        .rpt-table th {
          padding: 0.65rem 1rem;
          background: var(--ds-bg-input);
          color: var(--ds-text-muted);
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-align: left;
          white-space: nowrap;
          border-bottom: 1px solid var(--ds-border-soft);
        }

        .rpt-table td {
          padding: 0.7rem 1rem;
          color: var(--ds-text-primary);
          border-bottom: 1px solid var(--ds-border-soft);
          white-space: nowrap;
        }

        .rpt-table tr:last-child td { border-bottom: none; }
        .rpt-table tbody tr:hover td { background: rgba(255,255,255,0.02); }

        /* ── Modal Footer ── */
        .rpt-modal-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1rem 1.75rem 1.5rem;
          border-top: 1px solid var(--ds-border-soft);
          flex-wrap: wrap;
        }
      `}</style>
    </>
  );
}
