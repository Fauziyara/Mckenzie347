"use client"
import { useState, useEffect, useRef } from "react";;

import { useMemo } from "react";

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CandleChartProps {
  candles: Candle[];
  height?: number;
}

export function CandleChart({ candles, height = 350 }: CandleChartProps) {
  const padding = { top: 8, right: 0, bottom: 16, left: 0 };
  const width = 1000;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const { maxPrice, minPrice, maxVolume, priceRange } = useMemo(() => {
    if (candles.length === 0) return { maxPrice: 0, minPrice: 0, maxVolume: 0, priceRange: 0 };
    const maxP = Math.max(...candles.map(c => c.high));
    const minP = Math.min(...candles.map(c => c.low));
    const maxV = Math.max(...candles.map(c => c.volume));
    return { maxPrice: maxP, minPrice: minP, maxVolume: maxV, priceRange: maxP - minP };
  }, [candles]);

  const candleW = candles.length > 0 ? Math.max(2, (chartW / candles.length) * 0.9) : 0;
  const step = candles.length > 0 ? chartW / candles.length : 0;

  const y = (price: number) => {
    if (priceRange === 0) return padding.top + chartH / 2;
    return padding.top + ((maxPrice - price) / priceRange) * chartH;
  };

  const x = (i: number) => padding.left + i * step + step / 2;

  const formatPrice = (p: number) => {
    if (p >= 1000) return p.toFixed(0);
    if (p >= 1) return p.toFixed(2);
    if (p >= 0.01) return p.toFixed(4);
    return p.toFixed(6);
  };

  const priceLines = useMemo(() => {
    if (priceRange === 0) return [];
    const lines = [];
    const step = priceRange / 4;
    for (let i = 0; i <= 4; i++) {
      const price = minPrice + step * i;
      lines.push(price);
    }
    return lines;
  }, [maxPrice, minPrice, priceRange]);

  if (candles.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        No data
      </div>
    );
  }

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="block w-full">
      {/* Grid lines */}
      {priceLines.map((price, i) => (
        <g key={i}>
          <line
            x1={padding.left}
            y1={y(price)}
            x2={width - padding.right}
            y2={y(price)}
            stroke="currentColor"
            strokeOpacity="0.1"
            strokeDasharray="4 4"
          />
          <text
            x={width - padding.right + 5}
            y={y(price) + 4}
            fill="currentColor"
            fillOpacity="0.5"
            fontSize="10"
            fontFamily="monospace"
          >
            {formatPrice(price)}
          </text>
        </g>
      ))}

      {/* Current price line */}
      {candles.length > 0 && (
        <line
          x1={padding.left}
          y1={y(candles[candles.length - 1].close)}
          x2={width - padding.right}
          y2={y(candles[candles.length - 1].close)}
          stroke="#ef4444"
          strokeDasharray="4 4"
          strokeOpacity="0.5"
        />
      )}

      {/* Candles */}
      {candles.map((candle, i) => {
        const isGreen = candle.close >= candle.open;
        const color = isGreen ? "#22c55e" : "#ef4444";
        
        return (
          <g key={i}>
            {/* Wick */}
            <line
              x1={x(i)}
              y1={y(candle.high)}
              x2={x(i)}
              y2={y(candle.low)}
              stroke={color}
              strokeWidth="1"
            />
            {/* Body */}
            <rect
              x={x(i) - candleW / 2}
              y={y(Math.max(candle.open, candle.close))}
              width={candleW}
              height={Math.max(1, Math.abs(y(candle.open) - y(candle.close)))}
              fill={color}
              fillOpacity={isGreen ? 0.8 : 0.8}
            />
            {/* Volume bar */}
            {maxVolume > 0 && (
              <rect
                x={x(i) - candleW / 2}
                y={height - padding.bottom - (candle.volume / maxVolume) * 20}
                width={candleW}
                height={(candle.volume / maxVolume) * 20}
                fill={color}
                fillOpacity="0.3"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
