'use client';

import { useEffect, useRef, useState } from 'react';

interface SideBannerProps {
  adSlot: string;
  className?: string;
}

export default function SideBanner({ adSlot, className = '' }: SideBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current || adLoaded) return;

    const checkAndLoadAd = () => {
      if (!containerRef.current || adLoaded) return false;
      
      const rect = containerRef.current.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(containerRef.current);
      
      // Verificar múltiples condiciones para asegurar que el elemento tenga dimensiones válidas
      const hasValidDimensions = 
        rect.width > 0 && 
        rect.height > 0 && 
        containerRef.current.offsetWidth > 0 && 
        containerRef.current.offsetHeight > 0 &&
        computedStyle.display !== 'none' &&
        computedStyle.visibility !== 'hidden';
      
      if (hasValidDimensions) {
        try {
          (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle = 
            (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || [];
          (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle.push({});
          setAdLoaded(true);
          return true;
        } catch (error) {
          console.error('Error loading AdSense ad:', error);
          return false;
        }
      }
      return false;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Intentar cargar inmediatamente
            if (checkAndLoadAd()) {
              observer.disconnect();
              return;
            }
            
            // Si no se pudo cargar, intentar después de un delay
            setTimeout(() => {
              if (checkAndLoadAd()) {
                observer.disconnect();
                return;
              }
              
              // Último intento después de más tiempo
              setTimeout(() => {
                if (checkAndLoadAd()) {
                  observer.disconnect();
                }
              }, 1000);
            }, 500);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [mounted, adLoaded]);

  if (!mounted) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={`hidden lg:block ${className}`} 
      style={{ 
        width: '160px', 
        minHeight: '600px',
        minWidth: '160px'
      }}
    >
      <div 
        ref={adRef} 
        style={{ 
          width: '160px', 
          height: '600px',
          minWidth: '160px',
          minHeight: '600px'
        }}
      >
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            width: '160px',
            height: '600px',
            minWidth: '160px',
            minHeight: '600px'
          }}
          data-ad-client="ca-pub-4334054982108939"
          data-ad-slot={adSlot}
          data-ad-format="rectangle"
          data-full-width-responsive="false"
        />
      </div>
    </div>
  );
}