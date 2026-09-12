'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  Sparkles,
  BarChart2,
  Calendar,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

export interface ChartPoint {
  label: string;
  sales: number;
  orders: number;
}

interface RevenueLineChartProps {
  data: ChartPoint[];
  timeFilter: string;
}

type ViewMode = 'all' | 'revenue' | 'orders';

export default function RevenueLineChart({ data, timeFilter }: RevenueLineChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('all');

  if (!data || data.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-stone-400 font-semibold italic bg-stone-50 rounded-2xl border border-stone-200/80">
        No sales or order data available for this timeframe.
      </div>
    );
  }

  // Calculate high-level summary metrics
  const totalSales = useMemo(() => data.reduce((sum, d) => sum + d.sales, 0), [data]);
  const totalOrders = useMemo(() => data.reduce((sum, d) => sum + d.orders, 0), [data]);
  const maxSalesPoint = useMemo(() => {
    let max = data[0];
    for (const d of data) {
      if (d.sales > max.sales) max = d;
    }
    return max;
  }, [data]);

  const maxSales = Math.max(...data.map((d) => d.sales), 100);
  const maxOrders = Math.max(...data.map((d) => d.orders), 5);

  // SVG Canvas Dimensions for a high-level executive feel
  const svgWidth = 800;
  const svgHeight = 250;
  const paddingTop = 25;
  const paddingBottom = 40;
  const paddingLeft = 55;
  const paddingRight = 25;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Compute Coordinates for Sales (Revenue line)
  const salesPoints = data.map((d, idx) => {
    const x = paddingLeft + (idx / Math.max(data.length - 1, 1)) * chartWidth;
    const y = svgHeight - paddingBottom - (d.sales / (maxSales || 1)) * chartHeight;
    return { x, y, sales: d.sales, orders: d.orders, label: d.label };
  });

  // Compute Coordinates for Orders line
  const ordersPoints = data.map((d, idx) => {
    const x = paddingLeft + (idx / Math.max(data.length - 1, 1)) * chartWidth;
    const y = svgHeight - paddingBottom - (d.orders / (maxOrders || 1)) * chartHeight;
    return { x, y, sales: d.sales, orders: d.orders, label: d.label };
  });

  // Smooth Catmull-Rom / Bezier Curve Generator
  const generateSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? i : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
    }

    return d;
  };

  const salesLinePath = generateSmoothPath(salesPoints);
  const salesAreaPath =
    salesPoints.length > 0
      ? `${salesLinePath} L ${salesPoints[salesPoints.length - 1].x.toFixed(2)} ${svgHeight - paddingBottom} L ${salesPoints[0].x.toFixed(2)} ${svgHeight - paddingBottom} Z`
      : '';

  const ordersLinePath = generateSmoothPath(ordersPoints);
  const ordersAreaPath =
    ordersPoints.length > 0
      ? `${ordersLinePath} L ${ordersPoints[ordersPoints.length - 1].x.toFixed(2)} ${svgHeight - paddingBottom} L ${ordersPoints[0].x.toFixed(2)} ${svgHeight - paddingBottom} Z`
      : '';

  // Y-Axis Grid Ticks (5 levels for rich detail)
  const yGridTicks = [0, 0.25, 0.5, 0.75, 1].map((pct) => {
    const val = Math.round(maxSales * pct);
    const y = svgHeight - paddingBottom - pct * chartHeight;
    return { val, y, pct };
  });

  const activePoint = hoveredIdx !== null ? salesPoints[hoveredIdx] : salesPoints[salesPoints.length - 1];

  return (
    <div className="space-y-4">
      {/* High-Level Executive Stats Header Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-50/90 p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs">
        {/* Metric 1: Revenue */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-stone-200/60 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-[#166534] flex items-center justify-center shrink-0">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase text-stone-400 tracking-wider">Total Period Sales</p>
            <p className="text-lg font-extrabold text-stone-900 flex items-baseline gap-0.5">
              <span>₹</span>
              <span>{totalSales.toLocaleString('en-IN')}</span>
            </p>
          </div>
        </div>

        {/* Metric 2: Orders */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-stone-200/60 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase text-stone-400 tracking-wider">Total Store Orders</p>
            <p className="text-lg font-extrabold text-stone-900">
              {totalOrders} <span className="text-xs font-semibold text-stone-500">jars</span>
            </p>
          </div>
        </div>

        {/* Metric 3: Peak Revenue Callout */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-stone-200/60 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-purple-100/70 text-purple-800 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase text-stone-400 tracking-wider">Peak Sales Performance</p>
            <p className="text-xs font-bold text-stone-800 truncate">
              {maxSalesPoint.label}: <span className="text-[#166534] font-extrabold">₹{maxSalesPoint.sales.toLocaleString('en-IN')}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Chart Interactive Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-stone-400" />
            Chart View:
          </span>
          <div className="bg-stone-100 p-0.5 rounded-xl border border-stone-200 flex items-center gap-1 text-[11px] font-bold">
            <button
              onClick={() => setViewMode('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                viewMode === 'all'
                  ? 'bg-stone-900 text-white shadow-2xs font-extrabold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Metrics
            </button>
            <button
              onClick={() => setViewMode('revenue')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                viewMode === 'revenue'
                  ? 'bg-[#166534] text-white shadow-2xs font-extrabold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Revenue (₹)
            </button>
            <button
              onClick={() => setViewMode('orders')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                viewMode === 'orders'
                  ? 'bg-amber-600 text-white shadow-2xs font-extrabold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Orders Volume
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-bold text-stone-600">
          {(viewMode === 'all' || viewMode === 'revenue') && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#166534] shadow-2xs" />
              <span>Revenue (₹)</span>
            </div>
          )}
          {(viewMode === 'all' || viewMode === 'orders') && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 shadow-2xs" />
              <span>Orders Count</span>
            </div>
          )}
        </div>
      </div>

      {/* Luxury Canvas Line & Area Chart Container */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-white border border-stone-200/90 shadow-xs p-4 sm:p-5">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            {/* Revenue Gradient Fill */}
            <linearGradient id="luxuryRevenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#166534" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#22c55e" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#166534" stopOpacity="0.0" />
            </linearGradient>

            {/* Orders Gradient Fill */}
            <linearGradient id="luxuryOrdersGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#166534" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Grid Background Lines & Y-Axis Labels */}
          {yGridTicks.map((tick, idx) => (
            <g key={idx}>
              <line
                x1={paddingLeft}
                y1={tick.y}
                x2={svgWidth - paddingRight}
                y2={tick.y}
                stroke="#e7e5e4"
                strokeWidth="1"
                strokeDasharray={tick.pct === 0 || tick.pct === 1 ? 'none' : '3 3'}
              />
              <text
                x={paddingLeft - 8}
                y={tick.y + 4}
                fill="#a8a29e"
                fontSize="10"
                fontWeight="700"
                textAnchor="end"
              >
                ₹{tick.val >= 1000 ? `${(tick.val / 1000).toFixed(1)}k` : tick.val}
              </text>
            </g>
          ))}

          {/* Render Orders Area & Line (if active) */}
          {(viewMode === 'all' || viewMode === 'orders') && (
            <>
              <path d={ordersAreaPath} fill="url(#luxuryOrdersGrad)" />
              <path
                d={ordersLinePath}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeDasharray="4 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}

          {/* Render Revenue Area & Line (if active) */}
          {(viewMode === 'all' || viewMode === 'revenue') && (
            <>
              <path d={salesAreaPath} fill="url(#luxuryRevenueGrad)" />
              <path
                d={salesLinePath}
                fill="none"
                stroke="#166534"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glowEffect)"
              />
            </>
          )}

          {/* Vertical Hover Guideline */}
          {hoveredIdx !== null && (
            <g>
              <line
                x1={salesPoints[hoveredIdx].x}
                y1={paddingTop}
                x2={salesPoints[hoveredIdx].x}
                y2={svgHeight - paddingBottom}
                stroke="#166534"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.7"
              />
              {/* Top highlight bar */}
              <circle
                cx={salesPoints[hoveredIdx].x}
                cy={paddingTop}
                r="3"
                fill="#166534"
              />
            </g>
          )}

          {/* Data Points & Interactive Circles */}
          {salesPoints.map((pt, idx) => {
            const isHovered = hoveredIdx === idx;
            const isPeak = pt.sales === maxSalesPoint.sales && maxSalesPoint.sales > 0;

            return (
              <g
                key={idx}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Orders Point Circle */}
                {(viewMode === 'all' || viewMode === 'orders') && (
                  <circle
                    cx={ordersPoints[idx].x}
                    cy={ordersPoints[idx].y}
                    r={isHovered ? '5' : '3'}
                    fill="#FFFFFF"
                    stroke="#f59e0b"
                    strokeWidth={isHovered ? '3' : '2'}
                    className="transition-all duration-150"
                  />
                )}

                {/* Revenue Point Circle */}
                {(viewMode === 'all' || viewMode === 'revenue') && (
                  <g>
                    {isPeak && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="10"
                        fill="#166534"
                        opacity="0.2"
                        className="animate-ping"
                      />
                    )}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered || isPeak ? '6' : '4'}
                      fill="#FFFFFF"
                      stroke="#166534"
                      strokeWidth={isHovered || isPeak ? '3.5' : '2.5'}
                      className="transition-all duration-150"
                    />
                  </g>
                )}

                {/* X-Axis Label */}
                <text
                  x={pt.x}
                  y={svgHeight - paddingBottom + 20}
                  fill={isHovered ? '#166534' : '#78716c'}
                  fontSize="10.5"
                  fontWeight={isHovered ? '800' : '600'}
                  textAnchor="middle"
                >
                  {pt.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Glassmorphic Interactive Floating Tooltip */}
        {hoveredIdx !== null && salesPoints[hoveredIdx] && (
          <div
            className="absolute top-4 pointer-events-none bg-stone-950/95 text-white text-xs p-3 rounded-2xl shadow-xl border border-stone-700/80 z-20 font-sans backdrop-blur-md transition-all duration-150 space-y-1"
            style={{
              left: `${Math.min(
                Math.max((salesPoints[hoveredIdx].x / svgWidth) * 100, 15),
                85
              )}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-1 gap-4">
              <span className="font-extrabold text-amber-400">{salesPoints[hoveredIdx].label}</span>
              <span className="text-[10px] text-stone-400 uppercase font-semibold">Period Data</span>
            </div>
            <div className="space-y-0.5 pt-0.5">
              <p className="flex justify-between items-center gap-3 text-stone-200">
                <span>Revenue:</span>
                <strong className="text-emerald-400 font-extrabold">₹{salesPoints[hoveredIdx].sales.toLocaleString('en-IN')}</strong>
              </p>
              <p className="flex justify-between items-center gap-3 text-stone-300 text-[11px]">
                <span>Orders:</span>
                <strong className="text-amber-300 font-bold">{salesPoints[hoveredIdx].orders} jars</strong>
              </p>
              {salesPoints[hoveredIdx].orders > 0 && (
                <p className="flex justify-between items-center gap-3 text-stone-400 text-[10px] border-t border-stone-800/80 pt-1 mt-1">
                  <span>Avg Value:</span>
                  <span className="font-semibold text-white">₹{Math.round(salesPoints[hoveredIdx].sales / salesPoints[hoveredIdx].orders)} / order</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
