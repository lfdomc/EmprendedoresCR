'use client';

import { useEffect, useRef, useState } from 'react';

interface SideBannerProps {
  adSlot: string;
  className?: string;
}

export default function SideBanner({ adSlot, className = '' }: SideBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && adRef.current && !adLoaded) {
      let retryCount = 0;
      const maxRetries = 5;
      let timeoutId: NodeJS.Timeout;

      const checkAndLoadAd = () => {
        const container = adRef.current;
        if (!container || adLoaded) return;
        
        // Esperar a que el DOM esté completamente renderizado
        requestAnimationFrame(() => {
          const rect = container.getBoundingClientRect();
          const computedStyle = window.getComputedStyle(container);
          const parentRect = container.parentElement?.getBoundingClientRect();
          
          // Verificaciones más estrictas para side banner (160x100)
          const hasValidDimensions = rect.width >= 160 && rect.height >= 100;
          const hasValidParent = parentRect && parentRect.width >= 160 && parentRect.height >= 100;
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
          const isDisplayed = computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden';
          
          console.log('SideBanner AdSense validation:', {
            width: rect.width,
            height: rect.height,
            parentWidth: parentRect?.width,
            parentHeight: parentRect?.height,
            isVisible,
            isDisplayed,
            retryCount
          });
          
          if (hasValidDimensions && hasValidParent && isVisible && isDisplayed) {
            // Esperar un poco más para asegurar que el layout esté estable
            timeoutId = setTimeout(() => {
              try {
                if (typeof window !== 'undefined' && !adLoaded) {
                  const adsbygoogle = (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle;
                  if (adsbygoogle) {
                    adsbygoogle.push({});
                    setAdLoaded(true);
                    console.log('SideBanner AdSense ad loaded successfully');
                  }
                }
              } catch (error) {
                console.error('Error loading SideBanner AdSense ad:', error);
                setAdLoaded(true); // Evitar reintentos infinitos
              }
            }, 2000);
          } else if (retryCount < maxRetries) {
            retryCount++;
            timeoutId = setTimeout(() => {
              checkAndLoadAd();
            }, 1500);
          } else {
            console.warn('SideBanner AdSense: Max retries reached, stopping attempts');
            setAdLoaded(true); // Evitar reintentos infinitos
          }
        });
      };
      
      // Usar IntersectionObserver para detectar cuando el elemento es visible
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !adLoaded) {
              // Esperar un poco después de que sea visible
              timeoutId = setTimeout(() => {
                checkAndLoadAd();
              }, 500);
            }
          });
        },
        { threshold: 0.1, rootMargin: '50px' }
      );
      
      if (adRef.current) {
        observer.observe(adRef.current);
      }
      
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
        if (observer) observer.disconnect();
      };
    }
  }, [mounted, adLoaded]);

  if (!mounted) {
    return (
      <div className={`hidden lg:block ${className}`} style={{ width: '160px', minHeight: '100px' }}>
        <div style={{ width: '160px', height: '100px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#9ca3af', fontSize: '12px' }}>Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`hidden lg:block ${className}`} style={{ width: '160px', minHeight: '100px' }}>
      <div ref={adRef} style={{ width: '160px', height: '100px', position: 'relative' }}>
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            width: '160px',
            height: '100px',
            position: 'absolute',
            top: 0,
            left: 0
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