'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw, Home, Mail } from 'lucide-react';
import Link from 'next/link';

function AuthCodeErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    setError(errorParam);
  }, [searchParams]);

  const handleRetry = () => {
    router.push('/auth/login');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Error de Confirmación
          </CardTitle>
          <CardDescription className="text-gray-600">
            Hubo un problema al confirmar tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-medium text-red-800 mb-2">¿Qué pasó?</h3>
            <p className="text-sm text-red-700">
              {error 
                ? `Error: ${error}`
                : 'El enlace de confirmación puede haber expirado o ya fue utilizado.'}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              ¿Qué puedes hacer?
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Verifica que hayas usado el enlace más reciente</li>
              <li>• Solicita un nuevo correo de confirmación</li>
              <li>• Revisa tu carpeta de spam</li>
              <li>• Intenta registrarte nuevamente si es necesario</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleRetry} 
              className="w-full"
              variant="default"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Intentar Iniciar Sesión
            </Button>
            
            <Button 
              onClick={handleGoHome} 
              variant="outline" 
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Ir al Inicio
            </Button>

            <div className="text-center">
              <Link 
                href="/auth/register" 
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                ¿Necesitas registrarte nuevamente?
              </Link>
            </div>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-xs text-gray-500">
              Si el problema persiste, contacta al soporte técnico
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthCodeErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <AuthCodeErrorContent />
    </Suspense>
  );
}