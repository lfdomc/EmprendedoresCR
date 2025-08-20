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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.boundingClientRect.width > 0) {
            // Esperar un poco más para asegurar que el layout esté completamente renderizado
            setTimeout(() => {
              if (containerRef.current && containerRef.current.offsetWidth > 0) {
                try {
                  (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle = 
                    (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || [];
                  (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle.push({});
                  setAdLoaded(true);
                  observer.disconnect();
                } catch (error) {
                  console.error('Error loading AdSense ad:', error);
                }
              }
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