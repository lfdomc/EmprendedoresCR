'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface ContainerSize {
  width: number;
  height: number;
}

export function useContainerSize(): {
  ref: React.RefObject<HTMLDivElement | null>;
  size: ContainerSize;
} {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<ContainerSize>({ width: 0, height: 0 });

  const updateSize = useCallback(() => {
    if (ref.current) {
      const { offsetWidth, offsetHeight } = ref.current;
      setSize({ width: offsetWidth, height: offsetHeight });
    }
  }, []);

  useEffect(() => {
    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateSize]);

  return { ref, size };
}

// Hook específico para grids virtualizadas
export function useVirtualizedGridSize({
  minItemWidth = 200,
  maxItemWidth = 300,
  itemHeight = 200,
  gap = 16,
  maxHeight = 600
}: {
  minItemWidth?: number;
  maxItemWidth?: number;
  itemHeight?: number;
  gap?: number;
  maxHeight?: number;
} = {}) {
  // Asegurar que maxHeight nunca sea Infinity o undefined
  const safeMaxHeight = (typeof maxHeight === 'number' && isFinite(maxHeight) && maxHeight > 0) ? maxHeight : 600;
  const { ref, size } = useContainerSize();

  const gridConfig = {
    itemWidth: Math.min(
      maxItemWidth,
      Math.max(minItemWidth, (size.width - gap * 3) / 4)
    ),
    itemHeight,
    containerWidth: size.width,
    containerHeight: Math.min(
      safeMaxHeight, 
      size.height > 0 ? size.height : safeMaxHeight
    ),
    gap
  };

  return {
    ref,
    size,
    gridConfig
  };
}