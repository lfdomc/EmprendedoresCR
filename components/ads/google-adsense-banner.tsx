'use client';

import { useEffect } from 'react';

interface GoogleAdsenseBannerProps {
  adSlot: string;
  className?: string;
}

export function GoogleAdsenseBanner({ adSlot, className = "" }: GoogleAdsenseBannerProps) {
  useEffect(() => {
    try {
      // Verificar si adsbygoogle ya está disponible
      if (typeof window !== 'undefined' && (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle) {
        (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle = (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || [];
        (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle.push({});
      }
    } catch (error) {
      console.error('Error loading AdSense ad:', error);
    }
  }, []);

  return (
    <div className={`w-full ${className}`}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4334054982108939"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}