import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Search } from 'lucide-react';
import { BackButton } from '@/components/ui/back-button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated 404 */}
        <div className="mb-8">
          <div className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 animate-pulse">
            404
          </div>
          <div className="text-2xl md:text-3xl font-semibold text-gray-700 mt-4">
            ¡Oops! Página no encontrada
          </div>
        </div>

        {/* Illustration */}
        <div className="mb-8">
          <div className="w-64 h-64 mx-auto relative">
            <svg
              viewBox="0 0 400 300"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background */}
              <rect width="400" height="300" fill="#f8fafc" rx="20" />
              
              {/* Mountains */}
              <polygon points="0,200 100,120 200,160 300,100 400,140 400,300 0,300" fill="#e2e8f0" />
              <polygon points="0,220 80,150 160,180 240,130 320,160 400,180 400,300 0,300" fill="#cbd5e1" />
              
              {/* Sun */}
              <circle cx="320" cy="80" r="30" fill="#fbbf24" />
              
              {/* Cloud */}
              <ellipse cx="120" cy="60" rx="25" ry="15" fill="white" />
              <ellipse cx="140" cy="60" rx="35" ry="20" fill="white" />
              <ellipse cx="160" cy="60" rx="25" ry="15" fill="white" />
              
              {/* Sad face */}
              <circle cx="200" cy="180" r="40" fill="#3b82f6" fillOpacity="0.1" stroke="#3b82f6" strokeWidth="2" />
              <circle cx="185" cy="170" r="3" fill="#3b82f6" />
              <circle cx="215" cy="170" r="3" fill="#3b82f6" />
              <path d="M 180 195 Q 200 185 220 195" stroke="#3b82f6" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>

        {/* Message */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-6">
            <p className="text-lg text-gray-600 mb-4">
              La página que buscas no existe o ha sido movida.
            </p>
            <p className="text-gray-500">
              No te preocupes, puedes encontrar lo que necesitas desde nuestra página principal.
            </p>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Ir al inicio
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <Link href="/businesses" className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Ver emprendimientos
            </Link>
          </Button>
          
          <BackButton />
        </div>

        {/* Footer message */}
        <div className="mt-12 text-sm text-gray-400">
          <p>¿Necesitas ayuda? Contáctanos en Costa Rica Emprende</p>
        </div>
      </div>
    </div>
  );
}

// Metadata for SEO
export const metadata = {
  title: '404 - Página no encontrada | Costa Rica Emprende',
  description: 'La página que buscas no existe. Descubre emprendimientos y servicios en Costa Rica Emprende.',
  robots: {
    index: false,
    follow: false,
  },
};