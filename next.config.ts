import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    // Deshabilitar el prefetching automático para evitar errores de Fetch failed loading
    optimisticClientCache: false,
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
