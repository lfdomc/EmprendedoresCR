'use client';

import { useEffect, useRef, useState } from 'react';

interface GoogleAdsenseBannerProps {
  adSlot: string;
  className?: string;
}

export function GoogleAdsenseBanner({ adSlot, className = "" }: GoogleAdsenseBannerProps) {
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
            }, 300);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '20px'
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
    <div ref={containerRef} className={`w-full ${className}`} style={{ minHeight: '90px' }}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '90px' }}
        data-ad-client="ca-pub-4334054982108939"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}