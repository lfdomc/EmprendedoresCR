'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export function BackButton({ className, size = 'lg', variant = 'ghost' }: BackButtonProps) {
  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback to home page if no history
      window.location.href = '/';
    }
  };

  return (
    <Button 
      variant={variant}
      size={size}
      onClick={handleGoBack}
      className={`flex items-center gap-2 ${className || ''}`}
    >
      <ArrowLeft className="w-5 h-5" />
      Volver atrás
    </Button>
  );
}