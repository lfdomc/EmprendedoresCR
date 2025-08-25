'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ReactNode, useMemo } from 'react';

// Importación dinámica para evitar problemas de SSR
const Grid = dynamic(
  () => import('react-window').then((mod) => mod.FixedSizeGrid),
  { ssr: false }
);

interface VirtualizedGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  itemWidth: number;
  itemHeight: number;
  containerHeight: number;
  containerWidth: number;
  gap?: number;
  className?: string;
}

export function VirtualizedGrid<T>({
  items,
  renderItem,
  itemWidth,
  itemHeight,
  containerHeight,
  containerWidth,
  gap = 16,
  className = ''
}: VirtualizedGridProps<T>) {
  const [isClient, setIsClient] = useState(false);

  // Asegurar que todos los valores sean finitos
  const safeContainerHeight = isFinite(containerHeight) && containerHeight > 0 ? containerHeight : 600;
  const safeItemHeight = isFinite(itemHeight) && itemHeight > 0 ? itemHeight : 200;
  const safeItemWidth = isFinite(itemWidth) && itemWidth > 0 ? itemWidth : 200;
  const safeContainerWidth = isFinite(containerWidth) && containerWidth > 0 ? containerWidth : 800;
  
  const columnCount = useMemo(() => {
    return Math.floor((safeContainerWidth + gap) / (safeItemWidth + gap));
  }, [safeContainerWidth, safeItemWidth, gap]);

  const rowCount = useMemo(() => {
    return Math.ceil(items.length / columnCount);
  }, [items.length, columnCount]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className={className} style={{ height: safeContainerHeight, width: safeContainerWidth }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Cargando...</div>
        </div>
      </div>
    );
  }

  const Cell = ({ columnIndex, rowIndex, style }: {
    columnIndex: number;
    rowIndex: number;
    style: React.CSSProperties;
  }) => {
    const index = rowIndex * columnCount + columnIndex;
    const item = items[index];

    if (!item) return null;

    return (
      <div
        style={{
          ...style,
          left: (style.left as number) + gap / 2,
          top: (style.top as number) + gap / 2,
          width: safeItemWidth,
          height: safeItemHeight,
        }}
      >
        {renderItem(item, index)}
      </div>
    );
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <Grid
        columnCount={columnCount}
        columnWidth={safeItemWidth + gap}
        height={safeContainerHeight}
        rowCount={rowCount}
        rowHeight={safeItemHeight + gap}
        width={safeContainerWidth}
      >
        {Cell}
      </Grid>
    </div>
  );
}

// Hook para calcular dimensiones responsivas
export function useResponsiveGrid({
  minItemWidth = 200,
  maxItemWidth = 300,
  itemHeight = 200,
  gap = 16,
  containerWidth
}: {
  minItemWidth?: number;
  maxItemWidth?: number;
  itemHeight?: number;
  gap?: number;
  containerWidth: number;
}) {
  const itemWidth = useMemo(() => {
    const availableWidth = containerWidth - gap;
    const maxColumns = Math.floor(availableWidth / (minItemWidth + gap));
    const actualItemWidth = Math.min(
      maxItemWidth,
      Math.max(minItemWidth, (availableWidth - (maxColumns - 1) * gap) / maxColumns)
    );
    return actualItemWidth;
  }, [containerWidth, minItemWidth, maxItemWidth, gap]);

  return {
    itemWidth,
    itemHeight,
    gap
  };
}