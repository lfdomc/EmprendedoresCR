'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Package, Wrench } from 'lucide-react';
import { Business } from '@/lib/types/database';

interface BusinessReminderBannerProps {
  business: Business;
  hasProducts: boolean;
  hasServices: boolean;
  onDismiss?: () => void;
}

export function BusinessReminderBanner({ 
  business, 
  hasProducts, 
  hasServices, 
  onDismiss 
}: BusinessReminderBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  // No mostrar si ya tiene productos o servicios
  if (hasProducts || hasServices) {
    return null;
  }

  // No mostrar si fue descartado
  if (isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };



  return (
    <Alert className="border-orange-200 bg-orange-50 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold text-orange-800">
              ¡Completa tu emprendimiento!
            </h3>
          </div>
          <AlertDescription className="text-orange-700 mb-4">
            Tu emprendimiento &quot;{business.name}&quot; está creado, pero aún necesita:
            <ul className="list-disc list-inside mt-2 space-y-1">
              {!hasProducts && (
                <li className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Productos para vender
                </li>
              )}
              {!hasServices && (
                <li className="flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Servicios que ofreces
                </li>
              )}
            </ul>
          </AlertDescription>
          

        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="text-orange-600 hover:text-orange-800 hover:bg-orange-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
}