'use client';

import { useEffect, useRef, useState } from 'react';

interface SideBannerProps {
  adSlot: string;
  className?: string;
}

export default function SideBanner({ adSlot, className = '' }: SideBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && adRef.current) {
      const timer = setTimeout(() => {
        try {
           (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle = (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || [];
           (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle.push({});
        } catch (error) {
          console.error('Error loading AdSense ad:', error);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div className={`hidden lg:block ${className}`} style={{ width: '160px', minHeight: '600px' }}>
      <div ref={adRef} style={{ width: '160px', height: '600px' }}>
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            width: '160px',
            height: '600px'
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