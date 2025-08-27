// Polyfill crítico para self - DEBE ejecutarse antes de cualquier import
if (typeof window === 'undefined') {
  if (typeof self === 'undefined') {
    if (typeof global !== 'undefined') {
      (global as any).self = global;
    }
    if (typeof globalThis !== 'undefined') {
      (globalThis as any).self = globalThis;
    }
  }
}

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
  // Configuración de webpack para optimizaciones,
    ],
    // Optimizaciones de imágenes
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  // Habilitar compresión
  compress: true,
  // Configuración de Turbopack
  turbopack: {
    // Configuración básica para Turbopack
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
  // Optimizaciones experimentales
  experimental: {
    // Deshabilitar el prefetching automático para evitar errores de Fetch failed loading
    optimisticClientCache: false,
    // Deshabilitar optimizaciones de CSS temporalmente
    optimizeCss: false,
    // Deshabilitar lazy loading mejorado temporalmente
    scrollRestoration: false,
    // Deshabilitar optimización de importaciones temporalmente
    // optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
   },
  // Configurar rewrites para manejar errores de red
  async rewrites() {
    return {
      fallback: [
        // Estos rewrites ayudan a manejar errores de red
        {
          source: '/:path*',
          destination: '/:path*',
        },
      ],
    };
  },
  // Configurar headers para mejorar el control de caché
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=300',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
